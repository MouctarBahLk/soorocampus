// app/api/admin/messages/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const json = (d: any, s = 200) =>
  new NextResponse(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json' } })

async function requireAdmin() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { ok: false, code: 401 as const, sb }
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin') return { ok: false, code: 403 as const, sb }
  return { ok: true, sb }
}

export async function GET(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return json({ error: 'forbidden' }, auth.code)
  const sb = auth.sb

  const url = new URL(req.url)
  const userId = url.searchParams.get('user_id')

  if (userId) {
    const { data, error } = await sb
      .from('messages')
      .select('id, contenu, created_at, is_from_admin, user_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) return json({ error: error.message }, 500)

    const messages = (data ?? []).map(m => ({
      id: m.id,
      body: m.contenu,
      created_at: m.created_at,
      user_id: m.user_id,
      is_from_admin: m.is_from_admin,
    }))
    return json({ messages })
  }

  // Dernier message par user
  const { data, error } = await sb
    .from('messages')
    .select('user_id, contenu, created_at, profiles!inner(full_name, email)')
    .order('created_at', { ascending: false })

  if (error) return json({ error: error.message }, 500)

  const seen = new Set<string>()
  const conversations: any[] = []
  for (const row of data ?? []) {
    if (seen.has(row.user_id)) continue
    seen.add(row.user_id)

    // `profiles` peut arriver comme objet OU tableau selon la relation -> on sécurise
    const prof: any = Array.isArray((row as any).profiles)
      ? (row as any).profiles[0]
      : (row as any).profiles

    conversations.push({
      user_id: row.user_id,
      user_email: prof?.email || 'inconnu',
      user_name: prof?.full_name || undefined,
      last_message: row.contenu || '',
      unread: 0,
    })
  }
  return json({ conversations })
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return json({ error: 'forbidden' }, auth.code)
  const sb = auth.sb

  const payload = await req.json().catch(() => null)
  const toUser = (payload?.user_id ?? '').trim()
  const text = (payload?.body ?? '').trim()
  if (!toUser) return json({ error: 'missing_user_id' }, 400)
  if (!text) return json({ error: 'empty' }, 400)

  const { data, error } = await sb
    .from('messages')
    .insert({ user_id: toUser, contenu: text, is_from_admin: true, repondu: true })
    .select('id, contenu, created_at, is_from_admin, user_id')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({
    ok: true,
    message: {
      id: data.id,
      body: data.contenu,           // <-- API stable
      created_at: data.created_at,
      user_id: data.user_id,
      is_from_admin: data.is_from_admin,
    }
  }, 201)
}

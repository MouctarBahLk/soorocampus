// app/api/messages/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

function json(data: any, init?: number | ResponseInit) {
  const resInit: ResponseInit = typeof init === 'number' ? { status: init } : init || {}
  return new NextResponse(JSON.stringify(data), {
    ...resInit,
    headers: { 'content-type': 'application/json', ...(resInit?.headers || {}) }
  })
}

export async function GET() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const { data, error } = await sb
    .from('messages')
    .select('id, user_id, contenu, is_from_admin, repondu, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return json({ error: error.message }, 500)

  // ➜ on renvoie toujours `body` au front
  const messages = (data ?? []).map(m => ({
    id: m.id,
    user_id: m.user_id,
    body: m.contenu,
    is_from_admin: m.is_from_admin,
    repondu: m.repondu,
    created_at: m.created_at,
  }))
  return json({ messages }, 200)
}

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const payload = await req.json().catch(() => ({}))
  const raw = typeof payload.body === 'string' ? payload.body.trim() : ''
  if (!raw) return json({ error: 'invalid_body' }, 400)

  const { data, error } = await sb
    .from('messages')
    .insert({ user_id: user.id, contenu: raw, is_from_admin: false })
    .select('id, user_id, contenu, is_from_admin, repondu, created_at')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({
    ok: true,
    message: {
      id: data.id,
      user_id: data.user_id,
      body: data.contenu,          // <-- API reste stable
      is_from_admin: data.is_from_admin,
      repondu: data.repondu,
      created_at: data.created_at,
    }
  }, 201)
}

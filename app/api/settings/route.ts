// app/api/settings/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const json = (d: any, s = 200) => new NextResponse(JSON.stringify(d), {
  status: s,
  headers: { 'content-type': 'application/json' },
})

async function requireAdmin() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { ok: false as const, code: 401, sb }
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin') return { ok: false as const, code: 403, sb }
  return { ok: true as const, sb }
}

// GET /api/settings?key=fee_amount_cents  (optionnel: sans key => tout)
export async function GET(req: Request) {
  const sb = await supabaseServer()
  const url = new URL(req.url)
  const key = url.searchParams.get('key')

  if (key) {
    const { data, error } = await sb.from('settings').select('key,value').eq('key', key).maybeSingle()
    if (error) return json({ error: error.message }, 500)
    return json({ key, value: data?.value?.v })
  }

  const { data, error } = await sb.from('settings').select('key,value').order('key')
  if (error) return json({ error: error.message }, 500)
  const all: Record<string, any> = {}
  for (const row of data ?? []) all[row.key] = row.value?.v
  return json({ settings: all })
}

// PUT /api/settings  body: { changes: { site_name?: string, fee_amount_cents?: number, ... } }
export async function PUT(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return json({ error: 'forbidden' }, auth.code)
  const sb = auth.sb

  const body = await req.json().catch(() => null)
  const changes: Record<string, any> = body?.changes || {}
  const { data: { user } } = await sb.auth.getUser()

  const rows = Object.entries(changes).map(([key, v]) => ({
    key, value: { v }, updated_by: user?.id ?? null, updated_at: new Date().toISOString(),
  }))
  if (!rows.length) return json({ ok: true })

  const { error } = await sb.from('settings').upsert(rows, { onConflict: 'key' })
  if (error) return json({ error: error.message }, 500)
  return json({ ok: true })
}

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const json = (d:any, s=200)=> new NextResponse(JSON.stringify(d), { status:s, headers:{'content-type':'application/json'} })

async function requireAdmin() {
  const sb = await supabaseServer()
  const { data:{ user } } = await sb.auth.getUser()
  if (!user) return { ok:false as const, code:401, sb }
  const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin') return { ok:false as const, code:403, sb }
  return { ok:true as const, sb }
}

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return json({ error:'forbidden' }, auth.code)
  const sb = auth.sb

  const { data, error } = await sb.from('settings').select('key, value')
  if (error) return json({ error:error.message }, 500)

  // transforme [{key, value:{value:...}}] -> { key: value }
  const settings = Object.fromEntries((data||[]).map(r => [r.key, r.value?.value]))
  return json({ settings })
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return json({ error:'forbidden' }, auth.code)
  const sb = auth.sb

  const payload = await req.json().catch(()=> ({}))
  // payload attendu: { site_name, contact_email, phone, currency, fee_cents, notify_new_app, notify_message, notify_payment }

  const entries = Object.entries(payload).map(([k,v]) => ({ key:k, value:{ value:v } }))
  if (!entries.length) return json({ ok:true })

  const { error } = await sb.from('settings').upsert(entries, { onConflict:'key' })
  if (error) return json({ error:error.message }, 500)

  return json({ ok:true })
}

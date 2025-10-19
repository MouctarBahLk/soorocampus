import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: me } = await sb.from('profiles').select('role').eq('user_id', user.id).single()
  if (me?.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const form = await req.formData()
  const applicationId = form.get('applicationId') as string
  const status = form.get('status') as string

  await sb.from('applications').update({ statut: status }).eq('id', applicationId)
  return NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL), 303)
}

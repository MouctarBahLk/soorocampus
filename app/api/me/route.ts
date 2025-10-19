import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ role: null, email: null })
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
  return NextResponse.json({ role: me?.role ?? 'etudiant', email: user.email })
}

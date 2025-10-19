import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(_req: NextRequest) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: profile, error } = await sb
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (profile?.avatar_url) {
    await sb.storage.from('avatars').remove([profile.avatar_url]).catch(() => {})
  }

  const clr = await sb.from('profiles').update({ avatar_url: null }).eq('id', user.id)
  if (clr.error) return NextResponse.json({ error: clr.error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

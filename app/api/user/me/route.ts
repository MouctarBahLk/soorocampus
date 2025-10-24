// app/api/user/me/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const { data: profile } = await sb
      .from('profiles')
      .select('split_payment_enabled, role, payment_status, first_name, last_name')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role ?? 'student',
        split_payment_enabled: !!profile?.split_payment_enabled,
        payment_status: profile?.payment_status ?? 'none',
        first_name: profile?.first_name,
        last_name: profile?.last_name,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ user: null, error: e?.message }, { status: 500 })
  }
}

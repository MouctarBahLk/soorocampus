// app/api/payments/eligibility/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ can_split: false }, { status: 401 })

    const { data: profile } = await sb
      .from('profiles')
      .select('split_payment_enabled')
      .eq('id', user.id)
      .single()

    const { data: pricingRow } = await sb
      .from('settings')
      .select('value')
      .eq('key', 'pricing')
      .single()

    const allowSplit = !!pricingRow?.value?.allow_split_payment
    const userFlag   = !!profile?.split_payment_enabled

    return NextResponse.json({ can_split: allowSplit && userFlag })
  } catch (e: any) {
    return NextResponse.json({ can_split: false, error: e?.message }, { status: 500 })
  }
}

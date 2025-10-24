// app/api/pricing/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data } = await sb.from('settings').select('value').eq('key', 'pricing').single()
    const settings = data?.value ?? {
      price_eur: 15000,
      price_xof: 100000,
      price_gnf: 1500000,
      allow_split_payment: false,
    }
    return NextResponse.json({ settings })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

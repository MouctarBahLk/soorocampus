// app/api/payments/webhook/flutterwave/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const sb = await supabaseServer()
    // TODO: vérifier signature via header 'verif-hash'
    const body = await req.json()
    const paymentId = body?.data?.tx_ref // si tu avais mis paymentId comme tx_ref
    const status = body?.data?.status     // "successful"

    if (!paymentId) return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })

    if (status === 'successful') {
      await sb.from('payments').update({ status: 'succeeded' }).eq('id', paymentId)
    } else {
      await sb.from('payments').update({ status: 'failed' }).eq('id', paymentId)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Webhook error' }, { status: 500 })
  }
}

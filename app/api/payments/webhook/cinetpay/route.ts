// app/api/payments/webhook/cinetpay/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const sb = supabaseAdmin()
    const body = await req.json().catch(() => ({}))

    const transaction_id =
      body?.transaction_id ||
      body?.cpm_trans_id ||
      body?.data?.transaction_id

    if (!transaction_id) {
      return NextResponse.json({ error: 'transaction_id manquant' }, { status: 400 })
    }

    const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY!
    const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID!

    // Vérification server-to-server
    const checkPayload = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id,
    }

    const checkResp = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkPayload),
    })
    const checkJson = await checkResp.json().catch(() => ({} as any))

    const statusRaw: string =
      checkJson?.data?.status ||
      checkJson?.status ||
      checkJson?.cpm_result ||
      'PENDING'
    const status = String(statusRaw).toUpperCase()

    if (status.includes('ACCEPT')) {
      await sb.from('payments').update({ status: 'succeeded' }).eq('id', transaction_id)
    } else if (status.includes('REFUS') || status.includes('FAIL') || status.includes('CANCEL')) {
      await sb.from('payments').update({ status: 'failed' }).eq('id', transaction_id)
    } else {
      await sb.from('payments').update({ status: 'pending' }).eq('id', transaction_id)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Webhook error' }, { status: 500 })
  }
}

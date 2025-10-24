// app/api/payments/webhook/cinetpay/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/** Exposants ISO 4217 (unités mineures) */
const CURRENCY_EXPONENT: Record<'EUR' | 'XOF' | 'GNF', number> = {
  EUR: 2,
  XOF: 0,
  GNF: 0,
}

/** Normalise un montant "pricing" (qui peut être en euros ou centimes) -> unités mineures */
function normalizeToMinor(amountFromSettings: number, currency: 'EUR' | 'XOF' | 'GNF'): number {
  const exp = CURRENCY_EXPONENT[currency]
  if (exp === 0) return Math.round(amountFromSettings)
  if (amountFromSettings < 1000) return Math.round(amountFromSettings * 10 ** exp) // ex: 150 -> 15000
  return Math.round(amountFromSettings) // déjà en centimes
}

export async function POST(req: Request) {
  try {
    const sb = supabaseAdmin()
    const body = await req.json().catch(() => ({} as any))

    const transaction_id =
      body?.transaction_id ||
      body?.cpm_trans_id ||
      body?.data?.transaction_id

    if (!transaction_id) {
      return NextResponse.json({ error: 'transaction_id manquant' }, { status: 400 })
    }

    // On récupère d'abord notre ligne payment pour connaître user_id & currency
    const { data: paymentRow } = await sb
      .from('payments')
      .select('id, user_id, amount, currency, status')
      .eq('id', transaction_id)
      .single()

    if (!paymentRow) {
      // La ligne n’existe pas chez nous : on stoppe proprement
      return NextResponse.json({ ok: true, note: 'payment row not found (ignored)' })
    }

    const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY!
    const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID!

    // Vérif server-to-server
    const checkResp = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id,
      }),
    })
    const checkJson = await checkResp.json().catch(() => ({} as any))

    const statusRaw: string =
      checkJson?.data?.status ||
      checkJson?.status ||
      checkJson?.cpm_result ||
      'PENDING'
    const status = String(statusRaw).toUpperCase()

    let newStatus: 'succeeded' | 'failed' | 'pending' = 'pending'
    if (status.includes('ACCEPT')) newStatus = 'succeeded'
    else if (status.includes('REFUS') || status.includes('FAIL') || status.includes('CANCEL')) newStatus = 'failed'
    else newStatus = 'pending'

    // On met à jour le statut pour cette transaction
    await sb.from('payments').update({ status: newStatus }).eq('id', transaction_id)

    // Si payé, on calcule le cumul payé par l'utilisateur et on met à jour profiles.payment_status
    if (newStatus === 'succeeded') {
      const userId = paymentRow.user_id
      const currency = paymentRow.currency as 'EUR' | 'XOF' | 'GNF'

      // Somme des paiements déjà "succeeded" (mêmes unités mineures)
      const { data: paidRows } = await sb
        .from('payments')
        .select('amount, currency, status')
        .eq('user_id', userId)
        .eq('status', 'succeeded')

      const totalPaidMinor = (paidRows ?? [])
        .filter(r => r.currency === currency)
        .reduce((s, r) => s + (r.amount || 0), 0)

      // Récupère la tarification
      const { data: pricingRow } = await sb
        .from('settings')
        .select('value')
        .eq('key', 'pricing')
        .single()

      const pricing = pricingRow?.value ?? {
        price_eur: 15000,
        price_xof: 100000,
        price_gnf: 1500000,
        allow_split_payment: false,
      }

      // Prix cible dans la même devise (unités mineures)
      const targetMinor = currency === 'EUR'
        ? normalizeToMinor(Number(pricing.price_eur), 'EUR')
        : currency === 'XOF'
          ? normalizeToMinor(Number(pricing.price_xof), 'XOF')
          : normalizeToMinor(Number(pricing.price_gnf), 'GNF')

      const nextStatus = totalPaidMinor >= targetMinor ? 'full' : 'partial'

      await sb.from('profiles').update({ payment_status: nextStatus }).eq('id', userId)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Webhook error' }, { status: 500 })
  }
}

// ✅ version corrigée
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase-server'

// ❌ enlève apiVersion ici
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { data: feeRow } = await sb
      .from('settings').select('value').eq('key', 'fee_amount_cents').maybeSingle()
    const amountCents = Number(feeRow?.value?.v ?? 2500)

    const currencyRow = await sb
      .from('settings').select('value').eq('key', 'currency').maybeSingle()
    const currency = (currencyRow.data?.value?.v || 'EUR').toString().toLowerCase()

    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      metadata: { user_id: user.id },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: pi.client_secret })
  } catch (e: any) {
    console.error('Erreur Stripe route:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

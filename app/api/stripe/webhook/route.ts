import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'
import { sendPaymentConfirmation, sendPaymentReceipt } from '@/lib/email'

export async function POST(req: Request) {
  if (!stripe) return new NextResponse('Stripe non configuré', { status: 500 })

  const sig = req.headers.get('stripe-signature')!
  const raw = await req.text()

  let event

  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ✅ Gestion du paiement réussi
  if (event.type === 'payment_intent.succeeded') {
    const intent: any = event.data.object
    const sb = await supabaseServer()
    
    // Enregistrer dans la base de données
    await sb.from('payments').insert({
      id: intent.id,
      user_id: intent.metadata?.user_id ?? null,
      amount: intent.amount,
      currency: intent.currency,
      status: 'succeeded',
      receipt_url: intent.charges?.data?.[0]?.receipt_url ?? null,
    })
    
    // 📧 Envoyer les emails
    const userEmail = intent.metadata?.user_email
    const userName = intent.metadata?.user_name || 'étudiant'
    const courseName = intent.metadata?.course_name || 'Formation Sooro Campus'
    const receiptUrl = intent.charges?.data?.[0]?.receipt_url
    
    if (userEmail) {
      // Email de confirmation
      await sendPaymentConfirmation(
        userEmail,
        userName,
        intent.amount,
        courseName
      )
      
      // Email avec reçu (si disponible)
      if (receiptUrl) {
        await sendPaymentReceipt(
          userEmail,
          userName,
          receiptUrl,
          intent.amount,
          intent.id
        )
      }
    }
  }

  // ✅ Checkout session completé
  if (event.type === 'checkout.session.completed') {
    const session: any = event.data.object
    const sb = await supabaseServer()
    
    await sb.from('payments').insert({
      id: session.payment_intent,
      user_id: session.client_reference_id ?? null,
      amount: session.amount_total,
      currency: session.currency,
      status: 'succeeded',
      receipt_url: session.receipt_url ?? null,
    })
  }

  return NextResponse.json({ received: true })
}
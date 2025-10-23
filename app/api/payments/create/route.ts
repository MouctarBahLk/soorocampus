// app/api/payments/create/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import {
  COUNTRY_TO_CURRENCY,
  CountryCode,
} from '@/lib/payments/config'
import { priceForCurrency } from '@/lib/payments/pricing'

type Body = {
  country: CountryCode
  method: 'mobile_money' | 'card'
  phone?: string
  operator?: 'orange' | 'mtn' | 'moov'
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const { country, method, phone, operator } = body || {}

    console.log('📥 Body reçu:', body)

    if (!country || !method) {
      return NextResponse.json({ error: 'Paramètres manquants (country ou method)' }, { status: 400 })
    }

    // Vérification des variables d'environnement
    const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY
    const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID
    
    if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID) {
      console.error('❌ Variables CinetPay manquantes')
      console.error('CINETPAY_API_KEY:', CINETPAY_API_KEY ? '✓ défini' : '✗ manquant')
      console.error('CINETPAY_SITE_ID:', CINETPAY_SITE_ID ? '✓ défini' : '✗ manquant')
      return NextResponse.json({ 
        error: 'Configuration paiement manquante' 
      }, { status: 500 })
    }

    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      console.error('❌ Utilisateur non authentifié')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const currency = COUNTRY_TO_CURRENCY[country]
    const amount = priceForCurrency(currency)
    const transaction_id = crypto.randomUUID()

    console.log('📝 Création paiement:', { 
      transaction_id, 
      amount, 
      currency, 
      method, 
      phone, 
      operator,
      user_id: user.id 
    })

    // 1) Insert en DB
    const { error: insErr } = await sb
      .from('payments')
      .insert({
        id: transaction_id,
        user_id: user.id,
        amount,
        currency,
        status: 'pending',
      } as any)

    if (insErr) {
      console.error('❌ Erreur DB:', insErr)
      return NextResponse.json({ error: insErr.message }, { status: 500 })
    }

    console.log('✅ Transaction créée en DB')

    // 2) Appel CinetPay
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Choix du canal selon le type de paiement
    const channels = method === 'card' ? 'CREDIT_CARD' : 'MOBILE_MONEY'
    
    const payload: any = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id,
      amount,
      currency,
      description: 'Activation accompagnement Campus France',
      notify_url: `${APP_URL}/api/payments/webhook/cinetpay`,
      return_url: `${APP_URL}/app/paiements/success`,
      channels,
      customer_name: user.email?.split('@')[0] || 'client',
      customer_email: user.email ?? undefined,
      metadata: JSON.stringify({ user_id: user.id, country, method, operator }),
    }
    
    // Ajouter le numéro seulement pour Mobile Money
    if (method === 'mobile_money' && phone) {
      payload.customer_phone_number = phone
    }

    console.log('🚀 Appel CinetPay avec channels:', channels)
    console.log('📦 Payload:', JSON.stringify(payload, null, 2))

    const resp = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await resp.json().catch(() => ({} as any))
    console.log('📥 Réponse CinetPay:', JSON.stringify(json, null, 2))

    const paymentUrl = json?.data?.payment_url as string | undefined

    if (!resp.ok || !paymentUrl) {
      await sb.from('payments')
        .update({ status: 'failed' })
        .eq('id', transaction_id)
      
      const message = json?.message || json?.description || 'Création CinetPay échouée'
      console.error('❌ Échec CinetPay:', message)
      console.error('Code:', json?.code)
      console.error('Description:', json?.description)
      return NextResponse.json({ error: message }, { status: 500 })
    }

    // 3) Stocker l'URL
    await sb.from('payments')
      .update({ receipt_url: paymentUrl })
      .eq('id', transaction_id)

    console.log('✅ Paiement créé avec succès')
    console.log('🔗 URL de paiement:', paymentUrl)
    
    return NextResponse.json({ paymentUrl })

  } catch (e: any) {
    console.error('❌ Erreur serveur:', e)
    console.error('Stack:', e.stack)
    return NextResponse.json({ error: e?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}
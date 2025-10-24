// app/api/payments/create/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { COUNTRY_TO_CURRENCY, CountryCode } from '@/lib/payments/config'

type Body = {
  country: CountryCode
  method: 'mobile_money' | 'card'
  phone?: string
  operator?: 'orange' | 'mtn' | 'moov'
  split_payment?: boolean // ignoré côté serveur (on force selon l’éligibilité)
}

/**
 * ISO 4217 exponents
 * EUR -> 2 (centimes), XOF/GNF -> 0 (pas de décimales)
 */
const CURRENCY_EXPONENT: Record<'EUR' | 'XOF' | 'GNF', number> = {
  EUR: 2,
  XOF: 0,
  GNF: 0,
}

/** Convertit un montant en unités mineures -> chaîne en unités majeures pour CinetPay */
function toGatewayAmount(minorAmount: number, currency: 'EUR' | 'XOF' | 'GNF'): string {
  const exp = CURRENCY_EXPONENT[currency]
  const major = minorAmount / Math.pow(10, exp)
  return exp > 0 ? major.toFixed(exp) : String(Math.round(major))
}

/**
 * Normalise la source "pricing": certains environnements stockent EUR en centimes (15000),
 * d'autres en euros (150). Cette fonction retourne toujours un montant en unités mineures.
 */
function normalizeToMinor(amountFromSettings: number, currency: 'EUR' | 'XOF' | 'GNF'): number {
  const exp = CURRENCY_EXPONENT[currency]
  if (exp === 0) return Math.round(amountFromSettings) // XOF/GNF: déjà "entier"
  // EUR: si on reçoit un nombre < 1000, on suppose que c’est en euros -> *100
  if (amountFromSettings < 1000) return Math.round(amountFromSettings * 10 ** exp)
  return Math.round(amountFromSettings) // déjà en centimes
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const { country, method, phone, operator } = body || {}

    console.log('📥 Body reçu:', body)

    if (!country || !method) {
      return NextResponse.json(
        { error: 'Paramètres manquants (country ou method)' },
        { status: 400 }
      )
    }

    const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY
    const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID

    if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID) {
      console.error('❌ Variables CinetPay manquantes')
      return NextResponse.json(
        { error: 'Configuration paiement manquante' },
        { status: 500 }
      )
    }

    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      console.error('❌ Utilisateur non authentifié')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil complet de l'utilisateur
    const { data: profile } = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profil utilisateur introuvable' }, { status: 404 })
    }

    // Récupérer les prix depuis settings
    const { data: pricingRow } = await sb
      .from('settings')
      .select('value')
      .eq('key', 'pricing')
      .single()

    // Valeurs fallback (supportent deux formats: euros ou centimes)
    const pricing =
      pricingRow?.value || {
        price_eur: 15000, // peut être 150 (euros) ou 15000 (centimes) suivant l'env
        price_xof: 100000,
        price_gnf: 1500000,
        allow_split_payment: false,
      }

    const currency = COUNTRY_TO_CURRENCY[country] as 'EUR' | 'XOF' | 'GNF'

    // ---- Calcul du montant en unités mineures (DB) ----
    let baseMinor = 0
    switch (currency) {
      case 'EUR':
        baseMinor = normalizeToMinor(Number(pricing.price_eur), 'EUR')
        break
      case 'XOF':
        baseMinor = normalizeToMinor(Number(pricing.price_xof), 'XOF')
        break
      case 'GNF':
        baseMinor = normalizeToMinor(Number(pricing.price_gnf), 'GNF')
        break
    }

    // ✅ Source de vérité côté serveur : on FORCE le 2× si éligible
    const eligibleForSplit =
      !!pricing?.allow_split_payment && !!profile?.split_payment_enabled

    const isSplitPayment = eligibleForSplit // on ignore body.split_payment
    let amountMinor = isSplitPayment ? Math.round(baseMinor / 2) : baseMinor

    console.log('⚖️ Éligibilité 2×:', {
      allow_split_payment_global: !!pricing?.allow_split_payment,
      user_split_payment_enabled: !!profile?.split_payment_enabled,
      eligibleForSplit,
      isSplitPayment,
      baseMinor,
      amountMinor,
      currency
    })

    const transaction_id = crypto.randomUUID()

    console.log('📝 Création paiement:', {
      transaction_id,
      amount_minor: amountMinor,
      currency,
      method,
      split_payment: isSplitPayment,
      phone,
      operator,
      user_id: user.id,
    })

    // 1) Insert en DB (toujours en unités mineures)
    const { error: insErr } = await sb.from('payments').insert({
      id: transaction_id,
      user_id: user.id,
      amount: amountMinor, // mineures
      currency,
      status: 'pending',
      metadata: {
        split_payment: isSplitPayment,
        payment_number: isSplitPayment ? 1 : null,
      },
    } as any)

    if (insErr) {
      console.error('❌ Erreur DB:', insErr)
      return NextResponse.json({ error: insErr.message }, { status: 500 })
    }

    console.log('✅ Transaction créée en DB')

    // 2) Appel CinetPay
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const channels = method === 'card' ? 'CREDIT_CARD' : 'MOBILE_MONEY'

    // Données client (requis carte bancaire)
    const customerName = profile.first_name || user.email?.split('@')[0] || 'Prénom'
    const customerSurname = profile.last_name || 'Nom'
    const customerPhone = profile.phone || phone || '+224000000000'
    const customerAddress = profile.address || '123 Rue Example'
    const customerCity = profile.city || 'Conakry'
    const customerZipCode = profile.postal_code || '00000'
    const customerCountry = country

    // Conversion vers unités majeures pour la passerelle
    const amountForGateway = toGatewayAmount(amountMinor, currency)

    // Garde-fou plafond CinetPay EUR
    if (currency === 'EUR' && Number(amountForGateway) > 3000) {
      console.warn('⛔ Montant EUR > 3000, rejeté avant CinetPay')
      await sb.from('payments').update({ status: 'failed' }).eq('id', transaction_id)
      return NextResponse.json(
        { error: 'Le montant dépasse le plafond de 3000 € autorisé par le prestataire de paiement.' },
        { status: 400 }
      )
    }

    const payload: any = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id,
      amount: amountForGateway, // <-- unités majeures: "150.00" pour 150 €
      currency,                 // "EUR" | "XOF" | "GNF"
      description: isSplitPayment
        ? 'Accompagnement Campus France (1/2)'
        : 'Activation accompagnement Campus France',
      notify_url: `${APP_URL}/api/payments/webhook/cinetpay`,
      return_url: `${APP_URL}/app/paiements/success`,
      channels,
      customer_name: customerName,
      customer_surname: customerSurname,
      customer_email: user.email,
      customer_phone_number: customerPhone,
      customer_address: customerAddress,
      customer_city: customerCity,
      customer_zip_code: customerZipCode,
      customer_country: customerCountry,
      metadata: JSON.stringify({
        user_id: user.id,
        country,
        method,
        operator,
        split_payment: isSplitPayment,
      }),
    }

    console.log('🚀 Appel CinetPay avec channels:', channels)
    console.log('👤 Données client:', {
      name: customerName,
      surname: customerSurname,
      email: user.email,
      phone: customerPhone,
      address: customerAddress,
      city: customerCity,
      zip: customerZipCode,
      country: customerCountry,
    })
    console.log('💶 Montant envoyé à CinetPay:', payload.amount, payload.currency, payload.channels)

    const resp = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await resp.json().catch(() => ({} as any))
    console.log('📥 Réponse CinetPay:', json)

    const paymentUrl = json?.data?.payment_url as string | undefined

    if (!resp.ok || !paymentUrl) {
      await sb.from('payments').update({ status: 'failed' }).eq('id', transaction_id)

      const message =
        json?.message || json?.description || json?.code || 'Création CinetPay échouée'
      console.error('❌ Échec CinetPay:', message)
      return NextResponse.json({ error: message }, { status: 500 })
    }

    await sb.from('payments').update({ receipt_url: paymentUrl }).eq('id', transaction_id)

    console.log('✅ Paiement créé avec succès:', paymentUrl)

    return NextResponse.json({ paymentUrl })
  } catch (e: any) {
    console.error('❌ Erreur serveur:', e)
    return NextResponse.json({ error: e?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}

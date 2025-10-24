// app/app/paiements/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Lock, Check, ArrowRight, CreditCard, AlertCircle } from 'lucide-react'
import { COUNTRY_TO_CURRENCY, CountryCode } from '@/lib/payments/config'
import { formatAmount } from '@/lib/payments/pricing'

const blue = "#0055FF"

// ✅ Corrigé: typage explicite pour éviter l'erreur "Type 'FR' is not assignable..."
const MOBILE_MONEY_COUNTRIES: CountryCode[] = ['GN', 'SN', 'CI', 'BJ', 'TG', 'ML', 'NE', 'BF']

const COUNTRIES: { code: CountryCode; label: string }[] = [
  { code: 'GN', label: 'Guinée' },
  { code: 'SN', label: 'Sénégal' },
  { code: 'CI', label: 'Côte dIvoire' },
  { code: 'BJ', label: 'Bénin' },
  { code: 'TG', label: 'Togo' },
  { code: 'ML', label: 'Mali' },
  { code: 'NE', label: 'Niger' },
  { code: 'BF', label: 'Burkina Faso' },
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
  { code: 'DE', label: 'Allemagne' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'MA', label: 'Maroc' },
  { code: 'OTHER', label: 'Autre pays' },
]

export default function PaiementsPage() {
  const [country, setCountry] = useState<CountryCode>('GN')
  const currency = useMemo(() => COUNTRY_TO_CURRENCY[country], [country])

  // Type de paiement
  const [paymentType, setPaymentType] = useState<'mobile_money' | 'card'>('card')
  const [operator, setOperator] = useState<'orange' | 'mtn' | 'moov' | ''>('orange')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tarification + 2×
  const [pricing, setPricing] = useState({
    price_eur: 15000,
    price_xof: 100000,
    price_gnf: 1500000,
    allow_split_payment: false,
  })
  const [eligibleForSplit, setEligibleForSplit] = useState(false)
  const [splitPayment, setSplitPayment] = useState(false)

  // Statut côté serveur: 'none' | 'partial' | 'full'
  const [paymentStatus, setPaymentStatus] = useState<'none'|'partial'|'full'>('none')

  useEffect(() => {
    loadPricingAndFlags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPricingAndFlags() {
    setLoadingPricing(true)
    try {
      const [pricingRes, eligRes, meRes] = await Promise.all([
        fetch('/api/pricing', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/payments/eligibility', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/user/me', { credentials: 'include', cache: 'no-store' }),
      ])

      const pricingData = await pricingRes.json()
      if (pricingData.settings) setPricing(pricingData.settings)

      const elig = await eligRes.json()
      const eligible = !!elig.can_split
      setEligibleForSplit(eligible)
      setSplitPayment(eligible) // auto-coché si éligible

      const me = await meRes.json()
      if (me?.user?.payment_status) {
        setPaymentStatus(me.user.payment_status)
      } else {
        setPaymentStatus('none')
      }
    } catch (e) {
      console.error(e)
      setEligibleForSplit(false)
      setSplitPayment(false)
      setPaymentStatus('none')
    }
    setLoadingPricing(false)
  }

  // Changement de pays (ne pas toucher split)
  useEffect(() => {
    if (MOBILE_MONEY_COUNTRIES.includes(country)) setPaymentType('mobile_money')
    else setPaymentType('card')
    setOperator('orange')
    setPhone('')
    setError(null)
  }, [country])

  const isMobileMoneyAvailable = MOBILE_MONEY_COUNTRIES.includes(country)

  // Montant affiché (1/2 si 2×)
  const amountLocal = useMemo(() => {
    let base = 0
    switch (currency) {
      case 'EUR': base = pricing.price_eur; break
      case 'XOF': base = pricing.price_xof; break
      case 'GNF': base = pricing.price_gnf; break
    }
    if (eligibleForSplit && splitPayment) return Math.round(base / 2)
    return base
  }, [currency, pricing, eligibleForSplit, splitPayment])

  const label = useMemo(() => formatAmount(amountLocal, currency), [amountLocal, currency])

  const startPayment = async () => {
    try {
      setError(null)
      setLoading(true)

      // Validation mobile money
      if (paymentType === 'mobile_money' && (!phone || !operator)) {
        setError('Veuillez renseigner votre numéro et choisir un opérateur')
        setLoading(false)
        return
      }

      const body: any = {
        country,
        method: paymentType,
        // on envoie l’intention, mais le serveur FORCERA le 2× si éligible
        split_payment: eligibleForSplit && splitPayment,
      }
      if (paymentType === 'mobile_money') {
        body.phone = phone
        body.operator = operator
      }

      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Impossible de créer le paiement')
      if (!data.paymentUrl) throw new Error('URL de paiement manquante')
      window.location.href = data.paymentUrl
    } catch (e: any) {
      console.error('❌ Erreur paiement:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const canPay = paymentType === 'card' || (phone && operator)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>
        <p className="text-gray-600 mt-1">Active ton accompagnement Campus France</p>
      </div>

      {/* Bandeau solde à payer si 1er versement reçu */}
      {paymentStatus === 'partial' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">
            ✅ 1er versement reçu. Il reste le solde à payer pour que nous puissions
            <strong> envoyer ton dossier à Campus France</strong> et planifier l’entretien.
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Tu peux payer le montant restant à tout moment depuis cette page.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Pays */}
          <div className="space-y-2">
            <label className="font-medium">Ton pays</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value as CountryCode)}
              className="w-full rounded-xl border p-3"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              La devise et les moyens de paiement sont adaptés à ton pays (GNF / XOF / EUR).
            </p>
          </div>

          {/* Choix type */}
          <div className="space-y-3">
            <label className="font-medium">Moyen de paiement</label>
            <div className="grid grid-cols-2 gap-3">
              {isMobileMoneyAvailable && (
                <button
                  type="button"
                  onClick={() => setPaymentType('mobile_money')}
                  className={`p-4 rounded-xl border-2 font-semibold transition flex items-center justify-center gap-2 ${
                    paymentType === 'mobile_money'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                  Mobile Money
                </button>
              )}
              <button
                type="button"
                onClick={() => setPaymentType('card')}
                className={`p-4 rounded-xl border-2 font-semibold transition flex items-center justify-center gap-2 ${
                  paymentType === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300'
                } ${!isMobileMoneyAvailable ? 'col-span-2' : ''}`}
              >
                <CreditCard className="h-5 w-5" />
                Carte bancaire
              </button>
            </div>

            {!isMobileMoneyAvailable && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  Mobile Money n'est disponible que pour les pays d'Afrique de l'Ouest
                </p>
              </div>
            )}
          </div>

          {/* Mobile Money */}
          {paymentType === 'mobile_money' && isMobileMoneyAvailable && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Paiement Mobile Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opérateur</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setOperator('orange')}
                        className={`p-3 rounded-xl border-2 font-semibold transition ${
                          operator === 'orange'
                            ? 'border-orange-500 bg-orange-50 text-orange-900'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        Orange Money
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperator('mtn')}
                        className={`p-3 rounded-xl border-2 font-semibold transition ${
                          operator === 'mtn'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperator('moov')}
                        className={`p-3 rounded-xl border-2 font-semibold transition ${
                          operator === 'moov'
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        Moov Money
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone
                    </label>
                    <Input
                      type="tel"
                      placeholder="Ex: 620000010"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tu recevras une notification/USSD pour valider.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Montant à payer : <strong>{label}</strong>
                      {eligibleForSplit && splitPayment && (
                        <span className="block text-xs mt-1">
                          (1er versement sur 2)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Carte bancaire */}
          {paymentType === 'card' && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement par carte bancaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      Montant à payer : <strong>{label}</strong>
                      {eligibleForSplit && splitPayment && (
                        <span className="block text-xs mt-1">
                          (1er versement sur 2)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      Tu seras redirigé vers une page sécurisée pour saisir tes informations de carte.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Paiement accepté : Visa, Mastercard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ Explications 2× */}
          {eligibleForSplit && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
              <p className="text-sm text-blue-900 font-medium mb-1">
                Comment ça marche ?
              </p>
              <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
                <li>Après le 1<sup>er</sup> versement (50&nbsp;%), tu as accès au tableau de bord et à l’accompagnement.</li>
                <li><strong>Ton dossier n’est PAS envoyé</strong> à Campus France tant que le solde n’est pas payé.</li>
                <li>Tu peux régler le <strong>montant restant</strong> à tout moment depuis cette page.</li>
              </ul>
            </div>
          )}

          {/* Bouton */}
          <Button
            onClick={startPayment}
            disabled={loading || !canPay || loadingPricing}
            className="w-full py-6 rounded-xl text-lg font-bold shadow-lg"
            style={{ backgroundColor: blue }}
          >
            {loading ? 'Création du paiement…' : (
              <>Payer {label} <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
            <Smartphone className="h-4 w-4" />
            <Lock className="h-4 w-4" />
            <span>Paiement sécurisé via CinetPay</span>
          </div>
        </div>

        {/* Résumé */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <span className="font-medium">Frais de traitement</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-700 block">
                    {label}
                  </span>
                  {eligibleForSplit && splitPayment && (
                    <span className="text-xs text-blue-600">(1/2 versements)</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Accès complet au tableau de bord</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Suivi en temps réel de ton dossier</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Accompagnement personnalisé</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">⚠️ Aucun remboursement après validation.</p>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Paiement 100% sécurisé</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

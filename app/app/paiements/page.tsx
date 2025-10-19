// app/app/paiements/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Smartphone, Lock, Check, ArrowRight } from 'lucide-react'

import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const blue = "#0055FF"
const ZERO_DEC = new Set([
  'BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF'
])

function formatAmount(amountMinor: number, currency: string) {
  const cur = (currency || 'EUR').toUpperCase()
  const value = ZERO_DEC.has(cur) ? amountMinor : amountMinor / 100
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur }).format(value)
}

function CardPaymentForm({ label }: { label: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          typeof window !== 'undefined'
            ? window.location.origin + '/app/paiements?status=success'
            : 'http://localhost:3000/app/paiements?status=success',
      },
    })
    setSubmitting(false)
    if (error) alert(error.message)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800">
          🔒 Paiement 100% sécurisé via Stripe. Aucune donnée carte n’est stockée chez nous.
        </p>
      </div>
      <Button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full py-6 rounded-xl text-lg font-bold shadow-lg"
        style={{ backgroundColor: blue }}
      >
        <span className="flex items-center justify-center">
          {submitting ? 'Paiement en cours...' : <>Payer {label} <ArrowRight className="ml-2 h-5 w-5" /></>}
        </span>
      </Button>
    </form>
  )
}

export default function PaiementsPage() {
  const [selectedMethod, setSelectedMethod] = useState<'orange' | 'momo' | 'card' | null>(null)
  const [loading, setLoading] = useState(false)

  // settings (depuis /api/settings)
  const [amountMinor, setAmountMinor] = useState<number>(2500) // montant au plus petit incrément
  const [currency, setCurrency] = useState<string>('EUR')

  // Orange
  const [orangePhone, setOrangePhone] = useState('')
  // MoMo
  const [momoPhone, setMomoPhone] = useState('')
  const [momoOperator, setMomoOperator] = useState<'mtn' | 'moov' | ''>('')

  // Stripe clientSecret quand on choisit "card"
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Charger settings une seule fois
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/settings', { credentials: 'include' })
      const data = await res.json()
      if (data?.settings?.fee_amount_cents) setAmountMinor(Number(data.settings.fee_amount_cents))
      if (data?.settings?.currency) setCurrency(String(data.settings.currency))
    })()
  }, [])

  // Initialiser le PaymentIntent uniquement si “carte” sélectionné
  useEffect(() => {
    (async () => {
      if (selectedMethod !== 'card') return
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      setClientSecret(data.clientSecret || null)
    })()
  }, [selectedMethod])

  const label = useMemo(() => formatAmount(amountMinor, currency), [amountMinor, currency])

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    if (selectedMethod === 'card') return
    setLoading(true)
    // ici, c’est juste une démo pour Orange/MoMo
    setTimeout(() => {
      setLoading(false)
      alert('Paiement envoyé ! Vous recevrez une confirmation par email.')
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>
        <p className="text-gray-600 mt-1">Active ton accompagnement Campus France</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Méthodes de paiement */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Orange Money */}
            <button
              onClick={() => setSelectedMethod('orange')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedMethod === 'orange'
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedMethod === 'orange' ? 'bg-orange-500' : 'bg-orange-100'
                }`}>
                  <Smartphone className={`h-8 w-8 ${
                    selectedMethod === 'orange' ? 'text-white' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Orange Money</p>
                  <p className="text-xs text-gray-500 mt-1">Paiement mobile</p>
                </div>
              </div>
            </button>

            {/* Mobile Money */}
            <button
              onClick={() => setSelectedMethod('momo')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedMethod === 'momo'
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedMethod === 'momo' ? 'bg-emerald-500' : 'bg-emerald-100'
                }`}>
                  <Smartphone className={`h-8 w-8 ${
                    selectedMethod === 'momo' ? 'text-white' : 'text-emerald-600'
                  }`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mobile Money</p>
                  <p className="text-xs text-gray-500 mt-1">MTN ou Moov</p>
                </div>
              </div>
            </button>

            {/* Carte */}
            <button
              onClick={() => setSelectedMethod('card')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedMethod === 'card' ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  <CreditCard className={`h-8 w-8 ${
                    selectedMethod === 'card' ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Carte Bancaire</p>
                  <p className="text-xs text-gray-500 mt-1">Visa, Mastercard</p>
                </div>
              </div>
            </button>
          </div>

          {/* Formulaires conditionnels */}
          {selectedMethod && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>
                  {selectedMethod === 'orange' && 'Paiement Orange Money'}
                  {selectedMethod === 'momo' && 'Paiement Mobile Money'}
                  {selectedMethod === 'card' && 'Paiement par Carte Bancaire'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Orange & MoMo (démo) */}
                {(selectedMethod === 'orange' || selectedMethod === 'momo') && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    {selectedMethod === 'orange' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro Orange Money
                          </label>
                          <Input
                            type="tel"
                            placeholder="XX XX XX XX XX"
                            value={orangePhone}
                            onChange={(e) => setOrangePhone(e.target.value)}
                            className="rounded-xl"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Format : 77 ou 78 suivi de 7 chiffres
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <p className="text-sm text-orange-800">
                            📱 Vous recevrez une notification sur votre téléphone pour valider le paiement
                          </p>
                        </div>
                      </>
                    )}

                    {selectedMethod === 'momo' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opérateur
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setMomoOperator('mtn')}
                              className={`p-4 rounded-xl border-2 font-semibold transition ${
                                momoOperator === 'mtn'
                                  ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                                  : 'border-gray-200 hover:border-yellow-300'
                              }`}
                            >
                              MTN Mobile Money
                            </button>
                            <button
                              type="button"
                              onClick={() => setMomoOperator('moov')}
                              className={`p-4 rounded-xl border-2 font-semibold transition ${
                                momoOperator === 'moov'
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
                            placeholder="XX XX XX XX XX"
                            value={momoPhone}
                            onChange={(e) => setMomoPhone(e.target.value)}
                            className="rounded-xl"
                            required
                          />
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="text-sm text-emerald-800">
                            📱 Composez le code USSD qui s'affichera pour confirmer le paiement
                          </p>
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 rounded-xl text-lg font-bold shadow-lg"
                      style={{ backgroundColor: blue }}
                    >
                      {loading ? 'Paiement en cours...' : <>Payer {label} <ArrowRight className="ml-2 h-5 w-5" /></>}
                    </Button>
                  </form>
                )}

                {/* Carte : Stripe Payment Element */}
                {selectedMethod === 'card' && clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: 'stripe' } }}
                  >
                    <CardPaymentForm label={label} />
                  </Elements>
                )}

                {selectedMethod === 'card' && !clientSecret && (
                  <div className="text-sm text-gray-600">Initialisation du paiement…</div>
                )}
              </CardContent>
            </Card>
          )}
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
                <span className="text-2xl font-bold text-blue-700">
                  {label}
                </span>
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
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Messagerie avec l'équipe</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">
                  ⚠️ Aucun remboursement après validation, même en cas d'abandon de la procédure.
                </p>
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

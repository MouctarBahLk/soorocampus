// app/app/paiements/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Lock, Check, ArrowRight, AlertCircle, MessageCircle, Zap, Clock, Gift } from 'lucide-react'

const WHATSAPP_NUMBER = "+224626699839"
const WHATSAPP_LINK = `https://wa.me/224626699839?text=Bonjour,%20je%20souhaite%20payer%20pour%20l'accompagnement%20Campus%20France.%0A%0AMes%20informations%20:%0ANom%20:%20%0APr%C3%A9nom%20:%20%0AEmail%20:%20%0APays%20:%20%0AMontant%20:%20%0AMode%20de%20paiement%20:%20`

const PRICING = {
  GNF: { full: 1500000, half: 750000 },
  XOF: { full: 100000, half: 50000 },
  EUR: { full: 150, half: 75 },
}

export default function PaiementsPage() {
  const [country, setCountry] = useState<'GN' | 'SN' | 'CI' | 'OTHER'>('GN')
  const [splitPayment, setSplitPayment] = useState(true)

  const currency = country === 'GN' ? 'GNF' : country === 'OTHER' ? 'EUR' : 'XOF'
  const pricing = PRICING[currency]
  const amount = splitPayment ? pricing.half : pricing.full

  const formatAmount = (amt: number, curr: string) => {
    if (curr === 'GNF') return `${amt.toLocaleString('fr-FR')} GNF`
    if (curr === 'XOF') return `${amt.toLocaleString('fr-FR')} FCFA`
    return `${amt} €`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Clock className="w-4 h-4" />
            Paiement automatique bientôt disponible
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Activez votre accompagnement Campus France 
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En attendant notre système de paiement automatique, payez facilement via WhatsApp
          </p>
        </div>

        {/* Bannière promo */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2"> Offre de lancement</h2>
              <p className="text-green-100 text-lg mb-3">
                <strong>Paiement en 2 fois sans frais !</strong> Commencez dès maintenant avec seulement 50% du montant.
              </p>
              <ul className="space-y-2 text-green-50">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span><strong>1er versement (50%)</strong> : Accès immédiat à tout le contenu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span><strong>2ème versement (50%)</strong> : Nous envoyons votre dossier à Campus France + préparation entretien</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Colonne gauche - Instructions */}
          <div className="space-y-6">
            {/* Étape 1 : Choix du pays */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
                  Choisissez votre pays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value as any)}
                  className="w-full rounded-xl border-2 border-gray-200 p-3 text-lg font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="GN">🇬🇳 Guinée (GNF)</option>
                  <option value="SN">🇸🇳 Sénégal (FCFA)</option>
                  <option value="CI">🇨🇮 Côte d'Ivoire (FCFA)</option>
                  <option value="OTHER">🌍 Autre pays (EUR)</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Le prix est automatiquement adapté à votre devise locale
                </p>
              </CardContent>
            </Card>

            {/* Étape 2 : Choix du paiement */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
                  Choisissez votre mode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Paiement en 2 fois */}
                  <button
                    onClick={() => setSplitPayment(true)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      splitPayment
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-lg text-gray-900">Paiement en 2 fois</span>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">RECOMMANDÉ</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Commencez avec seulement <strong>{formatAmount(pricing.half, currency)}</strong>
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>✓ Accès immédiat à tout le contenu</li>
                          <li>✓ Le reste à payer avant l'envoi du dossier</li>
                        </ul>
                      </div>
                      {splitPayment && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Paiement total */}
                  <button
                    onClick={() => setSplitPayment(false)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      !splitPayment
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-lg text-gray-900">Paiement intégral</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Payez le montant total : <strong>{formatAmount(pricing.full, currency)}</strong>
                        </p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>✓ Tout réglé d'un coup</li>
                          <li>✓ Nous traitons votre dossier immédiatement</li>
                        </ul>
                      </div>
                      {!splitPayment && (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Étape 3 : WhatsApp */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">3</span>
                  Contactez-nous sur WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Avant de payer</strong>, envoyez-nous un message WhatsApp avec :
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1.5 ml-4">
                    <li>✓ Votre <strong>nom complet</strong></li>
                    <li>✓ Votre <strong>email</strong> d'inscription</li>
                    <li>✓ Votre <strong>pays</strong></li>
                    <li>✓ Le <strong>montant</strong> que vous allez payer</li>
                    <li>✓ Le <strong>moyen de paiement</strong> (Orange Money, MTN, virement...)</li>
                  </ul>
                </div>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Contacter sur WhatsApp</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <p className="text-xs text-center text-gray-600">
                  Numéro : <strong>{WHATSAPP_NUMBER}</strong>
                </p>
              </CardContent>
            </Card>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2"> Comment ça marche après le paiement ?</p>
                  <ul className="space-y-1.5 text-blue-800">
                    <li><strong>Étape 1 :</strong> Vous payez (Orange Money, MTN, virement, etc.)</li>
                    <li><strong>Étape 2 :</strong> Vous nous envoyez la preuve de paiement sur WhatsApp</li>
                    <li><strong>Étape 3 :</strong> Nous vérifions et débloquons votre accès (sous 1-3h)</li>
                    <li><strong>Étape 4 :</strong> Vous recevez un email de confirmation + accès complet !</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Résumé */}
          <div className="space-y-6">
            <Card className="sticky top-6 border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
                <CardTitle>📋 Résumé de votre paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Montant */}
                <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">
                    {splitPayment ? '1er versement (50%)' : 'Montant total'}
                  </p>
                  <p className="text-4xl font-bold text-blue-700">
                    {formatAmount(amount, currency)}
                  </p>
                  {splitPayment && (
                    <p className="text-xs text-gray-500 mt-2">
                      Solde restant : {formatAmount(pricing.half, currency)}
                    </p>
                  )}
                </div>

                {/* Ce qui est inclus */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3"> Ce que vous obtenez :</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Accès complet au tableau de bord</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Tous les modèles et checklists</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Accompagnement personnalisé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Préparation aux entretiens Campus France</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Suivi jusqu'à l'obtention du visa</span>
                    </div>
                  </div>
                </div>

                {/* Moyens de paiement acceptés */}
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-700 mb-3">💳 Moyens de paiement acceptés :</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                      <span className="font-medium text-orange-700">Orange Money</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                      <span className="font-medium text-yellow-700">MTN Mobile Money</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                      <span className="font-medium text-blue-700">Moov Money</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                      <span className="font-medium text-slate-700">Virement bancaire</span>
                    </div>
                  </div>
                </div>

                {/* Sécurité */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </CardContent>
            </Card>

            {/* Info système automatique */}
            <Card className="border border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1"> Bientôt disponible</p>
                    <p className="text-amber-800">
                      Le paiement automatique par carte et Mobile Money sera disponible dans quelques jours !
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
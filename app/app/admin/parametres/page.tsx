// app/app/admin/parametres/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Mail, Bell, Database, Shield, AlertTriangle, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase-browser'

type SettingsShape = {
  site_name?: string
  contact_email?: string
  contact_phone?: string
  fee_amount_cents?: number
  currency?: 'EUR' | 'USD' | 'XOF' | string
  // état global du paiement en 2× (optionnel, s’il est renvoyé par /api/settings)
  allow_split_payment?: boolean
}

export default function ParametresPage() {
  const [loading, setLoading] = useState(false)
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [savingPricing, setSavingPricing] = useState(false)
  const [s, setS] = useState<SettingsShape>({
    site_name: 'Sooro Campus',
    contact_email: 'contact@soorocampus.com',
    contact_phone: '+33 X XX XX XX XX',
    fee_amount_cents: 2500,
    currency: 'EUR',
    allow_split_payment: undefined,
  })

  // Sécurité → changement de mot de passe
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwd1, setPwd1] = useState('')
  const [pwd2, setPwd2] = useState('')

  // Charger les paramètres existants
  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const res = await fetch('/api/settings', { credentials: 'include' })
      const data = await res.json()
      if (mounted && data.settings) {
        setS(v => ({ ...v, ...data.settings }))
      }
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  async function saveGeneral() {
    setSavingGeneral(true)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        changes: {
          site_name: s.site_name,
          contact_email: s.contact_email,
          contact_phone: s.contact_phone,
        }
      })
    })
    setSavingGeneral(false)
    alert('Paramètres généraux enregistrés.')
  }

  async function savePricing() {
    setSavingPricing(true)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        changes: {
          fee_amount_cents: s.fee_amount_cents ?? 2500,
          currency: s.currency ?? 'EUR',
        }
      })
    })
    setSavingPricing(false)
    alert('Tarification mise à jour.')
  }

  async function changePassword() {
    if (!pwd1 || !pwd2) return alert('Entre le nouveau mot de passe et sa confirmation.')
    if (pwd1 !== pwd2) return alert('Les mots de passe ne correspondent pas.')
    if (pwd1.length < 8) return alert('Le mot de passe doit faire au moins 8 caractères.')
    setPwdLoading(true)
    const { error } = await supabase.auth.updateUser({ password: pwd1 })
    setPwdLoading(false)
    if (error) return alert(`Erreur: ${error.message}`)
    setPwd1(''); setPwd2('')
    alert('Mot de passe changé avec succès.')
  }

  return (
    <div className="space-y-6">
      {/* En-tête + bouton vers Tarification */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Configure la plateforme Sooro Campus</p>
        </div>

        <Button asChild className="bg-green-600 hover:bg-green-700 rounded-xl">
          <Link href="/app/admin/parametres/tarification">
            Gérer la tarification (prix & 2×)
          </Link>
        </Button>
      </div>

      {/* Résumé tarification + lien secondaire */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-700" />
            <div>
              <p className="text-sm text-green-800">
                Tarification centrale (EUR/XOF/GNF) & activation du paiement en 2× par étudiant
              </p>
              {typeof s.allow_split_payment !== 'undefined' && (
                <p className="text-xs text-green-700">
                  2× global : <strong>{s.allow_split_payment ? 'activé' : 'désactivé'}</strong>
                </p>
              )}
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-green-300">
            <Link href="/app/admin/parametres/tarification">Ouvrir la tarification</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Paramètres généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la plateforme
              </label>
              <Input
                value={s.site_name || ''}
                onChange={e => setS(v => ({ ...v, site_name: e.target.value }))}
                className="rounded-xl"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact
              </label>
              <Input
                type="email"
                value={s.contact_email || ''}
                onChange={e => setS(v => ({ ...v, contact_email: e.target.value }))}
                className="rounded-xl"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <Input
                value={s.contact_phone || ''}
                onChange={e => setS(v => ({ ...v, contact_phone: e.target.value }))}
                className="rounded-xl"
                disabled={loading}
              />
            </div>
            <Button
              onClick={saveGeneral}
              disabled={loading || savingGeneral}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {savingGeneral ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Nouveau dossier</p>
                <p className="text-xs text-gray-500">Recevoir un email à chaque nouveau dossier</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Nouveau message</p>
                <p className="text-xs text-gray-500">Recevoir un email pour chaque message</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Paiement reçu</p>
                <p className="text-xs text-gray-500">Notification de paiement validé</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl">
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Tarification simple (fee + currency) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Tarification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de traitement (€)
              </label>
              <Input
                type="number"
                step="0.01"
                value={((s.fee_amount_cents ?? 0) / 100).toString()}
                onChange={e => {
                  const euros = Number(e.target.value || 0)
                  setS(v => ({ ...v, fee_amount_cents: Math.round(euros * 100) }))
                }}
                className="rounded-xl"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Montant demandé aux étudiants</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise
              </label>
              <select
                value={s.currency || 'EUR'}
                onChange={e => setS(v => ({ ...v, currency: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
                <option value="XOF">Franc CFA (XOF)</option>
              </select>
            </div>
            <Button
              onClick={savePricing}
              disabled={loading || savingPricing}
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
            >
              {savingPricing ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Authentification à 2 facteurs</p>
                <p className="text-xs text-gray-500">Activer la double authentification</p>
              </div>
              <input type="checkbox" className="h-5 w-5 text-blue-600" />
            </div>

            {/* Changer le mot de passe */}
            <div className="grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={pwd1}
                  onChange={e => setPwd1(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <Input
                  type="password"
                  value={pwd2}
                  onChange={e => setPwd2(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button
                onClick={changePassword}
                disabled={pwdLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                {pwdLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Base de données */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Database className="h-5 w-5" />
            Maintenance de la base de données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-amber-800">
            Ces actions sont sensibles. Assure-toi de faire une sauvegarde avant.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl">
              Exporter les données
            </Button>
            <Button variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl">
              Nettoyer les logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-red-800">
            ⚠️ Actions irréversibles. Ces opérations ne peuvent pas être annulées.
          </p>
          <div className="flex gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              Supprimer tous les dossiers refusés
            </Button>
            <Button className="bg-red-700 hover:bg-red-800 text-white rounded-xl">
              Réinitialiser la base de données
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

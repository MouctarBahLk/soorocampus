// app/app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, FileText, MessageSquare, CreditCard } from "lucide-react"
import Link from "next/link"
import { supabaseServer } from '@/lib/supabase-server'

const blue = "#0055FF"

type PayStatus = 'none' | 'partial' | 'full'

async function getData() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  // On récupère tout en parallèle
  const [
    { data: app },
    { data: docs },
    { data: messages },
    { data: profile }
  ] = await Promise.all([
    sb.from('applications').select('*').eq('user_id', user.id).maybeSingle(),
    sb.from('documents').select('id').eq('user_id', user.id),
    sb.from('messages').select('id').eq('user_id', user.id).eq('is_read', false),
    sb.from('profiles').select('payment_status').eq('id', user.id).single()
  ])

  // Source de vérité principale
  let payment_status: PayStatus =
    (profile?.payment_status as PayStatus | null) ?? 'none'

  // Fallback si jamais le champ n'est pas encore présent
  if (!profile) {
    const { data: pays } = await sb
      .from('payments')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'succeeded')
      .limit(1)

    payment_status = pays && pays.length > 0 ? 'full' : 'none'
  }

  return {
    user,
    statut: app?.statut ?? 'non_cree',
    payment_status,
    docsCount: docs?.length ?? 0,
    unreadMessages: messages?.length ?? 0
  }
}

export default async function TableauEtudiantPage() {
  const data = await getData()
  if (!data) return <p>Connecte-toi.</p>

  const { user, statut, payment_status, docsCount, unreadMessages } = data
  const paid = payment_status === 'full'
  const paidPartial = payment_status === 'partial'

  return (
    <div className="space-y-8">
      {/* Bandeaux info selon le paiement */}
      {paidPartial && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">
            ✅ 1er versement reçu. Il reste le solde à payer pour que nous puissions
            <strong> envoyer ton dossier à Campus France</strong> et planifier l’entretien.
          </p>
          <Link href="/app/paiements" className="inline-block mt-2">
            <Button size="sm" className="rounded-xl" style={{ backgroundColor: blue }}>
              Payer le montant restant
            </Button>
          </Link>
        </div>
      )}

      {paid && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            🎉 Merci ! Paiement complet reçu. Tu peux maintenant finaliser ton dossier et demander l’envoi à Campus France.
          </p>
          <Link href="/app/mon-dossier" className="inline-block mt-2">
            <Button size="sm" className="rounded-xl bg-green-600 hover:bg-green-700">
              Ouvrir mon dossier
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, {user.email?.split('@')[0]} 👋</p>
        </div>
        {!paid && (
          <Link href="/app/paiements">
            <Button style={{ backgroundColor: blue }} className="rounded-xl shadow-lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Activer l'accompagnement
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Statut dossier */}
        <Card className="border-l-4" style={{ borderLeftColor: statut === 'validé' ? '#16a34a' : statut === 'en attente' ? '#f59e0b' : '#6b7280' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Statut du dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {statut === 'validé' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {statut === 'en attente' && <Clock className="h-5 w-5 text-amber-600" />}
              {(statut === 'non_cree' || statut === 'en cours') && <FileText className="h-5 w-5 text-gray-600" />}
              <Badge className={
                statut === 'validé' ? 'bg-green-600' :
                statut === 'en attente' ? 'bg-amber-500' :
                'bg-gray-500'
              }>
                {statut === 'non_cree' ? 'Non créé' : statut}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card className="border-l-4" style={{ borderLeftColor: paid ? '#16a34a' : paidPartial ? '#f59e0b' : '#ef4444' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CreditCard className={`h-5 w-5 ${paid ? 'text-green-600' : paidPartial ? 'text-amber-600' : 'text-red-600'}`} />
              <Badge className={
                paid ? 'bg-green-600' :
                paidPartial ? 'bg-amber-500' :
                'bg-red-600'
              }>
                {paid ? 'Payé' : paidPartial ? 'Payé partiellement' : 'Non payé'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-l-4 border-l-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-700" />
                <span className="text-2xl font-bold">{docsCount}</span>
              </div>
              <Link href="/app/documents" className="text-sm text-blue-700 hover:underline">
                Voir tout →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{unreadMessages}</span>
              </div>
              <Link href="/app/messages" className="text-sm text-purple-600 hover:underline">
                Lire →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/app/mon-dossier">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-6 rounded-xl hover:border-blue-700 hover:bg-blue-50">
                <FileText className="h-6 w-6 text-blue-700" />
                <span className="font-semibold">Mon dossier</span>
                <span className="text-xs text-gray-500">Gérer mes documents</span>
              </Button>
            </Link>

            <Link href="/app/paiements">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-6 rounded-xl hover:border-green-600 hover:bg-green-50">
                <CreditCard className="h-6 w-6 text-green-600" />
                <span className="font-semibold">Paiements</span>
                <span className="text-xs text-gray-500">Voir mes reçus</span>
              </Button>
            </Link>

            <Link href="/app/messages">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-6 rounded-xl hover:border-purple-600 hover:bg-purple-50">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <span className="font-semibold">Messagerie</span>
                <span className="text-xs text-gray-500">Contacter l'équipe</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Prochaines étapes */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            Prochaines étapes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 1. Pas payé */}
          {payment_status === 'none' && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Activer l'accompagnement</p>
                <p className="text-sm text-gray-600">
                  Effectue le paiement (ou le 1er versement) pour débloquer toutes les fonctionnalités.
                </p>
              </div>
              <Link href="/app/paiements">
                <Button size="sm" style={{ backgroundColor: blue }} className="rounded-xl">
                  Payer
                </Button>
              </Link>
            </div>
          )}

          {/* 2. Payé partiellement */}
          {payment_status === 'partial' && (
            <>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Compléter ton dossier</p>
                  <p className="text-sm text-gray-600">
                    Tu peux déjà déposer tes documents et préparer l’entretien.
                    <br />⚠️ L’envoi à Campus France sera possible après paiement du solde.
                  </p>
                </div>
                <Link href="/app/mon-dossier">
                  <Button size="sm" style={{ backgroundColor: blue }} className="rounded-xl">
                    Ouvrir mon dossier
                  </Button>
                </Link>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Régler le montant restant</p>
                  <p className="text-sm text-gray-600">
                    Paie le solde pour que nous envoyions ton dossier à Campus France et planifions le rendez-vous.
                  </p>
                </div>
                <Link href="/app/paiements">
                  <Button size="sm" className="rounded-xl" style={{ backgroundColor: blue }}>
                    Payer le solde
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* 3. Payé totalement */}
          {payment_status === 'full' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-semibold">
                Paiement terminé ✔︎ – termine la préparation et demande l’envoi à Campus France.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Besoin d'aide */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
          <div>
            <p className="font-semibold text-lg">Besoin de conseils personnalisés ?</p>
            <p className="text-sm text-gray-600">Un expert te répond selon ton dossier</p>
          </div>
          <Link href="/app/messages">
            <Button style={{ backgroundColor: blue }} className="rounded-xl shadow-lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contacter un expert
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

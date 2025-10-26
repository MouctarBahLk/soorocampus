// app/app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, Clock, FileText, MessageSquare, CreditCard,
  Sparkles, ArrowRight, TrendingUp, Target, AlertCircle
} from "lucide-react"
import Link from "next/link"
import { supabaseServer } from '@/lib/supabase-server'

type PayStatus = 'none' | 'partial' | 'full'
type ProfileInfo = { payment_status?: PayStatus | null; full_name?: string | null } | null

function getDisplayName(user: any, profile: ProfileInfo): string {
  return (
    profile?.full_name?.trim() ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    (user?.user_metadata?.display_name as string | undefined) ||
    (user?.email ? user.email.split('@')[0] : 'Utilisateur')
  )
}

async function getData() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  // Récupérations en parallèle
  const [
    { data: app },
    { data: docs },
    { data: messages },
    { data: profile },
    // On regarde TOUJOURS s'il existe au moins un paiement "succeeded"
    { data: pays }
  ] = await Promise.all([
    sb.from('applications').select('*').eq('user_id', user.id).maybeSingle(),
    sb.from('documents').select('id').eq('user_id', user.id),
    sb.from('messages').select('id').eq('user_id', user.id).eq('is_read', false),
    sb.from('profiles').select('payment_status, full_name').eq('id', user.id).maybeSingle<ProfileInfo>(),
    sb.from('payments').select('id').eq('user_id', user.id).eq('status', 'succeeded').limit(1),
  ])

  const hasSucceeded = !!(pays && pays.length > 0)

  // Règle d'or:
  // - Si l'historique prouve un paiement "succeeded", on force l'état "full"
  //   (utile pour les anciens comptes créés avant le champ payment_status).
  // - Sinon on se base sur le profil (none/partial/…).
  let payment_status: PayStatus =
    hasSucceeded ? 'full' : ((profile?.payment_status as PayStatus | null) ?? 'none')

  // Mise à niveau silencieuse du profil pour les anciens utilisateurs
  if (hasSucceeded && profile?.payment_status !== 'full') {
    await sb.from('profiles').update({ payment_status: 'full' }).eq('id', user.id)
  }

  const displayName = getDisplayName(user, profile)

  return {
    user,
    displayName,
    statut: app?.statut ?? 'non_cree',
    payment_status,
    docsCount: docs?.length ?? 0,
    unreadMessages: messages?.length ?? 0,
  }
}

export default async function TableauEtudiantPage() {
  const data = await getData()
  if (!data) return <p>Connectez-vous.</p>

  const { displayName, statut, payment_status, docsCount, unreadMessages } = data
  const paid = payment_status === 'full'
  const paidPartial = payment_status === 'partial'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Tableau de bord 
              </h1>
              <p className="text-xl text-gray-600">
                Bienvenue, <span className="font-semibold text-gray-900">{displayName}</span> 
              </p>
            </div>
            {!paid && (
              <Link href="/app/paiements">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-lg">
                  <Sparkles className="w-5 h-5" />
                  Activer l'accompagnement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Bandeaux info selon le paiement */}
          {paidPartial && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-amber-900 mb-2">
                    ✅ Premier versement reçu !
                  </p>
                  <p className="text-amber-800 mb-4">
                    Il reste le solde à payer pour que nous puissions <strong>envoyer votre dossier à Campus France</strong> et planifier l'entretien.
                  </p>
                  <Link href="/app/paiements">
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-md font-bold">
                      Payer le montant restant
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {paid && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-green-900 mb-2">
                     Paiement complet reçu !
                  </p>
                  <p className="text-green-800 mb-4">
                    Vous pouvez maintenant finaliser votre dossier et demander l'envoi à Campus France.
                  </p>
                  <Link href="/app/mon-dossier">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-md font-bold">
                      Ouvrir mon dossier
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Statut dossier */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <span>Statut du dossier</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {statut === 'validé' && <CheckCircle2 className="h-6 w-6 text-green-600" />}
                {statut === 'en attente' && <Clock className="h-6 w-6 text-amber-600" />}
                {(statut === 'non_cree' || statut === 'en cours') && <Target className="h-6 w-6 text-gray-600" />}
                <Badge className={`text-sm font-bold px-3 py-1 ${
                  statut === 'validé' ? 'bg-green-600 hover:bg-green-700' :
                  statut === 'en attente' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-gray-500 hover:bg-gray-600'
                }`}>
                  {statut === 'non_cree' ? 'Non créé' : statut === 'en cours' ? 'En cours' : statut}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Paiement */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <span>Paiement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CreditCard className={`h-6 w-6 ${paid ? 'text-green-600' : paidPartial ? 'text-amber-600' : 'text-red-600'}`} />
                <Badge className={`text-sm font-bold px-3 py-1 ${
                  paid ? 'bg-green-600 hover:bg-green-700' :
                  paidPartial ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-red-600 hover:bg-red-700'
                }`}>
                  {paid ? 'Payé' : paidPartial ? 'Partiel' : 'Non payé'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <span>Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-gray-900">{docsCount}</span>
                <Link href="/app/documents" className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                  Voir tout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-cyan-600" />
                </div>
                <span>Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">{unreadMessages}</span>
                  {unreadMessages > 0 && (
                    <span className="text-sm font-semibold text-cyan-600">non lus</span>
                  )}
                </div>
                <Link href="/app/messages" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                  Lire <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="border-2 border-slate-200 shadow-lg mb-12">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-2xl">Actions rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/app/mon-dossier" className="group">
                <div className="h-full p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-7 w-7 text-blue-600" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">Mon dossier</span>
                    <span className="text-sm text-gray-600">Gérer mes documents</span>
                  </div>
                </div>
              </Link>

              <Link href="/app/paiements" className="group">
                <div className="h-full p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:border-green-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="h-7 w-7 text-green-600" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">Paiements</span>
                    <span className="text-sm text-gray-600">Voir mes reçus</span>
                  </div>
                </div>
              </Link>

              <Link href="/app/messages" className="group">
                <div className="h-full p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-7 w-7 text-purple-600" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">Messagerie</span>
                    <span className="text-sm text-gray-600">Contacter l'équipe</span>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Prochaines étapes */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg mb-12">
          <CardHeader className="border-b-2 border-blue-200">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl">Prochaines étapes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {payment_status === 'none' && (
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900 mb-2">Activer l'accompagnement</p>
                  <p className="text-gray-700 mb-4">
                    Effectuez le paiement (ou le 1er versement) pour débloquer toutes les fonctionnalités.
                  </p>
                  <Link href="/app/paiements">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-md">
                      Payer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {payment_status === 'partial' && (
              <>
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900 mb-2">Compléter votre dossier</p>
                    <p className="text-gray-700 mb-2">
                      Vous pouvez déjà déposer vos documents et préparer l'entretien.
                    </p>
                    <p className="text-amber-700 font-semibold text-sm mb-4">
                      ⚠️ L'envoi à Campus France sera possible après paiement du solde.
                    </p>
                    <Link href="/app/mon-dossier">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-md">
                        Ouvrir mon dossier
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900 mb-2">Régler le montant restant</p>
                    <p className="text-gray-700 mb-4">
                      Payez le solde pour que nous envoyions votre dossier à Campus France et planifions le rendez-vous.
                    </p>
                    <Link href="/app/paiements">
                      <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold shadow-md">
                        Payer le solde
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {payment_status === 'full' && (
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-md">
                <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                <p className="font-bold text-lg text-green-900">
                  Paiement terminé ✓ – Terminez la préparation et demandez l'envoi à Campus France.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Besoin d'aide */}
        <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-7 w-7 text-cyan-600" />
              </div>
              <div>
                <p className="font-bold text-2xl text-gray-900 mb-2">Besoin de conseils personnalisés ?</p>
                <p className="text-gray-700">Un expert vous répond selon votre dossier</p>
              </div>
            </div>
            <Link href="/app/messages">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contacter un expert
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

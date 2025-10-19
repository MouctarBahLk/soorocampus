import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle2, Clock, XCircle, FileText, MessageSquare, CreditCard } from "lucide-react"
import Link from "next/link"
import { supabaseServer } from '@/lib/supabase-server'

const blue = "#0055FF"

async function getData() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const { data: app } = await sb
    .from('applications').select('*').eq('user_id', user.id).maybeSingle()
  
  const { data: payments } = await sb
    .from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  
  const paid = payments?.some(p => p.status === 'succeeded')

  const { data: docs } = await sb
    .from('documents').select('id').eq('user_id', user.id)

  const { data: messages } = await sb
    .from('messages').select('id').eq('user_id', user.id).eq('is_read', false)

  return {
    user,
    statut: app?.statut ?? 'non_cree',
    paid,
    docsCount: docs?.length ?? 0,
    unreadMessages: messages?.length ?? 0
  }
}

export default async function TableauEtudiantPage() {
  const data = await getData()
  if (!data) return <p>Connecte-toi.</p>

  const { user, statut, paid, docsCount, unreadMessages } = data

  return (
    <div className="space-y-8">
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

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Statut du dossier */}
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
        <Card className="border-l-4" style={{ borderLeftColor: paid ? '#16a34a' : '#f59e0b' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CreditCard className={`h-5 w-5 ${paid ? 'text-green-600' : 'text-amber-600'}`} />
              <Badge className={paid ? 'bg-green-600' : 'bg-amber-500'}>
                {paid ? 'Payé' : 'Non payé'}
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
          {!paid && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Activer l'accompagnement</p>
                <p className="text-sm text-gray-600">Effectue le paiement pour accéder aux fonctionnalités complètes</p>
              </div>
              <Link href="/app/paiements">
                <Button size="sm" style={{ backgroundColor: blue }} className="rounded-xl">
                  Payer
                </Button>
              </Link>
            </div>
          )}

          {paid && statut === 'non_cree' && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Créer ton dossier</p>
                <p className="text-sm text-gray-600">Commence par créer ton dossier Campus France</p>
              </div>
              <Link href="/app/mon-dossier">
                <Button size="sm" style={{ backgroundColor: blue }} className="rounded-xl">
                  Démarrer
                </Button>
              </Link>
            </div>
          )}

          {paid && (statut === 'en cours' || statut === 'non_cree') && docsCount < 5 && (
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-700 font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Déposer tes documents</p>
                <p className="text-sm text-gray-600">Upload tous les documents requis ({docsCount}/5)</p>
              </div>
              <Link href="/app/documents">
                <Button size="sm" style={{ backgroundColor: blue }} className="rounded-xl">
                  Upload
                </Button>
              </Link>
            </div>
          )}

          {statut === 'en attente' && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <Clock className="h-5 w-5 text-amber-600" />
              <p className="text-sm">Ton dossier est en cours de vérification par notre équipe</p>
            </div>
          )}

          {statut === 'validé' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-semibold">Félicitations ! Ton dossier a été validé 🎉</p>
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseServer } from '@/lib/supabase-server'
import {
  Users,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'
import Link from "next/link"

// Helper pour formater en euros à partir des centimes
const formatEUR = (cents: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100)

async function getStats() {
  const sb = await supabaseServer()
  
  const { count: totalUsers } = await sb
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalApps } = await sb
    .from('applications')
    .select('*', { count: 'exact', head: true })

  const { count: validApps } = await sb
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'validé')

  const { count: pendingApps } = await sb
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'en attente')

  // Récupère amount + statut (+ livemode si tu veux filtrer les vrais paiements)
  const { data: payments } = await sb
    .from('payments')
    .select('amount, status, livemode')

  // Somme des paiements réussis en centimes
  const totalRevenueCents =
    payments?.filter(p => p.status === 'succeeded' /* && p.livemode === true */)
             .reduce((acc, p) => acc + (p.amount || 0), 0) ?? 0

  const { data: recentApps } = await sb
    .from('applications')
    .select('id, user_id, statut, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalUsers: totalUsers || 0,
    totalApps: totalApps || 0,
    validApps: validApps || 0,
    pendingApps: pendingApps || 0,
    totalRevenueCents,
    recentApps: recentApps || []
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme Sooro Campus</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Utilisateurs */}
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Inscrits sur la plateforme</p>
          </CardContent>
        </Card>

        {/* Dossiers */}
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dossiers</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalApps}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-600 font-medium">{stats.validApps} validés</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-amber-600 font-medium">{stats.pendingApps} en attente</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus</CardTitle>
            <CreditCard className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatEUR(stats.totalRevenueCents)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total des paiements validés</p>
            {/* Si tu veux afficher un badge “mode test” */}
            {/* {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') && (
              <p className="text-xs text-amber-600 mt-1">Mode test</p>
            )} */}
          </CardContent>
        </Card>

        {/* Taux de validation */}
        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de validation</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalApps > 0 ? Math.round((stats.validApps / stats.totalApps) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Dossiers validés</p>
          </CardContent>
        </Card>
      </div>

      {/* Dossiers récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dossiers récents</CardTitle>
          <Link href="/app/admin/dossiers" className="text-sm text-blue-600 hover:underline">
            Voir tout →
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentApps.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun dossier pour le moment</p>
          ) : (
            <div className="space-y-3">
              {stats.recentApps.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/admin/dossiers/${app.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm">
                        {app.profiles?.full_name?.[0] || app.profiles?.email?.[0] || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.profiles?.full_name || app.profiles?.email || 'Sans nom'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.statut === 'validé' && (
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Validé
                      </Badge>
                    )}
                    {app.statut === 'en attente' && (
                      <Badge className="bg-amber-500">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </Badge>
                    )}
                    {app.statut === 'refusé' && (
                      <Badge className="bg-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Refusé
                      </Badge>
                    )}
                    {(app.statut === 'en cours' || app.statut === 'non_cree') && (
                      <Badge className="bg-gray-500">En cours</Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/app/admin/dossiers">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-600">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <FileText className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-lg">Gérer les dossiers</h3>
              <p className="text-sm text-gray-500 mt-1">Valider ou refuser les dossiers</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/app/admin/messages">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-600">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="h-12 w-12 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg">Messagerie</h3>
              <p className="text-sm text-gray-500 mt-1">Répondre aux étudiants</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/app/admin/utilisateurs">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-600">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg">Utilisateurs</h3>
              <p className="text-sm text-gray-500 mt-1">Gérer les comptes</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseServer } from '@/lib/supabase-server'
import { CreditCard, TrendingUp, Clock, CheckCircle, Euro } from 'lucide-react'

async function getPayments() {
  const sb = await supabaseServer()
  
  const { data: payments } = await sb
    .from('payments')
    .select(`
      *,
      profiles(full_name, email)
    `)
    .order('created_at', { ascending: false })

  const total = payments?.filter(p => p.status === 'succeeded').reduce((acc, p) => acc + (p.amount || 0), 0) || 0
  const pending = payments?.filter(p => p.status === 'pending').length || 0
  const succeeded = payments?.filter(p => p.status === 'succeeded').length || 0

  return { payments: payments || [], total, pending, succeeded }
}

export default async function PaiementsAdminPage() {
  const { payments, total, pending, succeeded } = await getPayments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
        <p className="text-gray-600 mt-1">Suivi des transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus totaux</p>
                <p className="text-3xl font-bold text-green-600">{total} €</p>
              </div>
              <Euro className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paiements validés</p>
                <p className="text-3xl font-bold text-blue-600">{succeeded}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-3xl font-bold text-amber-600">{pending}</p>
              </div>
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Moyenne</p>
                <p className="text-3xl font-bold text-purple-600">
                  {succeeded > 0 ? Math.round(total / succeeded) : 0} €
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun paiement pour le moment</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      payment.status === 'succeeded' 
                        ? 'bg-green-100' 
                        : 'bg-amber-100'
                    }`}>
                      <CreditCard className={`h-6 w-6 ${
                        payment.status === 'succeeded' 
                          ? 'text-green-600' 
                          : 'text-amber-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {payment.profiles?.full_name || payment.profiles?.email || 'Utilisateur'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{payment.amount} €</p>
                      <p className="text-xs text-gray-500">{payment.method || 'Carte bancaire'}</p>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {payment.status === 'succeeded' && (
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Validé
                      </Badge>
                    )}
                    {payment.status === 'pending' && (
                      <Badge className="bg-amber-500">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </Badge>
                    )}
                    {payment.status === 'failed' && (
                      <Badge className="bg-red-600">Échoué</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, DollarSign, Search, User, Calendar, AlertCircle, Sparkles } from 'lucide-react'

type Student = {
  id: string
  email: string
  full_name: string | null
  payment_status: 'none' | 'partial' | 'full'
  created_at: string
}

export default function ValiderPaiementsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    try {
      const res = await fetch('/api/admin/students-payment-status', {
        cache: 'no-store',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      setStudents(data.students || [])
    } catch (error: any) {
      console.error('Erreur:', error)
      alert('Erreur lors du chargement: ' + (error.message || 'inconnue'))
    } finally {
      setLoading(false)
    }
  }

  async function validatePayment(studentId: string, paymentType: 'partial' | 'full') {
    const confirmMsg = paymentType === 'partial'
      ? '💰 Valider le 1er versement (50%) ?\n\n✅ Accès au contenu\n⚠️ Envoi du dossier bloqué jusqu’au solde'
      : '💰 Valider le paiement COMPLET (100%) ?\n\n✅ Accès total + envoi de dossier autorisé'

    if (!window.confirm(confirmMsg)) return

    setActionLoading(studentId)
    try {
      const res = await fetch('/api/admin/validate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ student_id: studentId, payment_status: paymentType }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

      alert(`✅ Paiement ${paymentType === 'partial' ? 'partiel' : 'complet'} validé !`)
      fetchStudents()
    } catch (error: any) {
      alert('❌ Erreur : ' + (error.message || 'inconnue'))
    } finally {
      setActionLoading(null)
    }
  }

  async function resetPayment(studentId: string) {
    if (!window.confirm('⚠️ Réinitialiser le paiement ?\n\nL’étudiant perdra son accès premium.')) return

    setActionLoading(studentId)
    try {
      const res = await fetch('/api/admin/validate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ student_id: studentId, payment_status: 'none' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

      alert('✅ Paiement réinitialisé')
      fetchStudents()
    } catch (error: any) {
      alert('❌ Erreur : ' + (error.message || 'inconnue'))
    } finally {
      setActionLoading(null)
    }
  }

  const filteredStudents = students.filter(s =>
    (s.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unpaidStudents = filteredStudents.filter(s => s.payment_status === 'none')
  const partialStudents = filteredStudents.filter(s => s.payment_status === 'partial')
  const paidStudents = filteredStudents.filter(s => s.payment_status === 'full')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Validation des paiements 💳
          </h1>
          <p className="text-xl text-gray-600">
            Validez manuellement les paiements reçus via WhatsApp ou autres moyens
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un étudiant par nom ou email..."
              className="pl-12 py-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Non payés</p>
                  <p className="text-4xl font-bold text-red-600">{unpaidStudents.length}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-7 w-7 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Paiement partiel</p>
                  <p className="text-4xl font-bold text-amber-600">{partialStudents.length}</p>
                </div>
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Payé complet</p>
                  <p className="text-4xl font-bold text-green-600">{paidStudents.length}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-slate-200 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-200">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl">Tous les étudiants ({filteredStudents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Aucun résultat trouvé' : 'Aucun étudiant'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    {/* Info étudiant */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        student.payment_status === 'full' ? 'bg-green-100' :
                        student.payment_status === 'partial' ? 'bg-amber-100' :
                        'bg-red-100'
                      }`}>
                        <span className="text-2xl font-bold text-gray-700">
                          {student.full_name?.[0] || student.email[0].toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg text-gray-900 truncate">
                          {student.full_name || 'Sans nom'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{student.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Inscrit le {new Date(student.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      {/* Badge statut */}
                      <div>
                        {student.payment_status === 'full' && (
                          <Badge className="bg-green-600 text-white px-3 py-1 text-sm">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Payé complet
                          </Badge>
                        )}
                        {student.payment_status === 'partial' && (
                          <Badge className="bg-amber-500 text-white px-3 py-1 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            Partiel (50%)
                          </Badge>
                        )}
                        {student.payment_status === 'none' && (
                          <Badge className="bg-red-600 text-white px-3 py-1 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Non payé
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {student.payment_status === 'none' && (
                        <>
                          <Button
                            onClick={() => validatePayment(student.id, 'partial')}
                            disabled={actionLoading === student.id}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                          >
                            {actionLoading === student.id ? '...' : 'Valider 50%'}
                          </Button>
                          <Button
                            onClick={() => validatePayment(student.id, 'full')}
                            disabled={actionLoading === student.id}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
                          >
                            {actionLoading === student.id ? '...' : 'Valider 100%'}
                          </Button>
                        </>
                      )}

                      {student.payment_status === 'partial' && (
                        <>
                          <Button
                            onClick={() => validatePayment(student.id, 'full')}
                            disabled={actionLoading === student.id}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {actionLoading === student.id ? '...' : 'Valider solde (50%)'}
                          </Button>
                          <Button
                            onClick={() => resetPayment(student.id)}
                            disabled={actionLoading === student.id}
                            variant="outline"
                            className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Réinitialiser
                          </Button>
                        </>
                      )}

                      {student.payment_status === 'full' && (
                        <Button
                          onClick={() => resetPayment(student.id)}
                          disabled={actionLoading === student.id}
                          variant="outline"
                          className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Réinitialiser
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">ℹ️ Comment ça marche ?</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>• Non payé :</strong> pas d’accès au contenu premium</li>
                  <li><strong>• Paiement partiel (50%) :</strong> accès au contenu MAIS envoi du dossier bloqué</li>
                  <li><strong>• Paiement complet (100%) :</strong> accès total + envoi de dossier autorisé</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Quand un étudiant confirme son paiement via WhatsApp, validez-le ici pour lui débloquer l’accès.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

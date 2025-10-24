// app/app/admin/parametres/tarification/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, Users, Check, AlertCircle } from 'lucide-react'

type PricingSettings = {
  price_eur: number      // en centimes (ex: 15000 = 150€)
  price_xof: number      // entier direct (ex: 100000)
  price_gnf: number      // entier direct (ex: 1500000)
  allow_split_payment: boolean
}

type Student = {
  id: string
  email: string
  name: string
  split_payment_enabled: boolean
}

export default function TarificationPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PricingSettings>({
    price_eur: 15000,
    price_xof: 100000,
    price_gnf: 1500000,
    allow_split_payment: true,
  })

  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Charger les paramètres et étudiants
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      // Charger les prix
      const res = await fetch('/api/admin/pricing', { credentials: 'include' })
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }

      // Charger les étudiants
      const studRes = await fetch('/api/admin/students', { credentials: 'include' })
      const studData = await studRes.json()
      if (studData.students) {
        setStudents(studData.students)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function savePricing() {
    setSaving(true)
    try {
      await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      })
      alert('✅ Tarification mise à jour !')
    } catch (e: any) {
      alert('❌ Erreur : ' + e.message)
    }
    setSaving(false)
  }

  async function toggleSplitPayment(studentId: string, enabled: boolean) {
    try {
      await fetch('/api/admin/students/split-payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ student_id: studentId, enabled }),
      })
      
      // Mise à jour locale
      setStudents(prev => 
        prev.map(s => s.id === studentId ? { ...s, split_payment_enabled: enabled } : s)
      )
    } catch (e: any) {
      alert('❌ Erreur : ' + e.message)
    }
  }

  const filteredStudents = students.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tarification</h1>
        <p className="text-gray-600 mt-1">Configure les prix et le paiement en 2 fois</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration des prix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Prix par devise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix en Euros (€)
              </label>
              <Input
                type="number"
                step="0.01"
                value={(settings.price_eur / 100).toFixed(2)}
                onChange={e => setSettings(prev => ({ 
                  ...prev, 
                  price_eur: Math.round(parseFloat(e.target.value || '0') * 100) 
                }))}
                className="rounded-xl"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Actuellement : {(settings.price_eur / 100).toFixed(2)} €
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix en Franc CFA (XOF)
              </label>
              <Input
                type="number"
                value={settings.price_xof}
                onChange={e => setSettings(prev => ({ 
                  ...prev, 
                  price_xof: parseInt(e.target.value || '0') 
                }))}
                className="rounded-xl"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Actuellement : {settings.price_xof.toLocaleString()} XOF
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix en Franc Guinéen (GNF)
              </label>
              <Input
                type="number"
                value={settings.price_gnf}
                onChange={e => setSettings(prev => ({ 
                  ...prev, 
                  price_gnf: parseInt(e.target.value || '0') 
                }))}
                className="rounded-xl"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Actuellement : {settings.price_gnf.toLocaleString()} GNF
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-900">
                  Paiement en 2 fois
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allow_split_payment}
                  onChange={e => setSettings(prev => ({ 
                    ...prev, 
                    allow_split_payment: e.target.checked 
                  }))}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Activer le paiement en 2 fois (50% × 2)
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Tu pourras ensuite activer cette option pour des étudiants spécifiques
              </p>
            </div>

            <Button
              onClick={savePricing}
              disabled={loading || saving}
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les prix'}
            </Button>
          </CardContent>
        </Card>

        {/* Gestion paiement en 2 fois par étudiant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Paiement en 2 fois (par étudiant)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!settings.allow_split_payment && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">
                  Active d'abord le paiement en 2 fois dans la configuration
                </p>
              </div>
            )}

            {settings.allow_split_payment && (
              <>
                <div>
                  <Input
                    type="search"
                    placeholder="Rechercher un étudiant..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredStudents.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucun étudiant trouvé
                    </p>
                  )}
                  
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.name || student.email}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                      
                      <button
                        onClick={() => toggleSplitPayment(
                          student.id, 
                          !student.split_payment_enabled
                        )}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          student.split_payment_enabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {student.split_payment_enabled && (
                          <Check className="h-3 w-3" />
                        )}
                        {student.split_payment_enabled ? '2× activé' : '2× désactivé'}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des montants */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Aperçu des montants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Europe (EUR)</p>
              <p className="text-2xl font-bold text-blue-600">
                {(settings.price_eur / 100).toFixed(2)} €
              </p>
              {settings.allow_split_payment && (
                <p className="text-xs text-gray-500 mt-1">
                  2× {(settings.price_eur / 200).toFixed(2)} €
                </p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Afrique Ouest (XOF)</p>
              <p className="text-2xl font-bold text-blue-600">
                {settings.price_xof.toLocaleString()}
              </p>
              {settings.allow_split_payment && (
                <p className="text-xs text-gray-500 mt-1">
                  2× {(settings.price_xof / 2).toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Guinée (GNF)</p>
              <p className="text-2xl font-bold text-blue-600">
                {settings.price_gnf.toLocaleString()}
              </p>
              {settings.allow_split_payment && (
                <p className="text-xs text-gray-500 mt-1">
                  2× {(settings.price_gnf / 2).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
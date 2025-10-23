'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User, Mail, Calendar, Shield, Trash2, MessageSquare, UserCog, Loader2 } from 'lucide-react'
import Link from 'next/link'

type UserProfile = {
  id: string
  full_name: string | null
  email: string
  role: string
  created_at: string
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Erreur chargement')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Erreur chargement:', error)
      alert('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  async function handleChangeRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const confirm = window.confirm(
      `Changer le rôle en "${newRole}" ?\n\n${newRole === 'admin' ? '⚠️ Cette personne aura accès à TOUTES les données !' : '✓ Retour utilisateur normal'}`
    )
    
    if (!confirm) return

    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_role', userId, newRole })
      })

      if (!res.ok) throw new Error('Erreur')

      alert(`✅ Rôle changé en "${newRole}"`)
      fetchUsers()
    } catch (error) {
      alert('❌ Erreur lors du changement de rôle')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    const confirmMsg = `🗑️ SUPPRIMER DÉFINITIVEMENT "${userName}" ?\n\n⚠️ ATTENTION : Cette action est IRRÉVERSIBLE !\n\n✗ Tous ses documents seront supprimés\n✗ Sa candidature sera supprimée\n✗ Ses messages seront supprimés\n✗ Ses paiements seront supprimés\n\nÊtes-vous absolument certain ?`
    
    if (!window.confirm(confirmMsg)) return

    const doubleCheck = prompt('Pour confirmer, tapez exactement : SUPPRIMER')
    if (doubleCheck !== 'SUPPRIMER') {
      alert('❌ Suppression annulée')
      return
    }

    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', userId })
      })

      if (!res.ok) throw new Error('Erreur')

      alert('✅ Utilisateur supprimé avec succès')
      fetchUsers()
    } catch (error) {
      alert('❌ Erreur lors de la suppression')
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(u => 
    (u.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const admins = filteredUsers.filter(u => u.role === 'admin')
  const students = filteredUsers.filter(u => u.role !== 'admin')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">{users.length} utilisateur(s) au total</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom ou email..."
            className="pl-10 rounded-xl w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl md:text-3xl font-bold">{users.length}</p>
              </div>
              <User className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Étudiants</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
              <User className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administrateurs</p>
                <p className="text-2xl md:text-3xl font-bold text-purple-600">{admins.length}</p>
              </div>
              <Shield className="h-8 w-8 md:h-10 md:w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Tous les utilisateurs {searchQuery && `(${filteredUsers.length} résultat(s))`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? 'Aucun résultat trouvé' : 'Aucun utilisateur'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-800' 
                        : 'bg-gradient-to-br from-blue-600 to-blue-800'
                    }`}>
                      <span className="text-white font-bold text-sm md:text-lg">
                        {user.full_name?.[0] || user.email?.[0] || '?'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                          {user.full_name || 'Sans nom'}
                        </p>
                        {user.role === 'admin' && (
                          <Badge className="bg-purple-600 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 mt-1">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Message */}
                    <Link href={`/app/admin/messages?user=${user.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        disabled={actionLoading === user.id}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </Link>

                    {/* Changer rôle */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleChangeRole(user.id, user.role)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <UserCog className="h-3 w-3 mr-1" />
                      )}
                      {user.role === 'admin' ? 'Retirer admin' : 'Promouvoir'}
                    </Button>

                    {/* Supprimer */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Supprimer
                    </Button>
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
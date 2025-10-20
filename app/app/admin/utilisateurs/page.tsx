// app/app/admin/utilisateurs/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { supabaseServer } from '@/lib/supabase-server'
import { Search, User, Mail, Calendar, Shield, MoreVertical } from 'lucide-react'

async function getUsers() {
  const sb = await supabaseServer()
  
  const { data: profiles } = await sb
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false })

  return profiles || []
}

export default async function UtilisateursPage() {
  const users = await getUsers()
  
  const admins = users.filter(u => u.role === 'admin')
  const students = users.filter(u => u.role !== 'admin')

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
            placeholder="Rechercher..."
            className="pl-10 rounded-xl w-full"
          />
        </div>
      </div>

      {/* Stats - Responsive Grid */}
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
          <CardTitle className="text-lg md:text-xl">Tous les utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun utilisateur</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
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
                      
                      {/* Email - Mobile */}
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 mt-1">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      {/* Date - Mobile */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Mobile: Menu, Desktop: Boutons */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {/* Desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Modifier
                      </button>
                      <button className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition">
                        Supprimer
                      </button>
                    </div>
                    
                    {/* Mobile */}
                    <button className="sm:hidden p-2 hover:bg-gray-200 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
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
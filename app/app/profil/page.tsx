import { supabaseServer } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Calendar, Shield } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SupportForm from './SupportForm'
import AvatarUpload from './AvatarUpload'
import DeleteAccountButton from './DeleteAccountButton'

// action serveur identique à la tienne
async function updateProfileAction(formData: FormData) {
  'use server'
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const full_name = (formData.get('full_name') as string | null)?.trim() || null
  const phone = (formData.get('phone') as string | null)?.trim() || null
  const country = (formData.get('country') as string | null)?.trim() || null

  await sb.from('profiles').update({ full_name, phone, country }).eq('id', user.id)
  revalidatePath('/app/profil')
}

export default async function ProfilPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // URL publique (avec cache-busting)
  let avatarUrl: string | null = null
  if (profile?.avatar_url) {
    const { data: pub } = sb.storage.from('avatars').getPublicUrl(profile.avatar_url)
    avatarUrl = pub?.publicUrl ? `${pub.publicUrl}?v=${Date.now()}` : null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-1">Gère tes informations personnelles</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">

              {/* 👉 Ici on passe bien l’URL publique au composant */}
              <AvatarUpload avatarUrl={avatarUrl} hasAvatar={!!profile?.avatar_url} />

              <h2 className="text-xl font-bold text-gray-900 mt-4">
                {profile?.full_name || 'Utilisateur'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500">Membre depuis</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.created_at || '').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Shield className="h-5 w-5 text-blue-700" />
                  <div className="text-left flex-1">
                    <p className="text-xs text-blue-600">Statut</p>
                    <p className="text-sm font-medium text-blue-700">
                      {profile?.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 w-full">
                  <Link href="/auth/forgot" className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Changer mon mot de passe
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de modification */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  name="full_name"
                  defaultValue={profile?.full_name ?? ''}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone ?? ''}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays d'origine
                </label>
                <select
                  name="country"
                  defaultValue={profile?.country ?? ''}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionne ton pays</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Mali">Mali</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Togo">Togo</option>
                  <option value="Niger">Niger</option>
                  <option value="Guinée">Guinée</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (non modifiable)
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pour changer ton email, contacte le support
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold">
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Décris ton problème ci-dessous, notre équipe te répondra rapidement.
          </p>
          <SupportForm />
        </CardContent>
      </Card>

      {/* Zone de danger */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Zone de danger</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-4">Actions irréversibles sur ton compte</p>
          <div className="flex gap-3">
            <Link
              href="/auth/forgot"
              className="inline-flex items-center justify-center rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Changer mon mot de passe
            </Link>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
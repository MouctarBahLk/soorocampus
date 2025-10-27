// app/app/mon-dossier/page.tsx
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import UploadDropzone from '@/components/upload-dropzone'
import StatusBadge from '@/components/status-badge'
import { Upload, FileText, CheckCircle2, MessageSquare, Sparkles, Calendar, AlertCircle } from 'lucide-react'

type DbDocRaw = {
  id: string
  nom: string
  url: string
  type_doc: string | null
  created_at: string
}

type DbDoc = {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  created_at: string
}

type SignedDoc = DbDoc & { url: string | null }
type ProfileRow = { full_name: string | null; payment_status?: 'none' | 'partial' | 'full' } | null

const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET ?? 'documents'

function getDisplayName(user: any, profile: ProfileRow): string {
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
  if (!user) return { user: null } as const

  // 👉 On lit aussi payment_status ici
  const { data: profile } = await sb
    .from('profiles')
    .select('full_name, payment_status')
    .eq('id', user.id)
    .maybeSingle<ProfileRow>()

  let { data: app } = await sb
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!app) {
    const { data: created } = await sb
      .from('applications')
      .insert({ user_id: user.id, statut: 'non_cree' })
      .select()
      .single()
    app = created ?? null
  }

  const { data: docsRaw } = await sb
    .from('documents')
    .select('id, nom, url, type_doc, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const docs: DbDoc[] = (docsRaw ?? []).map((d: DbDocRaw) => ({
    id: d.id,
    file_name: d.nom,
    file_path: d.url,
    file_type: d.type_doc,
    created_at: d.created_at,
  }))

  const documents: SignedDoc[] = await Promise.all(
    docs.map(async d => {
      const { data } = await sb.storage
        .from(BUCKET)
        .createSignedUrl(d.file_path, 60)
      return { ...d, url: data?.signedUrl ?? null }
    })
  )

  const paymentStatus: 'none' | 'partial' | 'full' = (profile?.payment_status as any) || 'none'

  return { user, profile, app, documents, paymentStatus } as const
}

export default async function MonDossier() {
  const data = await getData()
  if (!data.user) return <p>Connectez-vous.</p>

  const { user, profile, app, documents, paymentStatus } = data

  const dossierStatut = (app?.statut ?? 'non_cree') as
    | 'en attente' | 'validé' | 'refusé' | 'non_cree' | 'en cours'

  const readable =
    dossierStatut === 'non_cree' ? 'non créé'
      : dossierStatut === 'en cours' ? 'en cours'
      : dossierStatut

  const displayName = getDisplayName(user, profile)

  // ✅ Upload autorisé SI paiement au moins partiel (validé manuellement par admin)
  const canUpload = (paymentStatus !== 'none') && (dossierStatut === 'non_cree' || dossierStatut === 'en cours')

  async function setEnCours() {
    'use server'
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    await sb.from('applications').update({ statut: 'en cours' }).eq('user_id', user.id)
    revalidatePath('/app/mon-dossier')
  }

  async function deposer() {
    'use server'
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return

    // ❗ Sécurité côté serveur : blocage si paiement pas complet
    const { data: prof } = await sb
      .from('profiles')
      .select('payment_status')
      .eq('id', user.id)
      .single()

    if (prof?.payment_status !== 'full') {
      return { error: 'Paiement complet requis pour envoyer le dossier' }
    }

    await sb.from('applications').update({ statut: 'en attente' }).eq('user_id', user.id)
    revalidatePath('/app/mon-dossier')
  }

  async function deleteDoc(formData: FormData) {
    'use server'
    const id = String(formData.get('id') ?? '')
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return

    const { data: doc } = await sb
      .from('documents')
      .select('id,user_id,url')
      .eq('id', id)
      .single()
    if (!doc || doc.user_id !== user.id) return

    const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET ?? 'documents'
    if (doc.url) await sb.storage.from(BUCKET).remove([doc.url])
    await sb.from('documents').delete().eq('id', id)

    revalidatePath('/app/mon-dossier')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                Mon dossier
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Bienvenue <span className="font-semibold text-gray-900">{displayName}</span>
              </p>
            </div>
            {paymentStatus === 'none' && (
              <Link
                href="/app/paiements"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-3 sm:px-6 sm:py-3 font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5" />
                Activer l'accompagnement
              </Link>
            )}
          </div>

          {/* Cards de statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="text-sm font-semibold text-gray-600">Statut du dossier</div>
              </div>
              <StatusBadge status={
                readable === 'validé' ? 'validé'
                  : readable === 'en attente' ? 'en attente'
                    : readable === 'refusé' ? 'refusé'
                      : 'en attente'
              } />
            </div>

            <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-gray-600">Statut du paiement</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {paymentStatus === 'full' ? 'payé (complet)' : paymentStatus === 'partial' ? 'payé (partiel)' : 'non payé'}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="text-sm font-semibold text-gray-600">Dernière mise à jour</div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        </div>

        {/* Upload + Liste documents */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Carte Upload */}
          <div className="rounded-2xl border-2 border-blue-200 bg-white p-5 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Déposer les documents</h2>
            </div>

            {/* Alerte paiement partiel */}
            {paymentStatus === 'partial' && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900 mb-1">⚠️ Paiement partiel reçu</p>
                    <p className="text-sm text-amber-800">
                      Vous pouvez déposer vos documents maintenant. <strong>L'envoi final du dossier est bloqué</strong> jusqu'au paiement du solde.
                    </p>
                    <Link
                      href="/app/paiements"
                      className="inline-block mt-3 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                    >
                      Payer le solde maintenant
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <UploadDropzone disabled={!canUpload} />

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {dossierStatut === 'non_cree' && paymentStatus !== 'none' && (
                <form action={setEnCours} className="flex-1">
                  <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-3 font-bold hover:shadow-lg transition-all">
                    Créer mon dossier
                  </button>
                </form>
              )}
              {dossierStatut === 'en cours' && paymentStatus !== 'none' && (
                <form action={deposer} className="flex-1">
                  <button
                    disabled={!documents.length || paymentStatus !== 'full'}
                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {paymentStatus !== 'full' ? (
                      <>
                        🔒 Déposer mon dossier
                        <span className="block text-xs mt-1">Paiement complet requis</span>
                      </>
                    ) : (
                      'Déposer mon dossier'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Carte Liste documents */}
          <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mes documents ({documents.length})</h2>
            </div>

            {!documents.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Aucun document</p>
                <p className="text-sm text-gray-500 mt-1">Commencez par déposer vos premiers fichiers</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[50vh] md:max-h-[600px] overflow-y-auto">
                {documents.map(d => (
                  <li
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-3 hover:border-purple-300 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 break-words">{d.file_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {d.file_type ?? '—'} • {new Date(d.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {d.url ? (
                        <a
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-colors"
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Voir
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">URL expirée</span>
                      )}
                      <form action={deleteDoc}>
                        <input type="hidden" name="id" value={d.id} />
                        <button className="rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 text-sm font-semibold transition-colors">
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* CTA Conseils */}
        <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Besoin de conseils personnalisés ?</div>
              <p className="text-gray-600">Un expert vous répond selon votre dossier.</p>
            </div>
          </div>
          <Link
            href="/app/conseils"
            className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-3 font-bold hover:shadow-lg transition-all text-center"
          >
            Obtenir des conseils
          </Link>
        </div>
      </div>
    </div>
  )
}

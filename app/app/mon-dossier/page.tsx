// app/app/mon-dossier/page.tsx
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import UploadDropzone from '@/components/upload-dropzone'
import StatusBadge from '@/components/status-badge'

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

const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET ?? 'documents'

async function getData() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { user: null } as const

  const { data: paysRaw } = await sb
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const payments = Array.isArray(paysRaw) ? paysRaw : []
  const paid = payments.some(p => p.status === 'succeeded')

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

  return { user, paid, app, documents } as const
}

export default async function MonDossier() {
  const data = await getData()
  if (!data.user) return <p>Connecte-toi.</p>

  const { user, paid, app, documents } = data
  const dossierStatut = (app?.statut ?? 'non_cree') as 'en attente' | 'validé' | 'refusé' | 'non_cree' | 'en cours'
  const readable =
    dossierStatut === 'non_cree' ? 'non créé'
    : dossierStatut === 'en cours' ? 'en cours'
    : dossierStatut

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
    await sb.from('applications').update({ statut: 'en attente' }).eq('user_id', user.id)
    revalidatePath('/app/mon-dossier')
  }

  // === suppression côté serveur (server action) ===
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

  const canUpload = paid && (dossierStatut === 'non_cree' || dossierStatut === 'en cours')

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mon dossier</h1>
          <p className="text-gray-500 mt-1">Bienvenue {user.email?.split('@')[0]} 👋</p>
        </div>
        {!paid && (
          <Link href="/app/paiements" className="rounded-2xl bg-[#1E3A8A] text-white px-4 py-2 font-semibold">
            Activer l’accompagnement
          </Link>
        )}
      </header>

      {/* Statuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Statut du dossier</div>
          <StatusBadge status={
            readable === 'validé' ? 'validé'
            : readable === 'en attente' ? 'en attente'
            : readable === 'refusé' ? 'refusé'
            : 'en attente'
          } />
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Statut du paiement</div>
          <StatusBadge status={paid ? 'payé' : 'non payé'} />
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-gray-500 mb-1">Dernière mise à jour</div>
          <div className="font-semibold">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Upload + liste */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold mb-3">Déposer les documents</h2>
          <ul className="text-sm text-gray-600 mb-4 list-disc pl-5 space-y-1">
            <li>Photo d’identité fond blanc (≤ 450 Ko)</li>
            <li>Relevés des 2–3 dernières années</li>
            <li>Relevé du bac + diplôme (si admis)</li>
            <li>Attestation en cours (si applicable)</li>
            <li>Passeport biométrique</li>
          </ul>

          <UploadDropzone disabled={!canUpload} />

          <div className="mt-4 flex gap-3">
            {dossierStatut === 'non_cree' && paid && (
              <form action={setEnCours}>
                <button className="rounded-xl bg-[#1E3A8A] text-white px-4 py-2 font-semibold">
                  Créer mon dossier
                </button>
              </form>
            )}
            {dossierStatut === 'en cours' && paid && (
              <form action={deposer}>
                <button
                  disabled={!documents.length}
                  className="rounded-xl bg-green-700 text-white px-4 py-2 font-semibold disabled:opacity-50"
                >
                  Déposer mon dossier
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold mb-3">Mes documents</h2>
          {!documents.length && <p className="text-gray-600">Aucun document.</p>}
          <ul className="space-y-3">
            {(documents ?? []).map(d => (
              <li key={d.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div>
                  <div className="font-medium">{d.file_name}</div>
                  <div className="text-xs text-gray-500">
                    {d.file_type ?? '—'} • {new Date(d.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {d.url
                    ? <a className="rounded-xl border px-3 py-1.5 hover:bg-gray-50" href={d.url} target="_blank" rel="noreferrer">Voir</a>
                    : <span className="text-xs text-gray-400">URL expirée</span>}
                  <form action={deleteDoc}>
                    <input type="hidden" name="id" value={d.id} />
                    <button className="rounded-xl border px-3 py-1.5 hover:bg-red-50" title="Supprimer définitivement">
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex items-center justify-between">
        <div>
          <div className="font-semibold">Besoin de conseils personnalisés ?</div>
          <p className="text-sm text-gray-600">Un expert vous répond selon votre dossier.</p>
        </div>
        <Link href="/app/conseils" className="rounded-2xl bg-[#1E3A8A] text-white px-4 py-2 font-semibold">
          Obtenir des conseils
        </Link>
      </div>
    </div>
  )
}

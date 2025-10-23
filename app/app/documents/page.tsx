"use client"

import { useEffect, useState } from "react"
import UploadDropzone from "@/components/upload-dropzone"
import { FileText, Download, Calendar, BadgeCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DocRow = {
  id: string
  user_id: string
  nom: string | null
  url: string | null
  type_doc: string | null
  sub_type: string | null
  statut: string | null
  created_at: string
  link?: string
}

const DOC_LABELS: { [key: string]: string } = {
  photo_identite: "Photo d'identité",
  cv: "CV",
  releve_notes: "Relevés de notes",
  releve_notes_terminale: "Relevés (Terminale)",
  diplome_bac: "Diplôme du bac",
  passeport: "Passeport",
}

const SUB_TYPE_LABELS: { [key: string]: string } = {
  attestation_2025: "Attestation 2025-2026",
  releve_2025: "Attestation 2025-2026",
  releve_2024: "Bulletin 2024-2025",
  releve_2023: "Bulletin 2023-2024",
  releve_2022: "Bulletin 2022-2023",
  attestation_terminale: "Attestation Terminale",
  bulletin_12eme: "Bulletin 12ème",
  bulletin_11eme: "Bulletin 11ème",
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [dossierCheck, setDossierCheck] = useState<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const loadData = async (skipLoading = false) => {
    try {
      if (!skipLoading) setIsLoading(true)
      const docRes = await fetch("/api/documents/list?t=" + Date.now())
      if (!docRes.ok) throw new Error("Erreur de chargement")
      const docData = await docRes.json()
      setDocs(docData.docs || [])

      const checkRes = await fetch("/api/documents/check-dossier?t=" + Date.now())
      if (checkRes.ok) {
        const checkData = await checkRes.json()
        setDossierCheck(checkData)
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e)
      setError(err)
    } finally {
      if (!skipLoading) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // === suppression côté client via l’API ===
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ce document ?")) return
    setError(null)
    try {
      const res = await fetch("/api/documents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Suppression impossible")

      // retire localement pour éviter un reload complet
      setDocs(prev => prev.filter(x => x.id !== id))
      setSuccessMsg("Document supprimé.")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSubmitDossier = async () => {
    if (!dossierCheck?.isComplete) {
      setError("Complète d'abord tous les documents requis !")
      return
    }

    setSubmitLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/documents/submit-dossier", { method: "POST" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setSuccessMsg("Dossier soumis avec succès !")
      setError(null)

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e)
      setError(err)
    } finally {
      setSubmitLoading(false)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" })

  const badge = (statut?: string | null) => {
    const s = (statut ?? "").toLowerCase()
    if (s.includes("valid"))
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          <BadgeCheck className="h-3 w-3" /> validé
        </span>
      )
    if (s.includes("attent"))
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          en attente
        </span>
      )
    if (s.includes("soumis"))
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          soumis
        </span>
      )
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
        {statut ?? "—"}
      </span>
    )
  }

  if (isLoading) {
    return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes documents</h1>
        <p className="mt-1 text-gray-600">Gère tous tes documents Campus France</p>
      </div>
      <div className="flex justify-center items-center h-64 text-gray-600">
        Chargement...
      </div>
    </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes documents</h1>
        <p className="mt-1 text-gray-600">Gère tous tes documents Campus France</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ {successMsg}
        </div>
      )}

      {dossierCheck && (
        <Card className={dossierCheck.isComplete ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {dossierCheck.isComplete ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-900">Dossier complet ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">Documents requis</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className={`flex items-center gap-2 font-medium ${dossierCheck.details.photo_identite ? "text-green-700" : "text-gray-600"}`}>
                {dossierCheck.details.photo_identite ? "✓" : "○"} Photo d'identité
              </div>
              <div className={`flex items-center gap-2 font-medium ${dossierCheck.details.cv ? "text-green-700" : "text-gray-600"}`}>
                {dossierCheck.details.cv ? "✓" : "○"} CV
              </div>
              <div className={`flex items-center gap-2 font-medium ${dossierCheck.details.releve_notes ? "text-green-700" : "text-gray-600"}`}>
                {dossierCheck.details.releve_notes ? "✓" : "○"} Relevés de notes
                {!dossierCheck.details.isTerminale && <span className="text-xs font-normal ml-1">(3 dernières années)</span>}
                {dossierCheck.details.isTerminale && <span className="text-xs font-normal ml-1">(Attestation + 11ème + 12ème)</span>}
              </div>
              {!dossierCheck.details.isTerminale && (
                <div className={`flex items-center gap-2 font-medium ${dossierCheck.details.diplome_bac ? "text-green-700" : "text-gray-600"}`}>
                  {dossierCheck.details.diplome_bac ? "✓" : "○"} Diplôme du bac + relevé
                </div>
              )}
              <div className={`flex items-center gap-2 font-medium ${dossierCheck.details.passeport ? "text-green-700" : "text-gray-600"}`}>
                {dossierCheck.details.passeport ? "✓" : "○"} Passeport biométrique
              </div>
            </div>

            {dossierCheck.isComplete && !docs.some(d => d.statut === "soumis") && (
              <button
                onClick={handleSubmitDossier}
                disabled={submitLoading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition"
              >
                {submitLoading ? "Envoi en cours..." : "✓ Déposer mon dossier"}
              </button>
            )}

            {docs.some(d => d.statut === "soumis") && (
              <div className="w-full mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm font-medium text-green-900">
                ✓ Dossier soumis avec succès !
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardHeader>
          <CardTitle>Ajouter un document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">Documents requis :</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Photo d&apos;identité (fond blanc, ≤ 450 Ko)</li>
              <li>CV</li>
              <li>Relevés de notes (3 dernières années ou Terminale)</li>
              <li>Diplôme du bac + relevé</li>
              <li>Passeport biométrique</li>
            </ul>
          </div>
          <UploadDropzone onUploadSuccess={() => setTimeout(loadData, 1000)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Documents déposés ({docs.length})</span>
            <button
              onClick={() => loadData(true)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded font-medium"
            >
              ↻ Actualiser
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-600">Aucun document pour le moment</p>
              <p className="mt-1 text-sm text-gray-500">Ajoute tes premiers fichiers ci-dessus.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-4 rounded-xl border bg-gray-50 p-4 transition hover:bg-gray-100"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">{d.nom ?? "Document"}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                          {DOC_LABELS[d.type_doc ?? ""] || d.type_doc}
                        </span>
                        {d.sub_type && (
                          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {SUB_TYPE_LABELS[d.sub_type] || d.sub_type}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(d.created_at)}
                        </span>
                        {badge(d.statut)}
                      </div>
                    </div>
                  </div>

                  {/* Actions à droite : Voir + Supprimer */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {d.link ? (
                      <a
                        href={d.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                      >
                        <Download className="h-4 w-4" />
                        Voir
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Indisponible</span>
                    )}

                    <button
                      onClick={() => handleDelete(d.id)}
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-red-50"
                      title="Supprimer définitivement"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

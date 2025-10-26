"use client"

import { useEffect, useState } from "react"
import UploadDropzone from "@/components/upload-dropzone"
import { FileText, Download, Calendar, BadgeCheck, AlertCircle, CheckCircle2, Sparkles, Upload } from "lucide-react"
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

      setDocs(prev => prev.filter(x => x.id !== id))
      setSuccessMsg("Document supprimé.")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSubmitDossier = async () => {
    if (!dossierCheck?.isComplete) {
      setError("Complétez d'abord tous les documents requis !")
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Mes documents 📄</h1>
          <p className="text-xl text-gray-600 mb-12">Gérez tous vos documents Campus France</p>
          <div className="flex justify-center items-center h-64 text-gray-600">
            Chargement...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Mes documents 📄
          </h1>
          <p className="text-xl text-gray-600">
            Gérez tous vos documents Campus France
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-6 py-4 text-sm text-red-800 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>⚠️ {error}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-4 text-sm text-green-800 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>✓ {successMsg}</span>
          </div>
        )}

        {/* Vérification dossier */}
        {dossierCheck && (
          <Card className={`mb-8 border-2 ${dossierCheck.isComplete ? "bg-gradient-to-br from-green-50 to-white border-green-200" : "bg-gradient-to-br from-blue-50 to-white border-blue-200"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dossierCheck.isComplete ? "bg-green-100" : "bg-blue-100"}`}>
                  {dossierCheck.isComplete ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <span className={dossierCheck.isComplete ? "text-green-900" : "text-blue-900"}>
                  {dossierCheck.isComplete ? "Dossier complet ✓" : "Documents requis"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
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
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
                >
                  {submitLoading ? "Envoi en cours..." : "✓ Déposer mon dossier"}
                </button>
              )}

              {docs.some(d => d.statut === "soumis") && (
                <div className="w-full mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center text-sm font-bold text-green-900">
                  ✓ Dossier soumis avec succès !
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Zone Upload */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl">Ajouter un document</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="mb-2 text-sm font-semibold text-blue-900">📋 Documents requis :</p>
                <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
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

          {/* Liste documents */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">Documents déposés ({docs.length})</span>
                </div>
                <button
                  onClick={() => loadData(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  ↻ Actualiser
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {docs.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Aucun document pour le moment</p>
                  <p className="mt-1 text-sm text-gray-500">Ajoutez vos premiers fichiers ci-dessus.</p>
                </div>
              ) : (
                <ul className="space-y-3 max-h-[600px] overflow-y-auto">
                  {docs.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-4 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 transition hover:border-blue-300 hover:shadow-md"
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

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {d.link ? (
                          <a
                            href={d.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
                          >
                            <Download className="h-4 w-4" />
                            Voir
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Indisponible</span>
                        )}

                        <button
                          onClick={() => handleDelete(d.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition"
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
      </div>
    </div>
  )
}
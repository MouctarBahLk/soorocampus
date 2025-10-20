// app/app/admin/dossiers/[id]/page.tsx
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, FileText, Download, CheckCircle, XCircle, ArrowLeft } from "lucide-react"

async function getDossierDetails(id: string) {
  const sb = await supabaseServer()

  try {
    const { data: app } = await sb
      .from("applications")
      .select("*")
      .eq("id", id)
      .single()

    if (!app) return { app: null, profile: null, documents: [], payments: [] }

    const { data: profile } = await sb
      .from("profiles")
      .select("*")
      .eq("id", app.user_id)
      .single()

    const { data: docs } = await sb
      .from("documents")
      .select("*")
      .eq("user_id", app.user_id)
      .order("created_at", { ascending: false })

    const documents = await Promise.all(
      (docs || []).map(async (d) => {
        if (!d.url) return { ...d, link: null }
        try {
          const { data } = await sb.storage
            .from("documents")
            .createSignedUrl(d.url, 3600)
          return { ...d, link: data?.signedUrl || null }
        } catch {
          return { ...d, link: null }
        }
      })
    )

    const { data: payments } = await sb
      .from("payments")
      .select("*")
      .eq("user_id", app.user_id)
      .order("created_at", { ascending: false })

    return { app, profile, documents, payments: payments || [] }
  } catch (error) {
    console.error('Error:', error)
    return { app: null, profile: null, documents: [], payments: [] }
  }
}

export default async function DossierDetailPage({ params }: any) {
  const resolvedParams = await params
  const { app, profile, documents, payments } = await getDossierDetails(resolvedParams.id)

  if (!app) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Dossier introuvable</h2>
          <Link href="/app/admin/dossiers" className="text-blue-600 hover:underline mt-4 inline-block">
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Retour
          </Link>
        </div>
      </div>
    )
  }

  const fullName = profile 
    ? `${profile.prenom || ""} ${profile.nom || ""}`.trim() || profile.email
    : "Utilisateur"
  
  const paid = payments?.some((p: any) => p.status === "succeeded")
  const paidAmount = ((payments?.find((p: any) => p.status === "succeeded")?.amount || 0) / 100).toFixed(2)

  async function updateStatus(formData: FormData) {
    "use server"
    const sb = await supabaseServer()
    const statut = formData.get("statut") as string
    await sb.from("applications").update({ statut }).eq("id", resolvedParams.id)
    revalidatePath(`/app/admin/dossiers/${resolvedParams.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/app/admin/dossiers" className="text-sm text-blue-600 hover:underline mb-2 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 break-words">
          Dossier de {fullName}
        </h1>
      </div>

      {/* Grid responsive: 1 colonne mobile, 3 colonnes desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche: Info étudiant + paiement */}
        <div className="lg:col-span-1 space-y-6">
          {/* Info étudiant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations étudiant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg md:text-2xl font-bold">
                    {fullName[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-base md:text-lg truncate">{fullName}</p>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{profile?.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{profile?.email || "Non renseigné"}</p>
                  </div>
                </div>

                {profile?.telephone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 flex-shrink-0">📞</span>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium">{profile.telephone}</p>
                    </div>
                  </div>
                )}

                {profile?.pays && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 flex-shrink-0">🌍</span>
                    <div>
                      <p className="text-xs text-gray-500">Pays</p>
                      <p className="text-sm font-medium">{profile.pays}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Inscrit le</p>
                    <p className="text-sm font-medium">
                      {new Date(app.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href={`/app/admin/messages?user=${app.user_id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm md:text-base">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Statut paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Statut du paiement</CardTitle>
            </CardHeader>
            <CardContent>
              {paid ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 text-sm md:text-base">Payé</p>
                    <p className="text-xs text-green-700">{paidAmount} €</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm md:text-base">Non payé</p>
                    <p className="text-xs text-red-700">En attente</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite: Statut + Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statut du dossier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateStatus} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <select
                    name="statut"
                    defaultValue={app.statut || "en cours"}
                    className="flex-1 border rounded-xl px-4 py-3 text-sm md:text-base"
                  >
                    <option value="non_cree">Non créé</option>
                    <option value="en cours">En cours</option>
                    <option value="en attente">En attente</option>
                    <option value="validé">✅ Validé</option>
                    <option value="refusé">❌ Refusé</option>
                  </select>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 sm:w-auto">
                    Enregistrer
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="text-gray-600">Statut actuel :</span>
                  <Badge className={
                    app.statut === "validé" ? "bg-green-600" :
                    app.statut === "refusé" ? "bg-red-600" :
                    app.statut === "en attente" ? "bg-amber-500" :
                    "bg-gray-500"
                  }>
                    {app.statut || "En cours"}
                  </Badge>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents déposés ({documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun document</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl border">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm md:text-base truncate">{doc.nom || "Document"}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type_doc} • {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      {doc.link && (
                        <a 
                          href={doc.link} 
                          target="_blank" 
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs md:text-sm flex items-center justify-center gap-2 sm:w-auto"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
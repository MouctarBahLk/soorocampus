// app/app/admin/dossiers/[id]/page.tsx
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, FileText, Download, CheckCircle, XCircle, ArrowLeft, AlertCircle } from "lucide-react"

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

    const BUCKET = 'documents'
    
    const documents = await Promise.all(
      (docs || []).map(async (d) => {
        if (!d.url) {
          return { ...d, link: null, error: 'Pas de fichier' }
        }
        
        try {
          const filePath = d.url.trim()
          
          console.log('📄 Génération URL pour admin:', filePath)
          
          // ✅ CORRECTION : Créer URL signée valide 24h
          const { data: signedData, error: signError } = await sb.storage
            .from(BUCKET)
            .createSignedUrl(filePath, 86400, {
              download: false
            })
          
          if (signError) {
            console.error('❌ Erreur création URL signée:', signError)
            return { ...d, link: null, error: signError.message }
          }
          
          if (!signedData?.signedUrl) {
            console.error('❌ URL signée vide pour:', filePath)
            return { ...d, link: null, error: 'URL non générée' }
          }
          
          console.log('✅ URL générée avec succès pour admin:', d.nom)
          
          return { 
            ...d, 
            link: signedData.signedUrl,
            error: null
          }
        } catch (err) {
          console.error('❌ Erreur traitement doc admin:', err)
          return { ...d, link: null, error: 'Erreur technique' }
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
    console.error('❌ Error getDossierDetails:', error)
    return { app: null, profile: null, documents: [], payments: [] }
  }
}

export default async function DossierDetailPage({ params }: any) {
  const resolvedParams = await params
  const { app, profile, documents, payments } = await getDossierDetails(resolvedParams.id)

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dossier introuvable</h2>
              <Link href="/app/admin/dossiers" className="text-blue-600 hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux dossiers
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const fullName = profile?.full_name || profile?.email?.split('@')[0] || "Utilisateur"
  const paid = payments?.some((p: any) => p.status === "succeeded")
  const paymentStatus = profile?.payment_status || 'none'

  async function updateStatus(formData: FormData) {
    "use server"
    const sb = await supabaseServer()
    const statut = formData.get("statut") as string
    await sb.from("applications").update({ statut }).eq("id", resolvedParams.id)
    revalidatePath(`/app/admin/dossiers/${resolvedParams.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/app/admin/dossiers" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Retour aux dossiers
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Dossier de {fullName}
          </h1>
          <p className="text-xl text-gray-600">{profile?.email}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info étudiant */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b-2 border-blue-200">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xl">Informations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {fullName[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium truncate">{profile?.email || "Non renseigné"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Inscrit le</p>
                      <p className="text-sm font-medium">
                        {new Date(app.created_at).toLocaleDateString("fr-FR", {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-slate-200">
                  <Link href={`/app/admin/messages?user=${app.user_id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg font-bold">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Statut paiement */}
            <Card className={`border-2 shadow-lg ${
              paymentStatus === 'full' ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' :
              paymentStatus === 'partial' ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white' :
              'border-red-200 bg-gradient-to-br from-red-50 to-white'
            }`}>
              <CardHeader>
                <CardTitle className="text-xl">Statut du paiement</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentStatus === 'full' ? (
                  <div className="flex items-center gap-3 p-4 bg-green-100 rounded-xl border-2 border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-900">Payé complet (100%)</p>
                      <p className="text-sm text-green-700">Peut envoyer son dossier</p>
                    </div>
                  </div>
                ) : paymentStatus === 'partial' ? (
                  <div className="flex items-center gap-3 p-4 bg-amber-100 rounded-xl border-2 border-amber-200">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-900">Payé partiel (50%)</p>
                      <p className="text-sm text-amber-700">Envoi bloqué jusqu'au solde</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-red-100 rounded-xl border-2 border-red-200">
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-red-900">Non payé</p>
                      <p className="text-sm text-red-700">En attente de paiement</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut du dossier */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b-2 border-purple-200">
                <CardTitle className="text-xl">Statut du dossier</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form action={updateStatus} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <select
                      name="statut"
                      defaultValue={app.statut || "en cours"}
                      className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium focus:border-purple-500 focus:outline-none"
                    >
                      <option value="non_cree">Non créé</option>
                      <option value="en cours">En cours</option>
                      <option value="en attente">En attente</option>
                      <option value="validé">✅ Validé</option>
                      <option value="refusé">❌ Refusé</option>
                    </select>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg"
                    >
                      Enregistrer
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Statut actuel :</span>
                    <Badge className={`text-sm font-bold ${
                      app.statut === "validé" ? "bg-green-600" :
                      app.statut === "refusé" ? "bg-red-600" :
                      app.statut === "en attente" ? "bg-amber-500" :
                      "bg-gray-500"
                    }`}>
                      {app.statut || "En cours"}
                    </Badge>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b-2 border-slate-200">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="text-xl">Documents déposés ({documents.length})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Aucun document déposé</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc: any) => (
                      <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 truncate">{doc.nom || "Document"}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type_doc || 'Document'} • {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        
                        {doc.link ? (
                          <a 
                            href={doc.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            <Download className="h-4 w-4" />
                            <span>Télécharger</span>
                          </a>
                        ) : (
                          <div className="px-6 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
                            ❌ {doc.error || 'Non disponible'}
                          </div>
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
    </div>
  )
}
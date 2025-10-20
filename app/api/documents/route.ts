// app/api/documents/route.ts
import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET || "documents"

export async function POST(req: Request) {
  try {
    const sb = await supabaseServer()

    // 1. Vérifier l'utilisateur
    const { data: userData, error: userErr } = await sb.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = userData.user

    // 2. Récupérer les données du formulaire
    const form = await req.formData()
    const file = form.get("file")
    const type_doc = form.get("type_doc") as string | null // ✅ Nom correct
    const sub_type = form.get("sub_type") as string | null

    // 3. Validations
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    if (!type_doc) {
      return NextResponse.json({ error: "Type de document requis" }, { status: 400 })
    }

    // Validation taille photo d'identité
    if (type_doc === 'photo_identite' && file.size > 450 * 1024) {
      return NextResponse.json({ 
        error: 'La photo d\'identité doit faire moins de 450 Ko' 
      }, { status: 400 })
    }

    // Validation taille générale (10 Mo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Le fichier est trop lourd (max 10 Mo)' 
      }, { status: 400 })
    }

    // 4. Vérifier/Créer l'application (dossier) si elle n'existe pas
    let { data: app } = await sb
      .from("applications")
      .select("id, statut")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!app) {
      // Créer automatiquement le dossier
      const { data: newApp, error: appErr } = await sb
        .from("applications")
        .insert({
          user_id: user.id,
          statut: "en cours",
        })
        .select("id, statut")
        .single()

      if (appErr) {
        console.error("Erreur création dossier:", appErr)
        return NextResponse.json({ 
          error: `Erreur création dossier: ${appErr.message}` 
        }, { status: 500 })
      }
      app = newApp
    }

    // 5. Upload du fichier
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${user.id}/${timestamp}-${sanitizedName}`

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, file, { 
        upsert: false, 
        contentType: file.type || undefined 
      })

    if (upErr) {
      console.error("Upload error:", upErr)
      return NextResponse.json({ 
        error: `Erreur d'upload: ${upErr.message}` 
      }, { status: 400 })
    }

    // 6. Créer un lien signé (valide 1 an)
    const { data: signedData } = await sb.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365)

    // 7. Insérer dans la table documents
    const { data: docData, error: insErr } = await sb
      .from("documents")
      .insert({
        user_id: user.id,
        application_id: app.id,
        nom: file.name,
        url: path,
        type_doc: type_doc, // ✅ Colonne correcte
        sub_type: sub_type || null, // ✅ Sous-type
        statut: "en attente",
      })
      .select()
      .single()

    if (insErr) {
      console.error("Insert error:", insErr)
      // Supprimer le fichier uploadé si l'insertion échoue
      await sb.storage.from(BUCKET).remove([path])
      
      return NextResponse.json({ 
        error: `Erreur base de données: ${insErr.message}` 
      }, { status: 500 })
    }

    // 8. Mettre à jour le statut du dossier si nécessaire
    if (app.statut === "non_cree") {
      await sb
        .from("applications")
        .update({ statut: "en cours" })
        .eq("id", app.id)
    }

    // 9. Retourner une réponse de succès
    return NextResponse.json({ 
      success: true,
      ok: true,
      document: {
        ...docData,
        link: signedData?.signedUrl || null,
      }
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("Unexpected error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
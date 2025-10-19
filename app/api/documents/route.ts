import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET || "documents"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    const type = form.get("type") as string | null // Type de document

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json({ error: "Type de document requis" }, { status: 400 })
    }

    const sb = await supabaseServer()

    // 1. Vérifier l'utilisateur
    const { data: userData, error: userErr } = await sb.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = userData.user

    // 2. Vérifier/Créer l'application (dossier) si elle n'existe pas
    let { data: app } = await sb
      .from("applications")
      .select("id")
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
        .select("id")
        .single()

      if (appErr) {
        return NextResponse.json({ error: `Erreur création dossier: ${appErr.message}` }, { status: 500 })
      }
      app = newApp
    }

    // 3. Upload du fichier
    const path = `${user.id}/${Date.now()}-${file.name}`

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type || undefined })

    if (upErr) {
      return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 400 })
    }

    // 4. Insert dans la table documents avec le type
    const { error: insErr } = await sb
      .from("documents")
      .insert({
        user_id: user.id,
        application_id: app.id, // ✅ Lier au dossier
        nom: file.name,
        url: path,
        type_document: type, // ✅ Type de document
        statut: "en attente",
      })

    if (insErr) {
      return NextResponse.json({ error: `Insert failed: ${insErr.message}` }, { status: 500 })
    }

    // 5. Mettre à jour le statut du dossier à "en attente" s'il était "en cours"
    await sb
      .from("applications")
      .update({ statut: "en attente" })
      .eq("id", app.id)
      .eq("statut", "en cours")

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
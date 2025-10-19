// app/api/documents/submit-dossier/route.ts
import { NextResponse } from "next/server"
import { supabaseServerAction } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const sb = await supabaseServerAction()

    const { data: userData, error: userErr } = await sb.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = userData.user
    console.log("User ID:", user.id)

    // Fetch all documents
    const { data: docs, error: docsErr } = await sb
      .from("documents")
      .select("id, type_doc, sub_type, statut")
      .eq("user_id", user.id)

    if (docsErr) {
      console.error("FETCH ERROR:", docsErr)
      return NextResponse.json({ error: docsErr.message }, { status: 400 })
    }

    console.log("Documents found:", docs)

    if (!docs || docs.length === 0) {
      return NextResponse.json({ error: "Aucun document trouvé" }, { status: 400 })
    }

    // Check common requirements
    const hasPhotoId = docs?.some(d => d.type_doc === "photo_identite")
    const hasCv = docs?.some(d => d.type_doc === "cv")
    const hasPasseport = docs?.some(d => d.type_doc === "passeport")

    console.log("Checks:", { hasPhotoId, hasCv, hasPasseport })

    // Detect if terminale
    const isTerminale = docs?.some(d => d.type_doc === "releve_notes_terminale")
    
    let relevesComplete = false
    if (isTerminale) {
      const hasAttestationTerminale = docs?.some(d => d.sub_type === "attestation_terminale")
      const hasBulletin12 = docs?.some(d => d.sub_type === "bulletin_12eme")
      const hasBulletin11 = docs?.some(d => d.sub_type === "bulletin_11eme")
      relevesComplete = !!(hasAttestationTerminale && hasBulletin12 && hasBulletin11)
      console.log("Terminale checks:", { hasAttestationTerminale, hasBulletin12, hasBulletin11, relevesComplete })
    } else {
      const hasAttestation2025 = docs?.some(d => d.sub_type === "attestation_2025" || d.sub_type === "releve_2025")
      const hasBulletin2024 = docs?.some(d => d.sub_type === "releve_2024")
      const hasBulletin2023 = docs?.some(d => d.sub_type === "releve_2023")
      const hasBulletin2022 = docs?.some(d => d.sub_type === "releve_2022")
      relevesComplete = !!(hasAttestation2025 && hasBulletin2024 && hasBulletin2023 && hasBulletin2022)
      console.log("Post-Bac checks:", { hasAttestation2025, hasBulletin2024, hasBulletin2023, hasBulletin2022, relevesComplete })
    }

    const hasDiplomeBac = isTerminale ? true : docs?.some(d => d.type_doc === "diplome_bac")

    const isComplete = 
      hasPhotoId && 
      hasCv && 
      hasDiplomeBac && 
      hasPasseport && 
      relevesComplete

    console.log("Dossier complete?", isComplete)

    if (!isComplete) {
      return NextResponse.json({ 
        error: "Dossier incomplet",
        details: {
          hasPhotoId,
          hasCv,
          hasDiplomeBac,
          hasPasseport,
          relevesComplete,
          isTerminale
        }
      }, { status: 400 })
    }

    // Update all documents to "soumis"
    const { error: updateErr } = await sb
      .from("documents")
      .update({ statut: "soumis" })
      .eq("user_id", user.id)

    if (updateErr) {
      console.error("UPDATE ERROR:", updateErr)
      return NextResponse.json({ error: updateErr.message }, { status: 400 })
    }

    // Aussi mettre à jour la table applications avec le statut "en attente"
    const { error: appErr } = await sb
      .from("applications")
      .update({ statut: "en attente" })
      .eq("user_id", user.id)

    if (appErr) {
      console.error("APP UPDATE ERROR:", appErr)
    }

    console.log("SUCCESS: Documents updated to soumis")

    return NextResponse.json({ ok: true, message: "Dossier soumis avec succès" })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("CATCH ERROR:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
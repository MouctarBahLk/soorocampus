// app/api/documents/delete/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as { id?: string }
    if (!id) return NextResponse.json({ error: 'id manquant' }, { status: 400 })

    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const BUCKET = process.env.NEXT_PUBLIC_DOCS_BUCKET ?? 'documents'

    // Récupère le doc et vérifie la propriété
    const { data: doc, error: getErr } = await sb
      .from('documents')
      .select('id,user_id,url')
      .eq('id', id)
      .single()

    if (getErr || !doc) return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    if (doc.user_id !== user.id) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

    // Supprime le fichier du bucket (url = chemin interne)
    if (doc.url) {
      await sb.storage.from(BUCKET).remove([doc.url])
    }

    // Supprime la ligne en base
    const { error: delErr } = await sb.from('documents').delete().eq('id', id)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erreur serveur' }, { status: 500 })
  }
}

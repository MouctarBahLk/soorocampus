// app/api/debug-storage/route.ts
// ⚠️ FICHIER TEMPORAIRE DE DÉBOGAGE - À SUPPRIMER APRÈS

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const sb = await supabaseServer()
  
  try {
    // 1. Récupérer tous les documents de la BD
    const { data: documents, error: dbError } = await sb
      .from('documents')
      .select('id, nom, url, user_id')
      .order('created_at', { ascending: false })
    
    if (dbError) {
      return NextResponse.json({ error: 'Erreur BD', details: dbError }, { status: 500 })
    }

    // 2. Vérifier chaque document dans le storage
    const BUCKET = 'documents'
    const results = []

    for (const doc of documents || []) {
      console.log('🔍 Vérification doc:', doc.nom, 'URL:', doc.url)
      
      // Essayer de créer une URL signée
      const { data: signedData, error: signError } = await sb.storage
        .from(BUCKET)
        .createSignedUrl(doc.url, 60)
      
      // Vérifier si le fichier existe
      const { data: listData, error: listError } = await sb.storage
        .from(BUCKET)
        .list(doc.user_id, {
          limit: 100,
          offset: 0,
        })
      
      results.push({
        id: doc.id,
        nom: doc.nom,
        url_bd: doc.url,
        user_id: doc.user_id,
        signed_url_success: !signError,
        signed_error: signError?.message || null,
        files_in_user_folder: listData?.map(f => f.name) || [],
        list_error: listError?.message || null
      })
    }

    return NextResponse.json({
      message: 'Diagnostic des documents Storage',
      total_documents: documents?.length || 0,
      results
    })

  } catch (error: any) {
    console.error('❌ Erreur diagnostic:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
// app/api/documents/list/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const sb = await supabaseServer()
    
    const { data: { user }, error: authError } = await sb.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      )
    }

    console.log('User authenticated:', user.id)

    // Récupérer les documents
    const { data: docs, error: docsError } = await sb
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (docsError) {
      console.error('Documents error:', docsError)
      return NextResponse.json(
        { error: docsError.message }, 
        { status: 500 }
      )
    }

    console.log('Documents fetched:', docs?.length || 0)

    // Générer les liens signés
    const docsWithLinks = await Promise.all(
      (docs || []).map(async (doc) => {
        if (!doc.url) return { ...doc, link: null }

        try {
          const { data: signedUrl } = await sb.storage
            .from('documents')
            .createSignedUrl(doc.url, 3600)

          return {
            ...doc,
            link: signedUrl?.signedUrl || null
          }
        } catch (e) {
          console.error('Error generating link for', doc.url, e)
          return { ...doc, link: null }
        }
      })
    )

    return NextResponse.json({ 
      docs: docsWithLinks 
    })

  } catch (error) {
    console.error('GET /api/documents/list error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}
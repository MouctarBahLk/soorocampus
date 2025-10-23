import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function DELETE(request: NextRequest) {
  try {
    const sb = await supabaseServer()
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')
    const reason = searchParams.get('reason') || 'Document non conforme'

    if (!documentId) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    // Vérifier que c'est un admin
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: adminProfile } = await sb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Récupérer le document
    const { data: doc } = await sb
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (!doc) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }

    // Récupérer les infos de l'utilisateur
    const { data: profile } = await sb
      .from('profiles')
      .select('email, full_name')
      .eq('id', doc.user_id)
      .single()

    // Supprimer du storage si URL existe
    if (doc.url) {
      try {
        await sb.storage.from('documents').remove([doc.url])
      } catch (storageError) {
        console.error('Erreur suppression storage:', storageError)
      }
    }

    // Supprimer de la DB
    await sb.from('documents').delete().eq('id', documentId)

    // Envoyer un message automatique à l'étudiant
    await sb.from('support_messages').insert({
      user_id: doc.user_id,
      body: `⚠️ **Document supprimé par l'administration**\n\n**Document :** ${doc.nom || doc.type_doc}\n**Raison :** ${reason}\n\nMerci de déposer un nouveau document conforme.`,
      is_from_admin: true
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Document supprimé et utilisateur notifié' 
    })
  } catch (error: any) {
    console.error('Delete document error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
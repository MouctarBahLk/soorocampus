// app/api/documents/check-dossier/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const sb = await supabaseServer()
    
    const { data: { user }, error: authError } = await sb.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      )
    }

    // Récupérer l'application (peut ne pas exister)
    const { data: app } = await sb
      .from('applications')
      .select('status, is_terminale')
      .eq('user_id', user.id)
      .maybeSingle() // ← Important : ne plante pas si pas trouvé

    const isTerminale = app?.is_terminale ?? false

    // Récupérer les documents
    const { data: docs } = await sb
      .from('documents')
      .select('type_doc, sub_type')
      .eq('user_id', user.id)

    const types = (docs || []).map(d => d.type_doc)
    const subTypes = (docs || []).map(d => d.sub_type).filter(Boolean)

    // Vérifications
    const hasPhoto = types.includes('photo_identite')
    const hasCV = types.includes('cv')
    const hasPasseport = types.includes('passeport')

    let hasReleveNotes = false
    let hasDiplomeBac = false

    if (isTerminale) {
      const hasAttestation = subTypes.some(s => 
        s?.includes('attestation_terminale') || 
        s?.includes('attestation_2025')
      )
      const bulletinCount = subTypes.filter(s => 
        s?.includes('bulletin_')
      ).length
      
      hasReleveNotes = hasAttestation && bulletinCount >= 2
    } else {
      const releveCount = docs?.filter(d => 
        d.type_doc === 'releve_notes'
      ).length || 0
      
      hasReleveNotes = releveCount >= 3
      hasDiplomeBac = types.includes('diplome_bac')
    }

    const isComplete = isTerminale 
      ? (hasPhoto && hasCV && hasReleveNotes && hasPasseport)
      : (hasPhoto && hasCV && hasReleveNotes && hasDiplomeBac && hasPasseport)

    return NextResponse.json({
      isComplete,
      details: {
        photo_identite: hasPhoto,
        cv: hasCV,
        releve_notes: hasReleveNotes,
        diplome_bac: hasDiplomeBac,
        passeport: hasPasseport,
        isTerminale
      }
    })

  } catch (error) {
    console.error('GET /api/documents/check-dossier error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}
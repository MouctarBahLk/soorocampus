import { NextRequest, NextResponse } from 'next/server'
import { supabaseServerAction } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const sb = await supabaseServerAction()

    // Session courante
    const { data: { user } } = await sb.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérif admin
    const { data: profile } = await sb
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Accès refusé (is_admin=false)' }, { status: 403 })
    }

    // Body
    const { student_id, payment_status } = await req.json()
    if (!student_id || !payment_status) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }
    if (!['none', 'partial', 'full'].includes(payment_status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    // Update profil
    const { error: updateError } = await sb
      .from('profiles')
      .update({
        payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', student_id)

    if (updateError) {
      console.error('Erreur mise à jour:', updateError)
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
    }

    // Historique de paiement (optionnel)
    if (payment_status !== 'none') {
      await sb.from('payments').insert({
        user_id: student_id,
        amount: payment_status === 'partial' ? 750 : 1500, // adapte à ton pricing
        status: 'succeeded',
        method: 'manual_validation',
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: `Paiement ${payment_status} validé avec succès`,
    })
  } catch (e) {
    console.error('Erreur API:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

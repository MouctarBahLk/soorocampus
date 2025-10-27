import { NextResponse } from 'next/server'
import { supabaseServerAction } from '@/lib/supabase-server'

export async function GET() {
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

    // Liste étudiants
    const { data: students, error } = await sb
      .from('profiles')
      .select('id, email, full_name, payment_status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur récupération étudiants:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    return NextResponse.json({ students: students ?? [] })
  } catch (e) {
    console.error('Erreur API:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

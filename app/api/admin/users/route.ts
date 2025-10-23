import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const sb = await supabaseServer()
    
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

    // Récupérer tous les utilisateurs
    const { data: users } = await sb
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })

    return NextResponse.json({ users: users || [] })
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sb = await supabaseServer()
    const body = await request.json()
    const { action, userId, newRole } = body

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

    // === ACTION: CHANGER LE ROLE ===
    if (action === 'change_role') {
      // Récupérer l'utilisateur
      const { data: targetProfile } = await sb
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single()

      if (!targetProfile) {
        return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
      }

      // Mettre à jour dans auth.users via raw_user_meta_data
      const { data: authUsers } = await sb
        .from('auth.users')
        .select('id, raw_user_meta_data')
        .eq('id', userId)
        .single() as any

      if (authUsers) {
        const newMetadata = {
          ...(authUsers.raw_user_meta_data || {}),
          role: newRole
        }

        // Update via service role (tu dois utiliser le client service_role pour ça)
        // Pour l'instant, on met juste à jour profiles
      }

      // Mettre à jour dans profiles
      await sb
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      // Mettre à jour dans auth.users (nécessite service_role)
      // Tu dois créer un client Supabase avec service_role pour ça
      // Pour l'instant on met juste dans profiles

      return NextResponse.json({ success: true, message: `Rôle changé en ${newRole}` })
    }

    // === ACTION: SUPPRIMER UTILISATEUR ===
    if (action === 'delete_user') {
      // Supprimer d'abord les données liées
      await sb.from('documents').delete().eq('user_id', userId)
      await sb.from('applications').delete().eq('user_id', userId)
      await sb.from('support_messages').delete().eq('user_id', userId)
      await sb.from('payments').delete().eq('user_id', userId)
      
      // Supprimer le profil
      await sb.from('profiles').delete().eq('id', userId)

      // Pour supprimer de auth.users, il faut utiliser le service_role
      // Tu dois le faire manuellement ou créer un client service_role

      return NextResponse.json({ success: true, message: 'Utilisateur supprimé' })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
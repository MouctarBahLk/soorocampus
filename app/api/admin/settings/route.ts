// app/api/settings/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// GET - Récupérer tous les paramètres
export async function GET() {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Récupérer les paramètres généraux
    const { data: generalSettings } = await sb
      .from('settings')
      .select('value')
      .eq('key', 'general')
      .single()
    
    return NextResponse.json({ 
      settings: generalSettings?.value || {
        site_name: 'Sooro Campus',
        contact_email: 'contact@soorocampus.com',
        contact_phone: '+33 X XX XX XX XX'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT - Mettre à jour les paramètres généraux
export async function PUT(req: Request) {
  try {
    const sb = await supabaseServer()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    
    // Vérifier si admin
    const { data: profile } = await sb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }
    
    const { changes } = await req.json()
    
    // Récupérer les paramètres actuels
    const { data: current } = await sb
      .from('settings')
      .select('value')
      .eq('key', 'general')
      .single()
    
    // Fusionner avec les changements
    const newValue = { ...(current?.value || {}), ...changes }
    
    // Mettre à jour
    await sb
      .from('settings')
      .upsert({
        key: 'general',
        value: newValue,
        updated_at: new Date().toISOString()
      })
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
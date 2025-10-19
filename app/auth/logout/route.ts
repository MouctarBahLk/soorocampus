import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Déconnexion Supabase
  await supabase.auth.signOut()
  
  // Redirection vers la landing page
  return NextResponse.redirect(new URL('/', request.url))
}
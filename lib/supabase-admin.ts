// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server ONLY
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

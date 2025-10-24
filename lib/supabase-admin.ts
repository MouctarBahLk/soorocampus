// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

function must(name: string, v?: string) {
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

export const supabaseAdmin = () => {
  const url = must('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const serviceKey = must('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY) // server only
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

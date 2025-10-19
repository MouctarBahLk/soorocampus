// lib/settings.ts
import { supabaseServer } from '@/lib/supabase-server'

export async function getSetting<T = any>(key: string): Promise<T | undefined> {
  const sb = await supabaseServer()
  const { data } = await sb.from('settings').select('value').eq('key', key).maybeSingle()
  return data?.value?.v as T | undefined
}

export async function getSettings(keys: string[]) {
  const sb = await supabaseServer()
  const { data } = await sb.from('settings').select('key,value').in('key', keys)
  const out: Record<string, any> = {}
  for (const row of data ?? []) out[row.key] = row.value?.v
  return out
}

export async function setSetting(key: string, rawValue: any) {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  await sb.from('settings').upsert({
    key,
    value: { v: rawValue },
    updated_by: user?.id ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'key' })
}

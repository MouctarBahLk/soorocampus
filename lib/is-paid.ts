import { supabaseServer } from '@/lib/supabase-server'

/**
 * Retourne { paid, user }.
 * - Check un éventuel flag "is_premium" dans profiles (si tu l'as).
 * - Sinon check payments.status avec une liste tolérante de statuts.
 */
export async function isUserPaid() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return { paid: false, user: null }

  // 1) Flag direct (si présent dans ton schéma)
  const { data: profile } = await sb
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.is_premium) return { paid: true, user }

  // 2) Paiements (tolérant sur le statut)
  const { data: payments } = await sb
    .from('payments')
    .select('status')
    .eq('user_id', user.id)

  const OK_STATUSES = [
    'succeeded', 'paid', 'completed', 'complete',
    'success', 'succeeded_payment'
  ]

  const paid = !!payments?.some(p => {
    const s = String(p.status ?? '').toLowerCase()
    return OK_STATUSES.includes(s)
  })

  return { paid, user }
}

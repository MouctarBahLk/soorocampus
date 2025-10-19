// app/app/conseils/page.tsx
import { supabaseServer } from '@/lib/supabase-server'
import ConseilsGrid from './ConseilsGrid'

export default async function AppConseilsPage() {
  const sb = await supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  let paid = false
  if (user) {
    const { data: payments } = await sb
      .from('payments')
      .select('status')
      .eq('user_id', user.id)

    paid = !!payments?.some(p => p.status === 'succeeded')
  }

  return <ConseilsGrid initialPaid={paid} />
}

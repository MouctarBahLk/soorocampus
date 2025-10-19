'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const onLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button onClick={onLogout} className={className}>
      Se déconnecter
    </button>
  )
}

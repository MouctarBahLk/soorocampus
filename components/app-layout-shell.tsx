'use client'

import { usePathname } from 'next/navigation'
import AppSidebar from '@/components/app-sidebar'

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/app/admin')

  // Le layout admin occupe 100%: pas de sidebar.
  if (isAdmin) {
    return <>{children}</>
  }

  // IMPORTANT : structure identique SSR/Client.
  // Le wrapper sticky est toujours présent, avec "hidden md:block" géré en CSS (pas via JS).
  return (
    <div className="flex min-h-screen bg-[#EFF5FF]">
      {/* Colonne sidebar : on laisse un conteneur fixe et sticky */}
      <div className="hidden md:block sticky top-0 h-screen w-[22rem] shrink-0 z-40">
        <aside className="h-full">
          <AppSidebar />
        </aside>
      </div>

      {/* Contenu */}
      <main className="flex-1 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

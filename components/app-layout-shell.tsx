'use client'
import { usePathname } from 'next/navigation'
import AppSidebar from '@/components/app-sidebar'
import AdminSidebar from '@/components/admin-sidebar'

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/app/admin')

  return (
    <div className="flex min-h-screen bg-[#EFF5FF]">
      {/* Sidebar (toujours présente, gère elle-même desktop/mobile) */}
      {isAdmin ? <AdminSidebar /> : <AppSidebar />}

      {/* Contenu principal */}
      <main className="flex-1 bg-white w-full">
        {/* Padding top sur mobile pour laisser place au bouton hamburger */}
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
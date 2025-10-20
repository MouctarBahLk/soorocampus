'use client'
import { usePathname } from 'next/navigation'
import AppSidebar from '@/components/app-sidebar'

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/app/admin')

  // Si c'est admin, ne rien rendre ici car le layout admin gère tout
  if (isAdmin) {
    return <>{children}</>
  }

  // Sinon, afficher la sidebar étudiant
  return (
    <div className="flex min-h-screen bg-[#EFF5FF]">
      {/* Sidebar étudiant */}
      <AppSidebar />

      {/* Contenu principal */}
      <main className="flex-1 bg-white w-full">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
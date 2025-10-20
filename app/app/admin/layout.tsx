import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try { 
    await requireAdmin() 
  } catch { 
    redirect('/auth/login') 
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (gère elle-même desktop/mobile) */}
      <AdminSidebar />

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Padding top sur mobile pour le bouton hamburger */}
        <div className="px-4 md:px-6 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
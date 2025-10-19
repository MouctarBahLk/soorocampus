import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try { await requireAdmin() } catch { redirect('/auth/login') }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* plus de max-w ici */}
        <div className="px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

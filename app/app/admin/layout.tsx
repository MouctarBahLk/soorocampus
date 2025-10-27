import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin-sidebar'
import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, CheckCircle2 } from 'lucide-react'


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
<Link href="/app/admin/valider-paiements">
  <div className="p-6 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all cursor-pointer">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
        <DollarSign className="w-7 h-7 text-green-600" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-gray-900">Valider paiements</h3>
        <p className="text-sm text-gray-600">Via WhatsApp</p>
      </div>
    </div>
    <p className="text-sm text-gray-700">
      Validez manuellement les paiements reçus et débloquez l'accès aux étudiants
    </p>
  </div>
</Link>
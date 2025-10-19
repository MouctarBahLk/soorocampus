'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'
const ADMIN_BASE = '/app/admin'
const adminMenu = [
    { href: `${ADMIN_BASE}`, label: 'Tableau de bord', icon: LayoutDashboard },
    { href: `${ADMIN_BASE}/utilisateurs`, label: 'Utilisateurs', icon: Users },
    { href: `${ADMIN_BASE}/dossiers`, label: 'Dossiers', icon: FolderOpen },
    { href: `${ADMIN_BASE}/messages`, label: 'Messagerie', icon: MessageSquare },
    { href: `${ADMIN_BASE}/paiements`, label: 'Paiements', icon: CreditCard },
    { href: `${ADMIN_BASE}/parametres`, label: 'Paramètres', icon: Settings },
  ]

export default function AdminSidebar() {
  const pathname = usePathname()
  const SIDEBAR_BG = '#1e293b' // slate-800
  const ACTIVE_BG = '#0055FF' // bleu Sooro

  return (
    <aside
      className="flex h-screen w-[22rem] flex-col border-r shadow-lg"
      style={{ backgroundColor: SIDEBAR_BG }}
    >
      {/* Logo + Badge Admin */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
    
            <img src="/logo_sooro.png" alt="Sooro Campus" className="h-10" />
          <div>
            <p className="text-white font-bold text-lg">Sooro Campus</p>
            <p className="text-xs text-gray-400">Administration</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="mx-auto w-full max-w-[260px] px-2 flex flex-col items-stretch space-y-2">
          {adminMenu.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer avec Déconnexion */}
      <div className="border-t border-white/10 p-6">
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-3 text-sm font-semibold transition shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          © 2025 Sooro Campus Admin
        </p>
      </div>
    </aside>
  )
}
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false)

  const SIDEBAR_BG = '#1e293b'

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/logo_sooro.png" alt="Sooro Campus" className="h-10" />
          <div>
            <p className="text-white font-bold text-lg">Sooro Campus</p>
            <p className="text-xs text-gray-400">Administration</p>
          </div>
        </div>
        <button
          onClick={closeMenu}
          className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <div className="mx-auto w-full max-w-[260px] px-2 flex flex-col items-stretch space-y-2">
          {adminMenu.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== ADMIN_BASE && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
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
    </>
  )

  return (
    <>
      {/* BOUTON HAMBURGER MOBILE */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-slate-800 text-white shadow-xl hover:bg-slate-700 transition-all active:scale-95"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside
        className="hidden md:flex h-screen w-[22rem] flex-col border-r shadow-lg sticky top-0"
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-screen w-[85vw] max-w-[320px] z-50 flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
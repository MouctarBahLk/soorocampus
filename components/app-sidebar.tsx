'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Folder,
  CreditCard,
  GraduationCap,
  MessageSquare,
  User,
  LogOut,
  School,
} from 'lucide-react'

// ✅ Menu principal (étudiant)
const menu = [
  { href: '/app/tableau-de-bord', label: 'Accueil', icon: Home },
  { href: '/app/mon-dossier', label: 'Mon dossier', icon: Folder },
  { href: '/app/paiements', label: 'Paiement', icon: CreditCard },
  { href: '/app/conseils', label: 'Conseils', icon: GraduationCap },
  { href: '/app/messages', label: 'Messagerie', icon: MessageSquare },
  { href: '/app/profil', label: 'Profil', icon: User },
]

export default function AppSidebar() {
  const pathname = usePathname()

  const SIDEBAR_BG = '#1e293b' // bleu nuit / slate-800
  const ACTIVE_BG = '#0055FF' // bleu Sooro
  const HOVER_BG = 'rgba(255,255,255,0.1)' // léger survol

  return (
    <aside
      className="flex h-screen w-[22rem] flex-col border-r shadow-lg"
      style={{ backgroundColor: SIDEBAR_BG }}
    >
      {/* --- Logo + titre --- */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
      <div className="flex items-center gap-3">
        <img src="/logo_sooro.png" alt="Sooro Campus" className="h-10" />
        <div>
          <p className="text-white font-bold text-lg">Sooro Campus</p>
          <p className="text-xs text-gray-400">Espace étudiant</p>
        </div>
      </div>
    </div>

      {/* --- Menu --- */}
      <nav className="flex-1 overflow-y-auto py-6">
        <div className="mx-auto w-full max-w-[260px] px-2 flex flex-col items-stretch space-y-2">
          {menu.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* --- Déconnexion --- */}
      <div className="border-t border-white/10 p-6">
        <form
          action="/auth/logout"
          method="post"
          onSubmit={(e) => {
            const ok = confirm("Voulez-vous vraiment vous déconnecter ?")
            if (!ok) e.preventDefault()
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-3 text-sm font-semibold transition shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          © 2025 Sooro Campus
        </p>
      </div>
    </aside>
  )
}

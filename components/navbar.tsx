'use client'

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <img src="/logo-sooro.svg" alt="Sooro Campus" className="h-8 w-8" />
          <span className="text-gray-900 group-hover:opacity-90">Sooro Campus</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">Accueil</Link>
          <Link href="/conseils" className="text-sm text-gray-700 hover:text-gray-900">Conseils gratuits</Link>
          <Link href="/a-propos" className="text-sm text-gray-700 hover:text-gray-900">À propos</Link>
          <Link href="/contact" className="text-sm text-gray-700 hover:text-gray-900">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/auth/register"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            S’inscrire gratuitement
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 md:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-gray-200 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            <Link href="/" className="rounded-md px-2 py-2 text-gray-700 hover:bg-gray-50">Accueil</Link>
            <Link href="/conseils" className="rounded-md px-2 py-2 text-gray-700 hover:bg-gray-50">Conseils gratuits</Link>
            <Link href="/a-propos" className="rounded-md px-2 py-2 text-gray-700 hover:bg-gray-50">À propos</Link>
            <Link href="/contact" className="rounded-md px-2 py-2 text-gray-700 hover:bg-gray-50">Contact</Link>
            <Link
              href="/auth/register"
              className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
            >
              S’inscrire gratuitement
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function NavPublic() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo_sooro.png"
              alt="Sooro Campus"
              className="h-14 w-14 rounded-full object-cover"
            />
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Sooro Campus
            </span>
          </Link>


          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-600 hover:text-blue-700 font-medium transition">Services</a>
            <a href="/#resources" className="text-gray-600 hover:text-blue-700 font-medium transition">Articles & ressources</a>
            <a href="/#how-it-works" className="text-gray-600 hover:text-blue-700 font-medium transition">Comment ça marche</a>
            <a href="/#pricing" className="text-gray-600 hover:text-blue-700 font-medium transition">Tarifs</a>
            <Link
                href="/aide-inscription"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                aide 
              </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-blue-700 font-medium transition">Connexion</Link>
            <Link href="/auth/register" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-700/30">
              S'inscrire gratuitement
            </Link>
          </div>

          {/* Mobile button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 space-y-3">
            <a href="/#features" className="block text-gray-600 hover:text-blue-700 font-medium">Services</a>
            <a href="/#resources" className="block text-gray-600 hover:text-blue-700 font-medium">Articles & ressources</a>
            <a href="/#how-it-works" className="block text-gray-600 hover:text-blue-700 font-medium">Comment ça marche</a>
            <a href="/#pricing" className="block text-gray-600 hover:text-blue-700 font-medium">Tarifs</a>
            <Link href="/auth/login" className="block text-gray-600 hover:text-blue-700 font-medium">Connexion</Link>
            <Link href="/auth/register" className="block bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold text-center">S'inscrire</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

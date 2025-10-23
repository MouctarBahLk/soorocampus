'use client'
import React from 'react'
import Link from 'next/link'

export default function FooterPublic() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo_sooro.png" alt="Sooro Campus" className="h-14 w-14 rounded-full object-cover" />
              <span className="ml-3 text-lg font-bold text-white tracking-wide">Sooro Campus</span>
            </div>
            <p className="text-sm">Ta plateforme de confiance pour réussir ton projet Campus France.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#features" className="hover:text-white transition">Services</a></li>
              <li><a href="/#resources" className="hover:text-white transition">Articles & ressources</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition">Comment ça marche</a></li>
              <li><a href="/#pricing" className="hover:text-white transition">Tarifs</a></li>

              <li><Link
                href="/aide-inscription"
                className="hover:text-white transition"
              >
                aide pour t’inscrire ?
              </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/conditions" className="hover:text-white transition">Conditions d'utilisation</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition">Politique de confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>contact@soorocampus.com</li>
              <li>+33 7 44 28 98 10</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 Sooro Campus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

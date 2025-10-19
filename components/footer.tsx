import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Sooro Campus. Tous droits réservés.</p>
        <nav className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/mentions-legales" className="hover:text-gray-700">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-gray-700">Confidentialité</Link>
          <Link href="/contact" className="hover:text-gray-700">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function SupportForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ body: message.trim() })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(`Erreur: ${data?.error || 'Impossible d’envoyer le message'}`)
      } else {
        setMessage('')
        alert('Message envoyé au support ✅')
      }
    } catch {
      alert('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Décris ton problème</label>
      <textarea
        className="w-full min-h-[120px] border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        placeholder="Explique ton souci (paiement, message, document, etc.)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 rounded-xl">
          {loading ? 'Envoi…' : 'Envoyer au support'}
        </Button>

        <Link
          href="mailto:support@sooro-campus.com?subject=Support%20Sooro%20Campus"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Envoyer un email
        </Link>
      </div>
    </form>
  )
}

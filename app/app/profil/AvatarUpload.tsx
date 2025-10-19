'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {
  avatarUrl: string | null
  hasAvatar: boolean
}

export default function AvatarUpload({ avatarUrl, hasAvatar }: Props) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  async function onUpload(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!file) return

    const fd = new FormData()
    fd.append('avatar', file)

    setLoading(true)
    const res = await fetch('/api/profile/upload-avatar', { method: 'POST', body: fd, credentials: 'include' })
    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({} as any))
      setError(data?.error || 'Erreur upload')
      return
    }
    setFile(null)
    router.refresh()
  }

  async function onRemove() {
    setError(null)
    setRemoving(true)
    const res = await fetch('/api/profile/remove-avatar', { method: 'POST', credentials: 'include' })
    setRemoving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({} as any))
      setError(data?.error || 'Erreur suppression')
      return
    }
    router.refresh()
  }

  return (
    <div className="w-full flex flex-col items-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 mb-3"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 mb-3" />
      )}

      <form onSubmit={onUpload} className="flex w-full items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Button type="submit" disabled={loading || !file} className="rounded-xl bg-blue-700 hover:bg-blue-800">
          {loading ? 'En cours…' : 'Mettre à jour'}
        </Button>
      </form>

      {hasAvatar && (
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={removing}
          className="mt-2 rounded-xl"
        >
          {removing ? 'Suppression…' : 'Supprimer la photo'}
        </Button>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

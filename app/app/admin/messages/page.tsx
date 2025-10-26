'use client'

import { useEffect, useMemo, useRef, useState, FormEvent, KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Send,
  Search,
  User,
  MessageSquare,
  Loader2,
  Image as ImageIcon,
  Smile,
  X,
} from 'lucide-react'

type Message = {
  id: string
  body: string
  created_at: string
  user_id: string
  is_from_admin?: boolean
  image_url?: string
}

type Conversation = {
  user_id: string
  user_email: string
  user_name?: string
  last_message: string
  unread: number
}

const EMOJI_GROUPS = [
  {
    title: '😀 Visages',
    list: ['😀', '😁', '😂', '🤣', '😊', '😍', '😎', '🤔', '😅', '😭', '😡'],
  },
  {
    title: '👏 Gestes',
    list: ['👍', '👎', '🙏', '👏', '💪', '👌', '✌️', '🤝'],
  },
  {
    title: '💬 Divers',
    list: ['🎉', '🔥', '❤️', '💯', '⭐', '✅', '📎', '🇫🇷', '🎓'],
  },
]

function formatTs(ts: string) {
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminMessagesPage() {
  const searchParams = useSearchParams()
  const userParam = searchParams.get('user')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [convLoading, setConvLoading] = useState(false)
  const [convError, setConvError] = useState<string | null>(null)

  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [msgsLoading, setMsgsLoading] = useState(false)
  const [msgsError, setMsgsError] = useState<string | null>(null)

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const [showEmoji, setShowEmoji] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ================= Conversations =================
  async function fetchConversations() {
    setConvLoading(true)
    setConvError(null)
    try {
      const res = await fetch('/api/admin/messages', { credentials: 'include' })
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur de chargement')
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (e: any) {
      setConvError(e?.message || 'Erreur inconnue')
    } finally {
      setConvLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
    const id = setInterval(fetchConversations, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (userParam && conversations.length > 0 && !selectedUser) {
      loadMessages(userParam)
    }
  }, [userParam, conversations.length])

  const filteredConversations = useMemo(() => {
    if (!q.trim()) return conversations
    const term = q.toLowerCase()
    return conversations.filter(
      (c) =>
        (c.user_name || '').toLowerCase().includes(term) ||
        c.user_email.toLowerCase().includes(term) ||
        c.last_message.toLowerCase().includes(term)
    )
  }, [q, conversations])

  // ================= Messages =================
  async function loadMessages(userId: string) {
    setSelectedUser(userId)
    setMsgsLoading(true)
    setMsgsError(null)
    try {
      const res = await fetch(`/api/admin/messages?user_id=${encodeURIComponent(userId)}`, { credentials: 'include' })
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur de chargement du fil')
      const data = await res.json()
      setMessages(data.messages || [])
      fetchConversations()
    } catch (e: any) {
      setMsgsError(e?.message || 'Erreur inconnue')
    } finally {
      setMsgsLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // ================= Upload =================
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image trop grande (max 5MB).')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addEmoji = (emoji: string) => {
    setText((prev) => prev + emoji)
    setShowEmoji(false)
  }

  // ================= Envoi =================
  async function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!selectedUser || (!text.trim() && !selectedImage)) return

    setSending(true)
    try {
      let image_path: string | null = null
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        const uploadRes = await fetch('/api/upload-message-image', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
        const uploadData = await uploadRes.json()
        if (uploadRes.ok) image_path = uploadData.path
      }

      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser, body: text.trim() || '📎 Image', image_path }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Envoi impossible')

      setText('')
      removeImage()
      await loadMessages(selectedUser)
    } catch (e: any) {
      alert(e?.message || 'Erreur envoi message')
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e as any)
    }
  }

  // ================= UI =================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
      {/* --- Liste de conversations --- */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 rounded-xl"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {convLoading && (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Chargement…
            </div>
          )}

          {!convLoading && filteredConversations.length === 0 && (
            <p className="text-gray-500 text-sm">Aucune conversation.</p>
          )}

          <div className="space-y-2">
            {filteredConversations.map((c) => {
              const active = selectedUser === c.user_id
              const initial = (c.user_name?.[0] || c.user_email?.[0] || '?').toUpperCase()
              return (
                <button
                  key={c.user_id}
                  onClick={() => loadMessages(c.user_id)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-600 text-white">{initial}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{c.user_name || c.user_email}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{c.last_message}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* --- Fil de discussion --- */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {selectedUser ? 'Fil de discussion' : 'Sélectionner une conversation'}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {msgsLoading && (
              <div className="flex items-center justify-center py-6 text-gray-500">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Chargement…
              </div>
            )}

            {messages.map((m) => {
              const mine = !!m.is_from_admin
              return (
                <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {m.image_url && (
                      <img
                        src={m.image_url}
                        alt="Image"
                        className="mb-2 w-full max-w-xs md:max-w-sm rounded-lg cursor-pointer object-contain"
                        onClick={() => window.open(m.image_url!, '_blank')}
                      />
                    )}
                    {m.body}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">{formatTs(m.created_at)}</div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* --- Prévisualisation image --- */}
          {imagePreview && (
            <div className="mb-2 relative inline-block">
              <img src={imagePreview} alt="Prévisualisation" className="max-h-32 rounded-lg border" />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* --- Formulaire d’envoi --- */}
          <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2 flex-wrap">
            {/* Upload image */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="admin-image-upload"
              />
              <label
                htmlFor="admin-image-upload"
                className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg border cursor-pointer"
                title="Joindre une image"
              >
                <ImageIcon className="w-5 h-5 text-slate-600" />
              </label>
            </div>

            {/* Emoji picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg border"
                title="Ajouter un emoji"
              >
                <Smile className="w-5 h-5 text-slate-600" />
              </button>

              {showEmoji && (
                <div className="absolute bottom-12 left-0 bg-white border rounded-2xl shadow-xl p-3 w-64 md:w-72 z-10">
                  {EMOJI_GROUPS.map((group) => (
                    <div key={group.title} className="mb-2">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{group.title}</p>
                      <div className="grid grid-cols-7 gap-1">
                        {group.list.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => addEmoji(emoji)}
                            className="text-xl hover:bg-blue-50 rounded-md p-1 transition"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Zone de texte */}
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={selectedUser ? 'Écrire un message…' : 'Choisissez une conversation'}
              disabled={!selectedUser || sending}
              className="flex-1 rounded-xl"
            />

            {/* Bouton envoyer */}
            <Button
              type="submit"
              disabled={!selectedUser || sending || (!text.trim() && !selectedImage)}
              className="rounded-xl"
            >
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Envoyer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

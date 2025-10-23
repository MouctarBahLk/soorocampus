'use client'

import { useEffect, useMemo, useRef, useState, FormEvent, KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Search, User, MessageSquare, Loader2 } from 'lucide-react'

type Message = {
  id: string
  body: string
  created_at: string
  user_id: string
  is_from_admin?: boolean
}

type Conversation = {
  user_id: string
  user_email: string
  user_name?: string
  last_message: string
  unread: number
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

  const [q, setQ] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // ===== Conversations =====
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

  // Auto-ouvrir la conversation si ?user=xxx dans l'URL
  useEffect(() => {
    if (userParam && conversations.length > 0 && !selectedUser) {
      loadMessages(userParam)
    }
  }, [userParam, conversations.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredConversations = useMemo(() => {
    if (!q.trim()) return conversations
    const term = q.toLowerCase()
    return conversations.filter(c =>
      (c.user_name || '').toLowerCase().includes(term) ||
      c.user_email.toLowerCase().includes(term) ||
      c.last_message.toLowerCase().includes(term)
    )
  }, [q, conversations])

  // ===== Messages (fil) =====
  async function loadMessages(userId: string) {
    setSelectedUser(userId)
    setMsgsLoading(true)
    setMsgsError(null)
    try {
      const res = await fetch(`/api/admin/messages?user_id=${encodeURIComponent(userId)}`, { credentials: 'include' })
      if (!res.ok) throw new Error((await res.json()).error || 'Erreur de chargement du fil')
      const data = await res.json()
      setMessages(data.messages || [])
      // On rafraîchit la liste pour mettre à jour le compteur "unread"
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

  // ===== Envoi message =====
  async function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() || !selectedUser) return
    const body = text.trim()

    setSending(true)
    try {
      // Optimistic UI
      const tempId = `temp-${Date.now()}`
      setMessages(prev => [
        ...prev,
        {
          id: tempId,
          body,
          created_at: new Date().toISOString(),
          user_id: selectedUser,
          is_from_admin: true,
        },
      ])
      setText('')

      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser, body }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Envoi impossible')
      }

      // Recharge le fil (pour avoir l’ID réel, etc.)
      await loadMessages(selectedUser)
    } catch (e: any) {
      // Annule l'optimistic UI en cas d'erreur
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')))
      setMsgsError(e?.message || 'Erreur inconnue')
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
     
      sendMessage(e as FormEvent)
    }
  }

  // ===== Rendu =====
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne gauche : conversations */}
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
              onChange={e => setQ(e.target.value)}
            />
          </div>

          {convLoading && (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Chargement…
            </div>
          )}

          {convError && (
            <p className="text-red-600 text-sm mb-2">{convError}</p>
          )}

          {!convLoading && filteredConversations.length === 0 && (
            <p className="text-gray-500 text-sm">Aucune conversation.</p>
          )}

          <div className="space-y-2">
            {filteredConversations.map((c) => {
              const initial =
                (c.user_name?.[0] || c.user_email?.[0] || '?').toUpperCase()
              const active = selectedUser === c.user_id
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
                      <AvatarFallback className="bg-blue-600 text-white">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {c.user_name || c.user_email}
                        </span>
                        {c.unread > 0 && (
                          <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {c.last_message}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Colonne droite : fil */}
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {selectedUser ? 'Fil de discussion' : 'Sélectionner une conversation'}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[70vh]">
          {/* zone messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {msgsLoading && (
              <div className="flex items-center justify-center py-6 text-gray-500">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Chargement…
              </div>
            )}

            {msgsError && (
              <p className="text-red-600 text-sm mb-2">{msgsError}</p>
            )}

            {!msgsLoading && selectedUser && messages.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun message pour le moment.</p>
            )}

            {messages.map((m) => {
              const mine = !!m.is_from_admin
              return (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    mine
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'mr-auto bg-gray-100 text-gray-900'
                  }`}
                  title={new Date(m.created_at).toLocaleString('fr-FR')}
                >
                  {m.body}
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* zone saisie */}
          <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={selectedUser ? 'Écrire un message…' : 'Choisis une conversation pour répondre'}
              disabled={!selectedUser || sending}
              className="rounded-xl"
            />
            <Button
              type="submit"
              disabled={!selectedUser || sending || !text.trim()}
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

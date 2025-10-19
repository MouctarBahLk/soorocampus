'use client'

import { useEffect, useMemo, useRef, useState, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    // (optionnel) rafraîchissement périodique des conversations
    const id = setInterval(fetchConversations, 30_000)
    return () => clearInterval(id)
  }, [])

  // Recherche côté client (simple)
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
      // on rafraîchit aussi la liste pour mettre à jour le dernier message si besoin
      fetchConversations()
    } catch (e: any) {
      setMsgsError(e?.message || 'Erreur inconnue')
    } finally {
      setMsgsLoading(false)
      // scroll en bas après chargement
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }

  // Auto-scroll en bas quand les messages changent
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // ===== Envoi message admin → étudiant =====
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
        // rollback si erreur
        setMessages(prev => prev.filter(m => m.id !== tempId))
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Envoi échoué')
      }

      const data = await res.json()
      // remplace le temp par la vraie ligne
      setMessages(prev => prev.map(m => m.id === tempId ? data.message : m))
      // met à jour la liste de conversations (dernier message)
      fetchConversations()
    } catch (e: any) {
      // feedback minimal
      alert(e?.message || 'Erreur lors de l’envoi')
    } finally {
      setSending(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }

  const selectedConv = conversations.find(c => c.user_id === selectedUser)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="text-gray-600 mt-1">Communique avec les étudiants</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-250px)]">
        {/* Liste des conversations */}
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 rounded-xl"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            {convLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
              </div>
            ) : convError ? (
              <p className="text-sm text-red-600">{convError}</p>
            ) : filteredConversations.length === 0 ? (
              <p className="text-sm text-gray-500 px-2">Aucune conversation</p>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.user_id}
                    onClick={() => loadMessages(conv.user_id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition
                      ${selectedUser === conv.user_id 
                        ? 'bg-blue-50 border-2 border-blue-600' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                      }
                    `}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                        {conv.user_name?.[0] || conv.user_email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{conv.user_name || conv.user_email}</p>
                        {conv.unread > 0 && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <Card className="flex flex-col">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                      {selectedConv?.user_name?.[0] || selectedConv?.user_email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedConv?.user_name || selectedConv?.user_email}</p>
                    <p className="text-xs text-gray-500">{selectedConv?.user_email}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {msgsLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
                  </div>
                ) : msgsError ? (
                  <p className="text-sm text-red-600">{msgsError}</p>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-600">Aucun message dans cette conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.is_from_admin ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={msg.is_from_admin ? 'bg-blue-600 text-white' : 'bg-gray-200'}>
                            {msg.is_from_admin ? 'A' : 'E'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[70%] ${msg.is_from_admin ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-4 py-3 rounded-2xl ${
                            msg.is_from_admin 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-2">
                            {new Date(msg.created_at).toLocaleString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </>
                )}
              </CardContent>

              <div className="border-t p-4">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Écris ta réponse..."
                    className="flex-1 rounded-xl"
                    disabled={sending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (text.trim()) void sendMessage(e as any)
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl min-w-24"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <User className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sélectionne une conversation
              </h3>
              <p className="text-sm text-gray-500">
                Choisis un étudiant dans la liste pour voir les messages
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

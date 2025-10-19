'use client'
import { useEffect, useState, FormEvent, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare, User, Clock } from 'lucide-react'

type Msg = { 
  id: string
  body: string
  created_at: string
  is_from_admin?: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    const res = await fetch('/api/messages')
    if (res.ok) {
      const j = await res.json()
      setMessages(j.messages)
    }
  }

  useEffect(() => { 
    load()
    // Auto-scroll vers le bas
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    
    setLoading(true)
    const res = await fetch('/api/messages', { 
      method: 'POST', 
      body: JSON.stringify({ body: text }) 
    })
    
    if (res.ok) { 
      setText('')
      await load()
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="text-gray-600 mt-1">Communique avec l'équipe Sooro Campus</p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-250px)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-700" />
            Conversation avec l'équipe
          </CardTitle>
        </CardHeader>

        {/* Zone de messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {!messages.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Aucun message pour le moment</p>
              <p className="text-sm text-gray-500 mt-1">Commence la conversation avec notre équipe</p>
            </div>
          ) : (
            <>
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.is_from_admin ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.is_from_admin ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {m.is_from_admin ? (
                      <MessageSquare className="h-5 w-5 text-blue-700" />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`flex flex-col max-w-[70%] ${m.is_from_admin ? 'items-start' : 'items-end'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      m.is_from_admin 
                        ? 'bg-blue-50 text-gray-900' 
                        : 'bg-blue-700 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{m.body}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(m.created_at).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </CardContent>

        {/* Zone de saisie */}
        <div className="border-t p-4">
          <form onSubmit={onSubmit} className="flex gap-3">
            <input
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Écris ton message..."
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!text.trim() || loading}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
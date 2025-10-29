// app/app/messages/page.tsx
'use client'

import { useEffect, useState, FormEvent, useRef } from 'react'
import { Send, MessageSquare, Clock, Image as ImageIcon, Smile, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Msg = {
  id: string
  body: string
  created_at: string
  is_from_admin?: boolean
  image_url?: string
}

const EMOJI_GROUPS = [
  { title: '😀 Visages', list: ['😀','😁','😂','🤣','😊','😍','😎','🤔','😅','😭','😡'] },
  { title: '👏 Gestes',  list: ['👍','👎','🙏','👏','💪','👌','✌️','🤝'] },
  { title: '💬 Divers',  list: ['🎉','🔥','❤️','💯','⭐','✅','📎','🇫🇷','🎓'] },
]

export default function MessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const res = await fetch('/api/messages')
    if (res.ok) {
      const j = await res.json()
      setMessages(j.messages)
    }
  }

  useEffect(() => {
    load()
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("L'image est trop grande. Maximum 5MB."); return }
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji)
    setShowEmoji(false)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() && !selectedImage) return
    setLoading(true)
    try {
      let imagePath: string | null = null
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        const uploadRes = await fetch('/api/upload-message-image', { method: 'POST', body: formData })
        if (!uploadRes.ok) {
          const j = await uploadRes.json().catch(() => ({}))
          throw new Error(j.error || 'Upload échoué')
        }
        const uploadData = await uploadRes.json()
        imagePath = uploadData.path
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text.trim() || '📎 Image', image_path: imagePath })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Envoi échoué')
      }

      setText('')
      removeImage()
      await load()
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      console.error('Erreur envoi message:', err)
      alert("Erreur lors de l'envoi. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      {/* Header léger */}
      <div className="px-4 pt-6 pb-3 sm:px-6">
        <h1 className="text-[28px] leading-tight sm:text-3xl font-bold text-gray-900">Messagerie <span className="align-middle">💬</span></h1>
        <p className="text-sm text-gray-500 mt-1">Communiquez avec l'équipe Sooro Campus</p>
      </div>

      {/* Conversation */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-6 pb-2 sm:pb-4">
        <div className="flex h-full flex-col rounded-2xl ring-1 ring-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          {/* Titre fin */}
          <div className="sticky top-0 z-10 px-4 py-3 border-b border-slate-200/70 bg-white/70 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600/90 text-white grid place-items-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900">Conversation avec l'équipe</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 scroll-smooth">
            {!messages.length ? (
              <div className="h-full grid place-items-center text-center text-gray-500">
                <div>
                  <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 grid place-items-center mb-3">
                    <MessageSquare className="w-7 h-7 text-blue-600" />
                  </div>
                  <p className="font-medium text-gray-800">Aucun message pour le moment</p>
                  <p className="text-sm mt-1">Démarrez la conversation</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(m => {
                  const mine = !m.is_from_admin
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[82%] sm:max-w-[70%]">
                        <div className={`rounded-2xl px-3.5 py-2.5 shadow-sm break-words
                          ${mine ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 ring-1 ring-slate-200'}`}>
                          {m.image_url && (
                            <img
                              src={m.image_url}
                              alt="Image partagée"
                              className="w-full max-w-[78vw] sm:max-w-xs md:max-w-sm max-h-80 object-contain rounded-lg mb-2"
                              onClick={() => window.open(m.image_url!, '_blank')}
                            />
                          )}
                          {m.body && (
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.body}</p>
                          )}
                        </div>
                        <div className={`mt-1 flex items-center gap-1 ${mine ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-[11px] text-gray-500">
                            {new Date(m.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Composer sticky */}
          {imagePreview && (
            <div className="px-3 sm:px-5 pb-1">
              <div className="mb-2 inline-block relative">
                <img src={imagePreview} alt="Aperçu" className="max-h-28 rounded-xl ring-1 ring-blue-200" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
                  aria-label="Retirer l'image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur px-2.5 sm:px-4 py-2
                       pb-[max(env(safe-area-inset-bottom),0.5rem)]"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-md">
              {/* image */}
              <div className="relative shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200">
                  <ImageIcon className="w-5 h-5 text-slate-700" />
                </label>
              </div>

              {/* emojis */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEmoji(v => !v)}
                  className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200"
                  aria-expanded={showEmoji}
                  title="Emojis"
                >
                  <Smile className="w-5 h-5 text-slate-700" />
                </button>
                {showEmoji && (
                  <div className="absolute bottom-12 right-0 z-10 w-72 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl p-2">
                    {EMOJI_GROUPS.map((g) => (
                      <div key={g.title} className="mb-1.5 last:mb-0">
                        <p className="text-[11px] tracking-wide text-gray-500 mb-1 px-1">{g.title}</p>
                        <div className="grid grid-cols-8 gap-1">
                          {g.list.map(e => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => addEmoji(e)}
                              className="text-xl hover:bg-blue-50 rounded-md p-1"
                              aria-label={`Ajouter ${e}`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* input */}
              <input
                className="flex-1 min-w-0 rounded-xl border border-slate-200 px-3 py-2
                           text-[16px] leading-6 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Écrivez votre message…"
                disabled={loading}
              />

              {/* envoyer */}
              <Button
                type="submit"
                disabled={(!text.trim() && !selectedImage) || loading}
                className="shrink-0 grid place-items-center rounded-xl w-11 h-11
                           bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <p className="mt-2 text-[11px] text-center text-gray-500">
              JPG, PNG, GIF, WEBP (max 5MB) • Emojis par catégories
            </p>
          </form>
        </div>
        {/* Encadré conseil */}
        <div className="mx-auto max-w-3xl mt-6 rounded-2xl ring-1 ring-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 grid place-items-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">💡 Conseil</p>
              <p className="text-sm text-gray-700">
                Notre équipe répond généralement sous <strong>8h</strong>. WhatsApp : <strong>+224 626 69 98 39</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

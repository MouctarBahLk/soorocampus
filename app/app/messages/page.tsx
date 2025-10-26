'use client'
import { useEffect, useState, FormEvent, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare, User, Clock, Sparkles, Image as ImageIcon, Smile, X } from 'lucide-react'

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
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert("L'image est trop grande. Maximum 5MB."); return }
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
    setText(prev => prev + emoji)
    setShowEmoji(false)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim() && !selectedImage) return
    setLoading(true)
    try {
      // 1) Upload image → récupérer le PATH
      let imagePath: string | null = null
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        const uploadRes = await fetch('/api/upload-message-image', { method: 'POST', body: formData })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imagePath = uploadData.path // chemin à stocker
        } else {
          const j = await uploadRes.json().catch(() => ({}))
          throw new Error(j.error || 'Upload échoué')
        }
      }

      // 2) Envoyer le message avec image_path
      const res = await fetch('/api/messages', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          body: text.trim() || '📎 Image',
          image_path: imagePath
        }) 
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">Messagerie 💬</h1>
          <p className="text-base sm:text-xl text-gray-600">Communiquez avec l'équipe Sooro Campus</p>
        </div>

        {/* Card principale */}
        <Card className="flex flex-col h-[calc(100vh-260px)] sm:h-[calc(100vh-300px)] border-2 border-blue-200 shadow-2xl">
          <CardHeader className="border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl">Conversation avec l'équipe</span>
            </CardTitle>
          </CardHeader>

          {/* Zone de messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-slate-50 to-white scroll-smooth">
            {!messages.length ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <p className="text-gray-900 font-bold text-lg sm:text-xl mb-1 sm:mb-2">Aucun message pour le moment</p>
                <p className="text-gray-600">Commencez la conversation avec notre équipe</p>
              </div>
            ) : (
              <>
                {messages.map(m => (
                  <div key={m.id} className={`flex gap-3 ${m.is_from_admin ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      m.is_from_admin ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'
                    }`}>
                      {m.is_from_admin ? <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> : <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
                    </div>

                    {/* Message bubble */}
                    <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${m.is_from_admin ? 'items-start' : 'items-end'}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-md break-words ${
                        m.is_from_admin ? 'bg-white border-2 border-blue-100 text-gray-900' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      }`}>
                        {m.image_url && (
                          <img
                            src={m.image_url}
                            alt="Image partagée"
                            className="w-full max-w-xs md:max-w-sm lg:max-w-md max-h-80 object-contain rounded-lg mb-2 cursor-pointer hover:opacity-90 transition"
                            onClick={() => window.open(m.image_url!, '_blank')}
                          />
                        )}
                        {m.body && <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{m.body}</p>}
                      </div>
                      <div className="flex items-center gap-1 mt-2 px-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(m.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
          <div className="border-t-2 border-slate-200 p-4 sm:p-5 bg-white">
            {/* Prévisualisation image */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Aperçu" className="max-h-32 rounded-lg border-2 border-blue-200" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition"
                  aria-label="Retirer l'image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={onSubmit} className="flex items-stretch gap-2 sm:gap-3">
              {/* Bouton Image */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition border-2 border-slate-200"
                  title="Joindre une image"
                >
                  <ImageIcon className="w-5 h-5 text-slate-600" />
                </label>
              </div>

              {/* Bouton Emoji + picker organisé */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmoji(v => !v)}
                  className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-slate-100 hover:bg-slate-200 rounded-xl transition border-2 border-slate-200"
                  title="Ajouter un emoji"
                  aria-expanded={showEmoji}
                >
                  <Smile className="w-5 h-5 text-slate-600" />
                </button>

                {showEmoji && (
                  <div
                    className="absolute z-10 bottom-14 left-0 sm:left-auto sm:right-0 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl p-3 w-64 sm:w-80 max-h-60 overflow-y-auto overscroll-contain"
                    role="dialog"
                    aria-label="Choisir un emoji"
                  >
                    {EMOJI_GROUPS.map(group => (
                      <div key={group.title} className="mb-2 last:mb-0">
                        <p className="text-xs font-semibold text-gray-500 mb-1">{group.title}</p>
                        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1">
                          {group.list.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="text-xl sm:text-2xl hover:bg-blue-50 rounded-md p-1 transition"
                              aria-label={`Ajouter ${emoji}`}
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

              {/* Input texte */}
              <input
                className="flex-1 border-2 border-slate-200 rounded-xl px-4 sm:px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium transition"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Écrivez votre message..."
                disabled={loading}
              />

              {/* Bouton Envoyer */}
              <Button
                type="submit"
                disabled={(!text.trim() && !selectedImage) || loading}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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

            <p className="text-xs text-gray-500 mt-2 text-center">
              📎 Images acceptées : JPG, PNG, GIF, WEBP (max 5MB) • 😊 Emojis organisés par catégories
            </p>
          </div>
        </Card>

        {/* Info box */}
        <div className="mt-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Conseil</h3>
              <p className="text-gray-700">
                Notre équipe vous répond généralement sous <strong>8h</strong>. Pour une réponse encore plus rapide,
                contactez-nous sur <strong>WhatsApp : +224 626 69 98 39</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

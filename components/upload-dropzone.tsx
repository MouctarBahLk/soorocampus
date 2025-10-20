'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, AlertCircle, CheckCircle, FileText, Info } from 'lucide-react'

type Props = {
  disabled?: boolean
  onUploadSuccess?: () => void
}

// Types de documents disponibles
const DOC_TYPES = [
  { value: 'photo_identite', label: "Photo d'identité" },
  { value: 'cv', label: 'CV' },
  { value: 'releve_notes', label: 'Relevés de notes (Post-Bac)' },
  { value: 'releve_notes_terminale', label: 'Relevés de notes (Terminale)' },
  { value: 'diplome_bac', label: 'Diplôme du bac' },
  { value: 'passeport', label: 'Passeport' },
]

// Sous-types pour les relevés de notes
const SUB_TYPES: { [key: string]: { value: string; label: string }[] } = {
  releve_notes: [
    { value: 'releve_2025', label: 'Attestation 2025-2026' },
    { value: 'releve_2024', label: 'Bulletin 2024-2025' },
    { value: 'releve_2023', label: 'Bulletin 2023-2024' },
    { value: 'releve_2022', label: 'Bulletin 2022-2023' },
  ],
  releve_notes_terminale: [
    { value: 'attestation_terminale', label: 'Attestation Terminale' },
    { value: 'bulletin_12eme', label: 'Bulletin 12ème' },
    { value: 'bulletin_11eme', label: 'Bulletin 11ème' },
  ],
}

export default function UploadDropzone({ disabled = false, onUploadSuccess }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // États pour le type de document
  const [docType, setDocType] = useState('')
  const [subType, setSubType] = useState('')
  const [showInfo, setShowInfo] = useState(true)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Validation : vérifier que le type de document est sélectionné
      if (!docType) {
        setError('⚠️ Sélectionne d\'abord un type de document')
        return
      }

      const file = acceptedFiles[0]
      if (!file) return

      // Validation taille photo d'identité
      if (docType === 'photo_identite' && file.size > 450 * 1024) {
        setError(' La photo d\'identité doit faire moins de 450 Ko')
        return
      }

      // Validation taille générale (10 Mo)
      if (file.size > 10 * 1024 * 1024) {
        setError(' Le fichier est trop lourd (max 10 Mo)')
        return
      }

      setUploading(true)
      setError(null)
      setSuccess(false)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type_doc', docType)
        if (subType) {
          formData.append('sub_type', subType)
        }

        const res = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        })

        // Vérifier si la réponse est du JSON
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Erreur serveur : réponse invalide')
        }

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors de l\'upload')
        }

        setSuccess(true)
        setError(null)
        
        // Réinitialiser les champs
        setDocType('')
        setSubType('')
        
        // Callback de succès
        if (onUploadSuccess) {
          setTimeout(() => {
            onUploadSuccess()
          }, 500)
        }

        // Masquer le message de succès après 3s
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(message)
      } finally {
        setUploading(false)
      }
    },
    [docType, subType, onUploadSuccess]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
  })

  // Afficher les sous-types si nécessaire
  const showSubTypes = docType === 'releve_notes' || docType === 'releve_notes_terminale'
  const currentSubTypes = SUB_TYPES[docType] || []

  return (
    <div className="space-y-6">
      {/* INFO : Documents requis */}
      {showInfo && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Documents requis</h3>
                
                <div className="text-sm text-blue-800 space-y-3">
                  <div>
                    <p className="font-medium mb-1"> Pour tous :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Photo d'identité (fond blanc, max 450 Ko)</li>
                      <li>CV</li>
                      <li>Passeport biométrique</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium mb-1"> Si vous êtes en Terminale :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Attestation de Terminale</li>
                      <li>Bulletin de 12ème année</li>
                      <li>Bulletin de 11ème année</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium mb-1"> Si vous êtes Post-Bac :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Attestation 2025-2026</li>
                      <li>Bulletins 2024-2025, 2023-2024, 2022-2023</li>
                      <li>Diplôme du bac + relevé de notes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Masquer
            </button>
          </div>
        </div>
      )}

      {!showInfo && (
        <button
          onClick={() => setShowInfo(true)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <Info className="h-4 w-4" />
          Afficher les documents requis
        </button>
      )}

      {/* Sélection du type de document */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de document <span className="text-red-500">*</span>
        </label>
        <select
          value={docType}
          onChange={(e) => {
            setDocType(e.target.value)
            setSubType('') // Réinitialiser le sous-type
            setError(null)
          }}
          disabled={disabled || uploading}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Sélectionne un type --</option>
          {DOC_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sous-type (si applicable) */}
      {showSubTypes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Précise l'année / le type <span className="text-red-500">*</span>
          </label>
          <select
            value={subType}
            onChange={(e) => {
              setSubType(e.target.value)
              setError(null)
            }}
            disabled={disabled || uploading}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Sélectionne --</option>
            {currentSubTypes.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info contextuelle selon le type sélectionné */}
      {docType === 'photo_identite' && (
        <div className="flex items-start gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Important :</strong> Fond blanc obligatoire, taille maximum 450 Ko
          </span>
        </div>
      )}

      {docType === 'passeport' && (
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Passeport <strong>biométrique</strong> requis (avec puce électronique)
          </span>
        </div>
      )}

      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'}
          ${!docType ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        
        {uploading ? (
          <p className="text-gray-600 font-medium">Upload en cours...</p>
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">Dépose le fichier ici</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium">
              Glisse ton fichier ici ou clique pour sélectionner
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PDF, PNG, JPG (max {docType === 'photo_identite' ? '450 Ko' : '10 Mo'})
            </p>
          </>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>✓ Document uploadé avec succès !</span>
        </div>
      )}
    </div>
  )
}
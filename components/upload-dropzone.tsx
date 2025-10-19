// components/upload-dropzone.tsx
"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

interface UploadDropzoneProps {
  onUploadSuccess?: () => void
  disabled?: boolean
}

export default function UploadDropzone({ onUploadSuccess, disabled = false }: UploadDropzoneProps) {
  const [studentStatus, setStudentStatus] = useState<"" | "terminale" | "postbac">("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Dynamic document types based on student status
  const getDocTypes = () => {
    const common = [
      { value: "photo_identite", label: "Photo d'identité (fond blanc)" },
      { value: "cv", label: "CV" },
    ]

    if (studentStatus === "terminale") {
      return [
        ...common,
        { value: "attestation_terminale", label: "Attestation d'inscription Terminale 2025-2026" },
        { value: "bulletin_12eme", label: "Bulletin 12ème" },
        { value: "bulletin_11eme", label: "Bulletin 11ème" },
        { value: "passeport", label: "Passeport biométrique" },
      ]
    } else if (studentStatus === "postbac") {
      return [
        ...common,
        { value: "releve_2025", label: "Attestation d'inscription 2025-2026" },
        { value: "releve_2024", label: "Bulletin 2024-2025" },
        { value: "releve_2023", label: "Bulletin 2023-2024" },
        { value: "releve_2022", label: "Bulletin 2022-2023" },
        { value: "diplome_bac", label: "Diplôme du bac + relevé de notes" },
        { value: "passeport", label: "Passeport biométrique" },
      ]
    }
    return []
  }

  const docTypes = getDocTypes()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUpload = async (file: File) => {
    if (!selectedType) {
      setMessage({ type: "error", text: "Sélectionne d'abord le type de document" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const form = new FormData()
      form.append("file", file)
      
      // Déterminer le docType et subType selon le statut
      if (studentStatus === "terminale" && 
          (selectedType === "attestation_terminale" || selectedType === "bulletin_12eme" || selectedType === "bulletin_11eme")) {
        form.append("docType", "releve_notes_terminale")
        form.append("subType", selectedType)
      } else if (studentStatus === "postbac" && 
                 (selectedType === "releve_2025" || selectedType === "releve_2024" || selectedType === "releve_2023" || selectedType === "releve_2022")) {
        form.append("docType", "releve_notes")
        form.append("subType", selectedType)
      } else {
        form.append("docType", selectedType)
      }

      const res = await fetch("/api/documents", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'upload" })
      } else {
        setMessage({ type: "success", text: "Document uploadé avec succès !" })
        setSelectedType("")
        if (onUploadSuccess) {
          setTimeout(() => onUploadSuccess(), 1000)
        } else {
          setTimeout(() => window.location.reload(), 1500)
        }
      }
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e)
      setMessage({ type: "error", text: err })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
  }

  const canUpload = !!selectedType

  if (!studentStatus) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-3">D'abord, indique ton statut :</p>
          <div className="space-y-2">
            <button
              onClick={() => setStudentStatus("terminale")}
              className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-medium"
            >
              👨‍🎓 Je suis en Terminale
            </button>
            <button
              onClick={() => setStudentStatus("postbac")}
              className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-medium"
            >
              📚 Je suis en études supérieures (Post-Bac)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">
          {studentStatus === "terminale" ? "👨‍🎓 Terminale" : "📚 Post-Bac"}
        </span>
        <button
          onClick={() => setStudentStatus("")}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Changer
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de document <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Choisir un type...</option>
          {docTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        } ${!canUpload ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          disabled={!canUpload || isLoading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="font-medium text-gray-900">Glisse ton fichier ici ou clique</p>
        <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG... (max 10 Mo)</p>
      </div>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          Upload en cours...
        </div>
      )}
    </div>
  )
}
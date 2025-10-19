'use client'
import { Button } from "@/components/ui/button"

export default function DeleteAccountButton() {
  function handleDelete() {
    alert('Pour supprimer ton compte, contacte le support à support@sooro-campus.com')
  }

  return (
    <Button
      type="button"
      onClick={handleDelete}
      variant="outline"
      className="border-red-300 text-red-700 hover:bg-red-100 rounded-xl"
    >
      Supprimer mon compte
    </Button>
  )
}
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Paiement réussi !
          </h1>
          <p className="text-gray-600 mb-6">
            Ton accompagnement est maintenant activé.
          </p>
          <Link href="/app/mon-dossier">
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl">
              Accéder à mon espace
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

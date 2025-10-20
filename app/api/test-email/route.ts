import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'mamadoumouctarbah70@gmail.com', // ton email exact
      subject: 'Test Resend direct ✅',
      html: '<p>Ceci est un test depuis SooroCampus avec Resend 🎓</p>',
    })
    console.log('✅ Email envoyé :', data)
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    console.error('❌ Erreur:', err)
    return NextResponse.json({ ok: false, error: err })
  }
}

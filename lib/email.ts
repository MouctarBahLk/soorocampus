import { Resend } from 'resend'
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendDecisionEmail(to: string, status: string) {
  if (!resend) return
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Mise à jour de votre dossier — ${status}`,
    html: `<p>Bonjour,</p><p>Votre dossier est maintenant : <b>${status}</b>.</p><p>— Équipe Sooro Campus</p>`
  })
}

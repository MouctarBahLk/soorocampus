import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email de bienvenue après inscription
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Sooro Campus <noreply@soorocampus.com>', // Changez après avoir configuré votre domaine
      to: email,
      subject: ' Bienvenue sur Sooro Campus !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1d4ed8;">Bienvenue ${name} ! 🎓</h1>
          
          <p>Félicitations ! Ton compte est maintenant activé.</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 30px 0;">
            <h2 style="margin: 0 0 15px 0;">Tu peux maintenant :</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0;"> Accéder à tous nos cours</li>
              <li style="padding: 8px 0;"> Suivre ta progression</li>
              <li style="padding: 8px 0;"> Télécharger les ressources</li>
              <li style="padding: 8px 0;"> Rejoindre la communauté</li>
            </ul>
          </div>
          
          <a href="https://soorocampus.com/app/tableau-de-bord" 
             style="background-color: #1d4ed8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
             Accéder à mon espace
          </a>
          
          <p style="margin-top: 30px;">Besoin d'aide ? Réponds à cet email, on est là pour toi !</p>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            <strong>Sooro Campus</strong> - Ta réussite Campus France<br>
            <a href="https://soorocampus.com" style="color: #1d4ed8;">soorocampus.com</a>
          </p>
        </div>
      `
    })
    console.log(' Email de bienvenue envoyé à', email)
    return { success: true }
  } catch (error) {
    console.error(' Erreur envoi email bienvenue:', error)
    return { success: false, error }
  }
}

// Email de confirmation de paiement
export async function sendPaymentConfirmation(
  email: string, 
  name: string,
  amount: number,
  courseName: string
) {
  const price = (amount / 100).toFixed(2)
  
  try {
    await resend.emails.send({
      from: 'Sooro Campus <noreply@soorocampus.com>',
      to: email,
      subject: ' Paiement confirmé - Accès au cours débloqué !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0;"> Paiement confirmé !</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p>Salut ${name},</p>
            
            <p style="font-size: 18px;">Ton paiement a bien été reçu ! 🎉</p>
            
            <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1d4ed8;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Tu as maintenant accès à :</p>
              <h2 style="margin: 0 0 15px 0; color: #111827;">${courseName}</h2>
              <p style="font-size: 32px; font-weight: bold; color: #1d4ed8; margin: 0;">
                ${price} €
              </p>
            </div>
            
            <a href="https://soorocampus.com/app/mes-cours" 
               style="background-color: #1d4ed8; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0;">
              🎓 Commencer le cours maintenant
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              📧 Un reçu détaillé t'a été envoyé séparément.<br>
              💬 Questions ? Réponds simplement à cet email !
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            Sooro Campus - contact@soorocampus.com
          </p>
        </div>
      `
    })
    console.log(' Email de confirmation envoyé à', email)
    return { success: true }
  } catch (error) {
    console.error(' Erreur envoi email confirmation:', error)
    return { success: false, error }
  }
}

// Email avec reçu de paiement
export async function sendPaymentReceipt(
  email: string,
  name: string,
  receiptUrl: string,
  amount: number,
  paymentId: string
) {
  const price = (amount / 100).toFixed(2)
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  
  try {
    await resend.emails.send({
      from: 'Sooro Campus <noreply@soorocampus.com>',
      to: email,
      subject: ' Votre reçu de paiement - Sooro Campus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 0;">
            <h1 style="color: #111827; margin: 0;">🧾 Reçu de paiement</h1>
          </div>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px;">
            <p>Bonjour ${name},</p>
            
            <p>Merci pour votre paiement. Voici les détails de votre transaction :</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 30px 0; background: #f9fafb; border-radius: 8px; overflow: hidden;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 15px; font-weight: 600;">Montant payé</td>
                <td style="padding: 15px; text-align: right; color: #1d4ed8; font-weight: bold; font-size: 20px;">
                  ${price} €
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 15px;">Date</td>
                <td style="padding: 15px; text-align: right;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 15px;">Référence</td>
                <td style="padding: 15px; text-align: right; font-family: monospace; font-size: 12px;">
                  ${paymentId.substring(0, 20)}...
                </td>
              </tr>
              <tr>
                <td style="padding: 15px;">Client</td>
                <td style="padding: 15px; text-align: right;">${name}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${receiptUrl}" 
                 style="background-color: #1d4ed8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                 Télécharger le reçu officiel Stripe
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
               <strong>Conseil :</strong> Ce reçu est également disponible dans votre tableau de bord, section "Paiements".
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>Sooro Campus</strong><br>
              Des questions ? <a href="mailto:contact@soorocampus.com" style="color: #1d4ed8;">contact@soorocampus.com</a>
            </p>
          </div>
        </div>
      `
    })
    console.log(' Reçu envoyé à', email)
    return { success: true }
  } catch (error) {
    console.error(' Erreur envoi reçu:', error)
    return { success: false, error }
  }
}
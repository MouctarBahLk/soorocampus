// app/confidentialite/page.tsx
export const metadata = {
    title: "Politique de confidentialité - Sooro Campus",
    description: "Détails sur la collecte, l’utilisation et la protection de vos données personnelles sur Sooro Campus.",
  }
  
  export default function ConfidentialitePage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Politique de confidentialité</h1>
  
        <p>
          Cette politique de confidentialité décrit comment <strong>Sooro Campus</strong> collecte, utilise
          et protège vos données personnelles conformément au Règlement Général sur la Protection
          des Données (RGPD).
        </p>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Données collectées</h2>
          <p>
            Nous collectons les informations suivantes lors de votre utilisation du site :
            nom, prénom, adresse e-mail, documents téléchargés, et informations de paiement.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Finalités du traitement</h2>
          <p>
            Vos données sont utilisées pour :
            - la gestion de votre compte utilisateur,  
            - le suivi de vos candidatures,  
            - l’accès aux services premium,  
            - l’envoi d’informations ou notifications utiles.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Conservation des données</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif, puis supprimées dans un délai
            de 12 mois après suppression du compte.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Partage des données</h2>
          <p>
            Les données ne sont jamais revendues. Elles peuvent être partagées uniquement avec nos
            prestataires techniques (hébergeur, service de paiement, messagerie sécurisée) pour assurer
            le bon fonctionnement du service.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression
            de vos données.  
            Pour exercer vos droits :  
            📩 <a href="mailto:contact@soorocampus.com" className="text-blue-600 hover:underline">
            contact@soorocampus.com
            </a>
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Sécurité</h2>
          <p>
            Nous mettons en œuvre toutes les mesures techniques nécessaires (chiffrement, accès restreint)
            pour protéger vos données personnelles contre toute utilisation non autorisée.
          </p>
        </section>
      </main>
    )
  }
  
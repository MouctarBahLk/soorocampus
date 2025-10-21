// app/mentions-legales/page.tsx
export const metadata = {
    title: "Mentions légales - Sooro Campus",
    description: "Informations légales du site Sooro Campus conformément à la législation en vigueur.",
  }
  
  export default function MentionsLegalesPage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Mentions légales</h1>
  
        <p>
          Conformément aux dispositions des articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004
          pour la Confiance dans l’Économie Numérique, nous portons à la connaissance des utilisateurs
          du site <strong>Sooro Campus</strong> les informations suivantes.
        </p>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Éditeur du site</h2>
          <p>
            Le site <strong>Sooro Campus</strong> est édité par :  
            <br />• <strong>Nom / Raison sociale :</strong> Sooro Campus  
            <br />• <strong>Statut :</strong> Auto-entrepreneur  
            <br />• <strong>Responsable de la publication :</strong> Mouctar Bah 
            <br />• <strong>Email :</strong> contact@soorocampus.com  
            <br />• <strong>Adresse :</strong> Nous sommes basé à Conakry (Guinée) et egalement en france”
          </p>
        </section>
  
        <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Hébergeur</h2>
        <p>
          Le site est hébergé par :  
          <br />• <strong>Netlify Inc.</strong>  
          <br />340 S Lemon Ave #4133, Walnut, CA 91789, USA  
          <br />Site web :{" "}
          <a
            href="https://www.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            netlify.com
          </a>
        </p>
      </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Propriété intellectuelle</h2>
          <p>
            Tous les éléments du site (textes, images, logos, graphismes, vidéos, icônes, etc.) sont la propriété
            exclusive de Sooro Campus, sauf mention contraire.  
            Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, 
            de ces éléments, est interdite sans autorisation écrite préalable.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Responsabilité</h2>
          <p>
            Sooro Campus ne saurait être tenu responsable des dommages directs ou indirects résultant de
            l’accès ou de l’utilisation du site, y compris l’inaccessibilité, les pertes de données ou la présence
            de virus.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Données personnelles</h2>
          <p>
            Le traitement de vos données est encadré par notre{" "}
            <a href="/confidentialite" className="text-blue-600 hover:underline">
              politique de confidentialité
            </a>.
          </p>
        </section>
      </main>
    )
  }
  
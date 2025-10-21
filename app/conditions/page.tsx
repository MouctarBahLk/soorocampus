// app/conditions/page.tsx
export const metadata = {
    title: "Conditions générales d’utilisation - Sooro Campus",
    description: "Conditions d’utilisation du site et des services Sooro Campus.",
  }
  
  export default function ConditionsPage() {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-6 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Conditions générales d’utilisation</h1>
  
        <p>
          En accédant à ce site, vous acceptez pleinement et entièrement les présentes conditions générales
          d’utilisation (CGU). Si vous ne les acceptez pas, vous devez quitter le site.
        </p>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Objet</h2>
          <p>
            Le site <strong>Sooro Campus</strong> a pour objet d’accompagner les étudiants dans leurs démarches
            de candidature et d’études en France.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Accès au site</h2>
          <p>
            Le site est accessible gratuitement à tout utilisateur disposant d’un accès Internet. Certains services
            sont payants ou nécessitent la création d’un compte utilisateur.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Compte utilisateur</h2>
          <p>
            L’utilisateur s’engage à fournir des informations exactes lors de la création de son compte.
            Toute tentative de fraude ou d’usurpation d’identité entraînera la suspension immédiate du compte.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Services payants</h2>
          <p>
            Certains services sont payants. Les paiements sont traités par des prestataires sécurisés (ex : Stripe,
            PayPal, etc.). Aucune donnée bancaire n’est conservée par Sooro Campus.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Suspension / Résiliation</h2>
          <p>
            Sooro Campus se réserve le droit de suspendre ou supprimer tout compte utilisateur ne respectant
            pas les présentes conditions ou toute loi applicable.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux français
            seront seuls compétents.
          </p>
        </section>
      </main>
    )
  }
  
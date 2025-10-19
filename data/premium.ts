// data/premium.ts
export type RichSection = {
    title: string
    html: string // rendu via dangerouslySetInnerHTML côté page premium
  }
  
  export const PREMIUM_BY_SLUG: Record<string, { sections: RichSection[] }> = {
    // ---------------------------------------------------------------------------
    // 1) Procédure Campus France — guide premium riche
    // ---------------------------------------------------------------------------
    'procedure-campus-france': {
      sections: [
        {
          title: 'Checklist maître — du compte EEF au visa (anti-oubli)',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li><b>Compte EEF</b> — identité, parcours, projet. Prépare <b>PDF lisibles &lt; 2 Mo</b>, scans droits, noms normalisés.</li>
    <li><b>Vœux & cohérence</b> — 3–7 choix variés (Licence/Master), dont 1–2 ambitions, 2–3 sûrs. Cohérence <i>profil → formation → projet</i>.</li>
    <li><b>Dossier & frais</b> — relecture croisée, paiement éventuel des frais EEF (selon pays), captures de preuves (PDF + PNG).</li>
    <li><b>Entretien</b> — trame 5 parties (voir plus bas) + <b>3 arguments forts</b>. Budget & logement prêts à expliquer.</li>
    <li><b>Admissions</b> — téléversement des décisions, <b>plan A/B/C</b> actif, mails de relance propres et datés.</li>
    <li><b>Visa VLS-TS</b> — France-Visas + TLS/consulat, <b>liste personnalisée</b>, prises de RDV anticipées, reçus & suivi.</li>
  </ul>
  <p class="mt-3 text-sm text-gray-600">Astuce : centralise tout dans un <b>tableur de pilotage</b> (deadlines, pièces, RDV, relances).</p>`
        },
        {
          title: 'Trouver et comparer des formations fiables',
          html: `
  <div class="space-y-2">
    <p>Combine <b>comparateurs privés</b> et <b>sources officielles</b> pour éviter les pièges et valider la qualité :</p>
    <ul class="list-disc pl-5 space-y-1">
      <li><a class="text-blue-700 underline" href="https://thotismedia.com/classement-universites-thotis/" target="_blank" rel="noopener">Classement Thotis (comparatifs universités)</a></li>
      <li><a class="text-blue-700 underline" href="https://www.campusfrance.org/fr/actu/label-bienvenue-en-france-etablissements-labellises" target="_blank" rel="noopener">Label “Bienvenue en France” (liste officielle des établissements labellisés)</a></li>
      <li><a class="text-blue-700 underline" href="https://www.onisep.fr/" target="_blank" rel="noopener">ONISEP (fiches métiers & formations officielles)</a></li>
      <li><a class="text-blue-700 underline" href="https://diplomeo.com/" target="_blank" rel="noopener">Diplomeo (comparateur privé de formations)</a></li>
    </ul>
    <p class="text-sm text-gray-600">Croise au moins deux sources et vérifie le <b>contenu des UE</b>, les <b>prérequis</b>, l’<b>alternance</b>, l’insertion.</p>
  </div>`
        },
        {
          title: 'Noms de fichiers & formats (anti-rejets)',
          html: `
  <div class="overflow-x-auto rounded-lg border border-gray-200">
  <table class="w-full text-sm">
    <thead class="bg-gray-50">
      <tr>
        <th class="text-left p-2">Catégorie</th>
        <th class="text-left p-2">Nom conseillé</th>
        <th class="text-left p-2">Format / Poids</th>
        <th class="text-left p-2">Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t">
        <td class="p-2">Passeport</td>
        <td class="p-2">ID_Passeport_NOM_PRENOM_2025.pdf</td>
        <td class="p-2">PDF — &lt; 2 Mo</td>
        <td class="p-2">Pages droites, pas de reflets, même orthographe partout</td>
      </tr>
      <tr class="border-t">
        <td class="p-2">Diplômes / Relevés</td>
        <td class="p-2">Diplome_Licence_NOM_PRENOM.pdf (fichiers séparés)</td>
        <td class="p-2">PDF — &lt; 2 Mo</td>
        <td class="p-2">Traductions assermentées si requis, lisibilité 300 dpi OK</td>
      </tr>
      <tr class="border-t">
        <td class="p-2">Langue</td>
        <td class="p-2">Test_TCF_2025-03_NOM.pdf</td>
        <td class="p-2">PDF — &lt; 2 Mo</td>
        <td class="p-2">Ou attestation d’exemption (programme en anglais, etc.)</td>
      </tr>
    </tbody>
  </table>
  </div>`
        },
        {
          title: 'Trame d’entretien Campus France (avec exemples)',
          html: `
  <ol class="list-decimal pl-5 space-y-2">
    <li><b>Présentation (25–35s)</b> — “Je suis …, parcours …, j’ai choisi … pour …”.</li>
    <li><b>Pourquoi ce programme</b> — modules → compétences → objectif (ex : data → analyste BI).</li>
    <li><b>Pourquoi la France</b> — écosystème, labos, alternance, réseau sectoriel; <i>pas</i> seulement “beau pays”.</li>
    <li><b>Financement</b> — plan réaliste (épargne/garant/bourse) + <b>budget mensuel</b> (tableau fourni).</li>
    <li><b>Après diplôme</b> — 2 scénarios crédibles (France/retour), alignés au programme.</li>
  </ol>
  <p class="text-sm text-gray-600 mt-2">Entraîne-toi à voix haute. Vise 6–8 min fluides. Réponses courtes, concrètes.</p>`
        },
        {
          title: 'Rétroplanning type (90 jours) + portails officiels',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li><b>J-90 → J-60</b> : finaliser EEF + vœux, CV/LM, trame entretien; lancer logement.</li>
    <li><b>J-60 → J-30</b> : décisions écoles, uploads, <b>RDV TLS/consulat</b>, pièces visa prêtes.</li>
    <li><b>J-30 → J-0</b> : dépôt visa, suivi, vol, dossier d’arrivée (OFII/ANEF, banque, logement).</li>
  </ul>
  <div class="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
    <a class="text-blue-700 underline" href="https://france-visas.gouv.fr/" target="_blank" rel="noopener">France-Visas (officiel)</a>
    <a class="text-blue-700 underline" href="https://www.tlscontact.com/" target="_blank" rel="noopener">TLScontact (centres)</a>
    <a class="text-blue-700 underline" href="https://pastel.diplomatie.gouv.fr/etudesenfrance" target="_blank" rel="noopener">Portail EEF / Campus France</a>
    <a class="text-blue-700 underline" href="https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/" target="_blank" rel="noopener">ANEF (après-arrivée)</a>
  </div>`
        },
        {
          title: 'Modèles & fichiers à utiliser (bibliothèque premium)',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Tableur de pilotage (deadlines, RDV, pièces, relances)</li>
    <li>Pack emails (relance école / consulat / escalade polie)</li>
    <li>Trame d’entretien imprimable + grille d’évaluation</li>
    <li>Plan de cohérence (1 page) prêt à adapter</li>
  </ul>
  <p class="mt-2 text-sm text-gray-600">Retrouve ces fichiers dans <b>Bibliothèque Premium</b>.</p>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 2) Documents indispensables — premium solide
    // ---------------------------------------------------------------------------
    'checklist-documents': {
      sections: [
        {
          title: 'Tableau de conformité (formats, poids, naming)',
          html: `
  <p>Vérifie chaque pièce avant upload pour éviter les rejets automatiques.</p>
  <ul class="list-disc pl-5 space-y-1">
    <li>PDF prioritaire, <b>&lt; 2 Mo</b>, orientation droite, résolution ~300 dpi.</li>
    <li>Noms courts sans espace : <code>Nom_Prenom_Type_YYYY.pdf</code></li>
    <li>Copies <b>lisibles</b> et <b>complètes</b> (recto/verso si besoin).</li>
  </ul>`
        },
        {
          title: 'Pièces sensibles & erreurs fréquentes',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li><b>Diplômes/Relevés :</b> pages manquantes, mauvaise traduction, scan flou.</li>
    <li><b>Ressources :</b> mouvements incohérents, relevés trop récents, absence d’attestation de prise en charge.</li>
    <li><b>Hébergement :</b> attestation sans pièces du logeur (ID, titre de propriété/bail, justificatif domicile).</li>
  </ul>`
        },
        {
          title: 'Pack de modèles prêts',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Attestation d’hébergement (structure + pièces annexes)</li>
    <li>Lettre de prise en charge financière (étudiant/garant)</li>
    <li>Déclaration sur l’honneur (cohérence / corrections)</li>
    <li>Courriels types (école, consulat, centre de visas)</li>
  </ul>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 3) Lettre de motivation — premium expert
    // ---------------------------------------------------------------------------
    'lettre-de-motivation': {
      sections: [
        {
          title: 'Structure gagnante + longueurs cibles',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>1 page (350–450 mots) — sobre, aérée, sans fautes.</li>
    <li>Intro courte & contexte → <b>Adéquation programme</b> → <b>Projet pro</b> → Conclusion polie.</li>
  </ul>`
        },
        {
          title: 'Exemples commentés (FR/EN)',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Licence → Master (mise en cohérence)</li>
    <li>Reconversion (valorisation des acquis)</li>
    <li>Alternance (employabilité & rythme)</li>
  </ul>
  <p class="text-sm text-gray-600">Fourni en pack : .docx modifiable + PDF d’exemples annotés.</p>`
        },
        {
          title: 'Checklist qualité (10 points)',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Pas de phrases génériques / copier-coller massif</li>
    <li>2–3 exemples concrets alignés avec les UE</li>
    <li>Orthographe irréprochable, formule de politesse standard</li>
  </ul>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 4) Modèles & templates — premium
    // ---------------------------------------------------------------------------
    'modeles-templates': {
      sections: [
        {
          title: 'Ce qui est inclus',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>CV FR/EN (3 variantes : sobre, alternance, junior)</li>
    <li>Lettre de motivation (FR/EN) + version commentée</li>
    <li>Courriels types (relances écoles / consulat / TLS / logement)</li>
    <li>Tableur de suivi (deadlines, RDV, pièces, relances)</li>
    <li>Checklist visa (selon pays) + mini guide “anti-retard”</li>
  </ul>`
        },
        {
          title: 'Conseils d’usage',
          html: `
  <p>Travaille toujours sur une <b>copie</b> du modèle, puis exporte en <b>PDF</b> pour les dépôts.</p>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 5) Budget & preuve de ressources — premium
    // ---------------------------------------------------------------------------
            'preuve-de-ressources': {
        sections: [
            {
            title: "Tout comprendre sur la preuve de ressources",
            html: `
        <p>La preuve financière est l’un des documents les plus sensibles de ton dossier. Elle prouve que tu peux subvenir à tes besoins pendant ton séjour. En 2025, le montant de référence fixé par Campus France est d’environ <b>€615/mois</b>, soit <b>€7 380/an</b>.</p>

        <p>➡️ Ce montant doit apparaître clairement à travers un <b>relevé bancaire, attestation de garant, ou bourse</b>.</p>

        <ul class="list-disc pl-5 space-y-1 mt-3">
        <li><b>Étudiants autonomes :</b> attestation de solde personnel (≥ 7 500€) sur un compte à ton nom, datée de moins de 30 jours.</li>
        <li><b>Étudiants garantis :</b> lettre de prise en charge + relevé de compte du garant + pièce d’identité signée.</li>
        <li><b>Boursiers :</b> attestation officielle avec mention du montant et durée de la bourse (Campus France ou État français).</li>
        </ul>`
            },
            {
            title: "Checklist anti-rejet (vérifiée par nos experts)",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>✔️ Documents en français ou traduits officiellement.</li>
        <li>✔️ Nom et prénom identiques à ceux du passeport.</li>
        <li>✔️ Attestation datée, signée et tamponnée (le cas échéant).</li>
        <li>✔️ Montants nets, visibles et récents (moins de 30 jours).</li>
        <li>✔️ Conversion en euros si le compte est à l’étranger (avec justificatif de taux).</li>
        </ul>`
            },
            {
            title: "Aides, bourses et solutions étudiantes",
            html: `
        <p>💡 Beaucoup d'étudiants ignorent qu’ils peuvent accéder à des <b>aides financières ou bourses partielles</b>.</p>
        <ul class="list-disc pl-5 space-y-1">
        <li><a href="https://www.campusfrance.org/fr/bourses-etudiants-etrangers" target="_blank" class="text-blue-700 underline">Bourses Campus France</a> (Eiffel, MIEM, excellence académique…)</li>
        <li><a href="https://www.service-public.fr/particuliers/vosdroits/F32487" target="_blank" class="text-blue-700 underline">Aides locales</a> selon la région ou la mairie d’accueil</li>
        <li>Programmes associatifs : OFAJ, AMIE, Rotary, Sorbonne Accueil Étudiants</li>
        </ul>`
            },
            {
            title: "Fichiers téléchargeables Premium",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📄 Modèle de lettre de garant + traduction officielle FR/EN</li>
        <li>💶 Tableur “Budget Campus France” (mensuel + annuel)</li>
        <li>📨 Modèle d’email consulat (preuve financière complémentaire)</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">Disponibles dans la Bibliothèque Premium Sooro Campus.</p>`
            }
        ]
        },

  
    // ---------------------------------------------------------------------------
    // 6) Entretien Campus France — premium
    // ---------------------------------------------------------------------------
    'entretien-campus-france': {
      sections: [
        {
          title: 'Grille d’évaluation (version agent)',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Cohérence <i>profil ↔ programme</i>, projet pro crédible</li>
    <li>Niveau de langue & autonomie</li>
    <li>Clarté, concision, sincérité</li>
  </ul>`
        },
        {
          title: '5 simulations types (scripts & feedback)',
          html: `
  <p>Scénarios prêts (FR/EN) avec pièges fréquents et <b>bonnes reformulations</b>. Utilise la grille fournie pour t’auto-noter.</p>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 7) Visa long séjour — premium
    // ---------------------------------------------------------------------------
    'visa-long-sejour': {
        sections: [
            {
            title: "Le Visa VLS-TS Étudiant expliqué simplement",
            html: `
        <p>Le <b>Visa Long Séjour valant Titre de Séjour (VLS-TS)</b> te permet d’étudier plus de 3 mois en France.  
        Il est obligatoire pour valider ton admission et t’inscrire à l’université.</p>
        <p>👉 Tu dois passer par le site <a href="https://france-visas.gouv.fr" target="_blank" class="text-blue-700 underline">france-visas.gouv.fr</a> puis par le centre TLScontact ou VFS Global selon ton pays.</p>`
            },
            {
            title: "Pièces à préparer (checklist officielle)",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📘 Passeport (valide 15 mois minimum)</li>
        <li>🎓 Attestation d’inscription / préinscription</li>
        <li>💶 Justificatif de ressources (≥ 615€/mois)</li>
        <li>🏡 Attestation ou contrat de logement</li>
        <li>🩺 Assurance santé internationale</li>
        <li>📷 3 photos d’identité récentes</li>
        <li>🧾 Justificatif de paiement Campus France</li>
        </ul>`
            },
            {
            title: "Conseils pratiques Sooro",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>✔️ Dépose ton dossier 4 à 6 semaines avant la rentrée.</li>
        <li>✔️ Vérifie ton e-mail TLS/VFS tous les jours (les créneaux partent vite).</li>
        <li>✔️ Prévois un reçu de paiement Campus France (scan clair + daté).</li>
        <li>✔️ Prépare une copie papier et PDF de tout le dossier pour ton arrivée.</li>
        </ul>`
            },
            {
            title: "Fichiers Premium",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📄 Modèle de checklist Visa France</li>
        <li>📨 Modèle d’email de relance TLS / consulat</li>
        <li>📋 Formulaire VFS pré-rempli (démo)</li>
        </ul>`
            }
        ]
        },

  
    // ---------------------------------------------------------------------------
    // 8) Logement étudiant — premium
    // ---------------------------------------------------------------------------
            'logement-etudiant': {
        sections: [
            {
            title: "Les 4 options principales pour se loger",
            html: `
        <p>Tu viens d’obtenir ton visa ou ton admission ? Le logement est ton premier vrai défi. Voici les <b>4 options les plus fiables</b> pour les étudiants internationaux :</p>

        <ol class="list-decimal pl-5 space-y-2 mt-3">
        <li><b>CROUS :</b> logement public étudiant, 200–400€/mois. Demande via <a href="https://trouverunlogement.lescrous.fr/" target="_blank" class="text-blue-700 underline">trouverunlogement.lescrous.fr</a>.</li>
        <li><b>Résidences privées :</b> Studéa, Les Belles Années, Cardinal Campus, Nexity Studéa… loyers de 400–650€.</li>
        <li><b>Colocation / particuliers :</b> Leboncoin, LaCarteDesColocs, Facebook groupes “Étudiants étrangers + ta ville”.</li>
        <li><b>Hébergement temporaire :</b> Auberges, foyers jeunes travailleurs, Airbnb (1 à 2 semaines à l’arrivée).</li>
        </ol>`
            },
            {
            title: "Checklist logement pour ton dossier Campus France",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>✔️ Attestation ou contrat de logement (avec adresse complète + signature)</li>
        <li>✔️ Copie pièce d’identité du logeur si hébergement</li>
        <li>✔️ Attestation d’assurance habitation (obligatoire à l’entrée)</li>
        <li>✔️ Justificatif de paiement ou réservation (capture d’écran / reçu)</li>
        </ul>`
            },
            {
            title: "Aides financières au logement (CAF)",
            html: `
        <p>La <b>CAF</b> (Caisse d’Allocations Familiales) rembourse entre <b>150€ et 250€/mois</b> selon ton loyer et ta situation.  
        Crée ton compte sur <a href="https://caf.fr" target="_blank" class="text-blue-700 underline">caf.fr</a> dès ton arrivée.</p>

        <ul class="list-disc pl-5 space-y-1">
        <li>Documents à fournir : bail, RIB français, passeport, visa VLS-TS, attestation de loyer.</li>
        <li>Délais moyens : 4 à 6 semaines après dépôt.</li>
        <li>Versement sur ton compte chaque 5 du mois suivant.</li>
        </ul>`
            },
            {
            title: "Fichiers Premium",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📄 Modèle d’attestation d’hébergement (hébergement gratuit)</li>
        <li>🏡 Exemple de contrat de location étudiant français</li>
        <li>📨 Modèle d’email CAF + réponse standard</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">Télécharge tout dans ta Bibliothèque Premium.</p>`
            }
        ]
        },

  
    // ---------------------------------------------------------------------------
    // 9) Calendrier & deadlines — premium
    // ---------------------------------------------------------------------------
    'calendrier-deadlines': {
    sections: [
        {
        title: "Planification stratégique pour ton projet France",
        html: `
    <p>Un bon dossier Campus France se prépare sur 3 à 6 mois.  
    Voici notre <b>rétroplanning complet</b> validé par des anciens étudiants et nos coachs Sooro Campus.</p>`
        },
        {
        title: "Rétroplanning type (Mars → Septembre)",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li><b>Janvier – Mars :</b> choix des formations + préparation des dossiers</li>
    <li><b>Avril – Mai :</b> finalisation EEF + entretien Campus France</li>
    <li><b>Juin :</b> réponses des établissements, choix définitif</li>
    <li><b>Juillet – Août :</b> demande de visa + préparation départ</li>
    <li><b>Septembre :</b> arrivée en France, démarches CAF / Ameli / banque</li>
    </ul>`
        },
        {
        title: "Outils Premium Sooro",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>📆 Tableau Google Sheet interactif (dates + alertes automatiques)</li>
    <li>🗓️ PDF “Ton année Campus France mois par mois”</li>
    <li>📲 Intégration Google Calendar (bêta Sooro 2025)</li>
    </ul>`
        }
    ]
    },

  
    // ---------------------------------------------------------------------------
    // 10) Traductions & légalisation — premium
    // ---------------------------------------------------------------------------
    'traductions-legalisation': {
      sections: [
        {
          title: 'Quand traduire / qui légalise',
          html: `
  <p>Identifie <b>traductions assermentées</b> et besoin d’<b>apostille/légalisation</b> selon l’origine du document.</p>`
        },
        {
          title: 'Modèles & circuit',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Courrier de demande</li>
    <li>Liste pièces & délais moyens</li>
    <li>Packaging final (ordre, trombones, index)</li>
  </ul>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 11) Attestation de logement — premium
    // ---------------------------------------------------------------------------
    'attestation-logement': {
      sections: [
        {
          title: 'Check pièces logeur',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Carte d’identité / titre séjour</li>
    <li>Justificatif de domicile & titre de propriété/bail</li>
    <li>Attestation signée + coordonnées</li>
  </ul>`
        },
        {
          title: 'Modèles prêts',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Attestation d’hébergement</li>
    <li>Lettre explicative consulat (si cas particulier)</li>
    <li>Checklist pièces du logeur</li>
  </ul>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 12) Assurances & santé — premium
    // ---------------------------------------------------------------------------
            'assurances-sante': {
        sections: [
            {
            title: "Comprendre ton inscription à la sécurité sociale étudiante",
            html: `
        <p>Tous les étudiants étrangers doivent s’inscrire sur <a href="https://etudiant-etranger.ameli.fr" target="_blank" class="text-blue-700 underline">etudiant-etranger.ameli.fr</a>.  
        Cette inscription est gratuite et obligatoire pour accéder au système de santé français.</p>

        <ul class="list-disc pl-5 space-y-1 mt-3">
        <li>🧾 Documents : passeport, visa VLS-TS, attestation d’inscription, RIB français, justificatif de domicile.</li>
        <li>⏳ Délais : 2 à 6 semaines pour recevoir le numéro provisoire.</li>
        <li>💡 Astuce : vérifie les mails de “ameli.fr” (souvent en spam).</li>
        </ul>`
            },
            {
            title: "Mutuelle & complémentaire santé : faut-il en prendre une ?",
            html: `
        <p>Oui, car la sécurité sociale rembourse seulement <b>70%</b> des soins en moyenne.  
        Une mutuelle étudiante couvre le reste (consultations, lunettes, soins dentaires…).</p>

        <ul class="list-disc pl-5 space-y-1">
        <li>🌿 <b>Heyme</b> – formule internationale spéciale étudiants.</li>
        <li>💙 <b>LMDE</b> – partenaire historique des universités.</li>
        <li>🏥 <b>April / MSH / Axa Student</b> – couverture complète + assistance visa.</li>
        </ul>

        <p class="mt-3 text-gray-700">💬 Conseil Sooro : prends la mutuelle avant ton départ, c’est plus rapide pour les remboursements.</p>`
            },
            {
            title: "Fichiers & modèles Premium",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📄 Modèle d’attestation d’inscription sécurité sociale</li>
        <li>📋 Comparatif 2025 des mutuelles étudiantes (Heyme, LMDE, April)</li>
        <li>🧾 Lettre type “demande d’accélération de dossier Ameli”</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">Retrouve-les dans la Bibliothèque Premium Sooro Campus.</p>`
            },
            {
            title: "Conseils Sooro Santé",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>👉 Télécharge l’appli <b>Doctolib</b> pour tes rendez-vous médicaux.</li>
        <li>👉 Crée ton compte <b>Ameli</b> dès réception du numéro provisoire.</li>
        <li>👉 Mets à jour ta carte Vitale dès réception définitive.</li>
        </ul>

        <p class="mt-3 text-gray-700">🩺 En suivant ces étapes, tu es couvert, remboursé et prêt à vivre ton séjour sans stress médical.</p>`
            }
        ]
        },

  
    // ---------------------------------------------------------------------------
    // 13) CV étudiant — premium
    // ---------------------------------------------------------------------------
    'cv-etudiant-modele': {
    sections: [
        {
        title: "Construis un CV académique français impeccable",
        html: `
    <p>Ton CV est ta carte de visite.  
    En France, il doit être <b>clair, sobre et axé sur les compétences</b>.</p>
    <p>Structure recommandée :</p>
    <ul class="list-disc pl-5 space-y-1">
    <li>👤 Informations personnelles (âge, nationalité, contact)</li>
    <li>🎓 Formation : du plus récent au plus ancien</li>
    <li>💼 Expériences : stages, projets, bénévolat</li>
    <li>💬 Langues & outils informatiques</li>
    <li>❤️ Centres d’intérêt liés à ton projet</li>
    </ul>`
        },
        {
        title: "Erreurs à éviter (classiques Campus France)",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>❌ Photo trop décontractée ou de mauvaise qualité</li>
    <li>❌ Longueur excessive (1 page suffit !)</li>
    <li>❌ Logos / couleurs flashy inutiles</li>
    </ul>`
        },
        {
        title: "Fichiers Premium inclus",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>📄 Modèle CV FR (Word + PDF)</li>
    <li>📄 Modèle CV EN (international)</li>
    <li>💬 Phrases d’accroche types selon les domaines</li>
    </ul>`
        }
    ]
    },

  
    // ---------------------------------------------------------------------------
    // 14) Emails de relance — premium
    // ---------------------------------------------------------------------------
    'emails-relance': {
    sections: [
        {
        title: "Modèles d’e-mails Campus France efficaces",
        html: `
    <p>Relancer une école, une université ou un consulat doit être fait avec tact et précision.  
    Voici nos modèles testés et validés par des étudiants admis.</p>`
        },
        {
        title: "Situations courantes + modèles Premium",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>📨 Relance école sans réponse après 3 semaines</li>
    <li>📨 Relance consulat (visa en attente)</li>
    <li>📨 Relance Campus France (corrections de dossier)</li>
    </ul>
    <p>Chaque mail est accompagné d’une trame professionnelle avec objet, ton et formule de politesse adaptés.</p>`
        },
        {
        title: "Fichiers Premium",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>📄 5 modèles Word (école / consulat / TLS / bourse)</li>
    <li>📨 Pack “phrases clés” prêtes à copier</li>
    </ul>`
        }
    ]
    },

  
    // ---------------------------------------------------------------------------
    // 15) Cohérence du projet — premium
    // ---------------------------------------------------------------------------
    'coherence-projet': {
    sections: [
        {
        title: "C’est quoi un projet d’étude cohérent ?",
        html: `
    <p>Campus France analyse la cohérence entre ton <b>parcours, la formation demandée et ton projet futur</b>.  
    Un bon projet montre une logique claire et réaliste.</p>`
        },
        {
        title: "Structure parfaite d’un projet motivé",
        html: `
    <ol class="list-decimal pl-5 space-y-2">
    <li><b>Introduction :</b> ton parcours et ta motivation.</li>
    <li><b>Formation visée :</b> comment elle complète ton profil.</li>
    <li><b>Objectif professionnel :</b> ton plan concret après diplôme.</li>
    </ol>`
        },
        {
        title: "Outils Premium",
        html: `
    <ul class="list-disc pl-5 space-y-1">
    <li>📄 Exemple de projet cohérent complet</li>
    <li>🧭 Fiche d’auto-évaluation Sooro Campus</li>
    <li>🗂️ 10 phrases clés à insérer pour convaincre</li>
    </ul>`
        }
    ]
    },

  
    // ---------------------------------------------------------------------------
    // 16) Frais de scolarité — premium
    // ---------------------------------------------------------------------------
    'frais-scolarite': {
      sections: [
        {
          title: 'Acomptes & preuves',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Reçus, justificatifs virement, capture portails</li>
    <li>Courrier de confirmation si demandé</li>
  </ul>`
        },
        {
          title: 'Tableau de suivi paiements',
          html: `
  <p>Modèle de tableau (échéances, montants, statut, références bancaires).</p>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 17) Arriver en France — premium
    // ---------------------------------------------------------------------------
            'arriver-en-france-30-jours': {
        sections: [
            {
            title: "Ton mois d’arrivée en France : plan d’action jour par jour",
            html: `
        <p>Les 30 premiers jours sont les plus intenses, mais pas les plus compliqués — à condition d’avoir un <b>rétroplanning clair</b>. Voici le parcours idéal validé par nos étudiants déjà installés 👇</p>

        <ol class="list-decimal pl-5 space-y-2 mt-3">
        <li><b>Jour 1–3 :</b> installation, vérification du logement, connexion Wi-Fi, carte SIM française (Orange, Free, SFR, Bouygues).</li>
        <li><b>Jour 4–7 :</b> validation de ton visa VLS-TS sur <a href="https://administration-etrangers-en-france.interieur.gouv.fr" target="_blank" class="text-blue-700 underline">ANEF</a>. Téléverse ton visa, ton adresse, et paye la taxe OFII (60€).</li>
        <li><b>Jour 8–10 :</b> ouverture d’un compte bancaire (Société Générale, BNP, N26, Revolut France…). Garde le RIB pour la CAF et la sécurité sociale.</li>
        <li><b>Jour 11–15 :</b> inscription à la <b>sécurité sociale étudiante</b> sur <a href="https://etudiant-etranger.ameli.fr" target="_blank" class="text-blue-700 underline">ameli.fr</a>. Garde le numéro provisoire reçu par email.</li>
        <li><b>Jour 16–20 :</b> dépose ta demande d’aide au logement sur <a href="https://caf.fr" target="_blank" class="text-blue-700 underline">caf.fr</a>. Prépare ton bail, ton RIB français et ton attestation de loyer.</li>
        <li><b>Jour 21–25 :</b> abonnement transport (Navigo, TCL, TBM…), carte étudiante définitive, adaptation au rythme de cours.</li>
        <li><b>Jour 26–30 :</b> vérifie ta couverture (mutuelle étudiante), ta déclaration d’assurance habitation et enregistre-toi à la mairie si exigé.</li>
        </ol>`
            },
            {
            title: "Checklist administrative complète",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>✔️ Validation VLS-TS (ANEF) + taxe OFII payée</li>
        <li>✔️ Compte bancaire actif (RIB reçu)</li>
        <li>✔️ Sécurité sociale enregistrée (numéro temporaire)</li>
        <li>✔️ CAF déposée + suivi dossier logement</li>
        <li>✔️ Assurance habitation + responsabilité civile</li>
        <li>✔️ Abonnement mobile + transport</li>
        </ul>
        <p class="mt-3 text-sm text-gray-600">→ Ces 6 éléments suffisent à te rendre 100% “installé légalement” et prêt à étudier sereinement.</p>`
            },
            {
            title: "Bonus : modèles et fichiers utiles",
            html: `
        <ul class="list-disc pl-5 space-y-1">
        <li>📄 Modèle d’attestation de logement (si hébergé chez un proche)</li>
        <li>💶 Tableur “Budget étudiant mensuel” (revenus + dépenses fixes)</li>
        <li>🏦 Guide “banques pour étudiants étrangers” (comparatif 2025)</li>
        <li>📬 Modèle d’email CAF pour accélérer la validation de ton dossier</li>
        </ul>
        <p class="mt-3 text-sm text-gray-600">Tous ces fichiers sont disponibles dans ta <b>Bibliothèque Premium</b>.</p>`
            },
            {
            title: "Conseils d’intégration (retours étudiants)",
            html: `
        <p>💬 <i>“Le plus important les 2 premières semaines, c’est de ne pas s’isoler.”</i></p>
        <ul class="list-disc pl-5 space-y-1">
        <li>Participe aux <b>journées d’accueil</b> de ton université ou de ta ville.</li>
        <li>Découvre les <b>associations étudiantes internationales</b> (ESN, Buddy System…)</li>
        <li>Installe les applis locales : Citymapper, Doctolib, Leboncoin, Lydia, etc.</li>
        <li>Crée un mini “groupe d’entraide” Sooro : partage vos bons plans logement, jobs, CAF, etc.</li>
        </ul>
        <p class="mt-3">➡️ En un mois, tu passes du statut d’arrivant à celui d’étudiant intégré et autonome 🇫🇷</p>`
            }
        ]
        },

  
    // ---------------------------------------------------------------------------
    // 18) FAQ “50 réponses” — premium
    // ---------------------------------------------------------------------------
    'faq-50-questions': {
      sections: [
        {
          title: 'FAQ classée par thèmes',
          html: `
  <ul class="list-disc pl-5 space-y-1">
    <li>Candidature & pièces</li>
    <li>Entretien & admissions</li>
    <li>Visa & arrivée</li>
  </ul>`
        },
        {
          title: 'Liens officiels directs',
          html: `
  <p>Pour chaque Q/R, un lien officiel (Campus France, France-Visas, etc.) est fourni dans la version complète.</p>`
        },
      ],
    },
  
    // ---------------------------------------------------------------------------
    // 19) Simulation d’entretien — premium
    // ---------------------------------------------------------------------------
        'simulation-entretien-campus-france': {
            sections: [
            {
                title: "Ce que tu obtiens immédiatement",
                html: `
        <div class="space-y-3">
            <p class="text-lg"><b>5 entretiens d'entraînement</b> (visio ou écrits) pensés pour te mettre en condition réelle — sans stress, avec un coach qui t'aide à structurer des réponses claires et convaincantes.</p>
            <ul class="list-disc pl-5 space-y-1">
            <li><b>Banque de questions réelles</b> collectées auprès d'étudiants des années précédentes (par filière et par pays).</li>
            <li><b>Scripts modèles</b> FR/EN + variantes par profil (reconversion, alternance, licence→master…).</li>
            <li><b>Feedback détaillé</b> après chaque session : forces, points à corriger, phrases à réutiliser.</li>
            <li><b>Enregistrements</b> (audio/vidéo) & fiches mémo à réviser la veille du rendez-vous.</li>
            <li><b>Grille de scoring</b> identique à celle utilisée en interne (cohérence, clarté, autonomie, projet pro).</li>
            </ul>
        </div>`
            },
            {
                title: "Déroulé des 5 entretiens (programme)",
                html: `
        <ol class="list-decimal pl-5 space-y-2">
            <li><b>Diagnostic & pitch 30s</b> — Qui es-tu ? Pourquoi ce programme ? Objectif : clarifier ta storyline et ton angle.</li>
            <li><b>Motivations & cohérence</b> — UE → compétences → projet : on construit <i>tes trois arguments phares</i>.</li>
            <li><b>Finance & autonomie</b> — Budget réaliste, logement, plan B ; réponses courtes, chiffrées, crédibles.</li>
            <li><b>Questions difficiles</b> — Doutes du dossier, trous, reconversion, notes faibles : on transforme en points forts.</li>
            <li><b>Générale avant le jour J</b> — Simulation chronométrée + feedback final + check-list minute.</li>
        </ol>`
            },
            {
                title: "Banque de questions par domaine (exemples)",
                html: `
        <div class="grid sm:grid-cols-2 gap-3">
            <div>
            <p class="font-semibold">Informatique / Data</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Explique un projet où tu as utilisé <i>SQL / Python</i> et l'impact obtenu.</li>
                <li>Pourquoi ce master plutôt qu’une école d’ingénieurs ?</li>
            </ul>
            </div>
            <div>
            <p class="font-semibold">Business / Gestion</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Quelle problématique de marché veux-tu résoudre avec cette formation ?</li>
                <li>Quelles compétences concrètes en 6 mois ? Donne des exemples.</li>
            </ul>
            </div>
            <div>
            <p class="font-semibold">Génie / BTP</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Normes/logiciels que tu maîtrises ? Donne un cas d’application.</li>
                <li>Quels chantiers/secteurs te visent après diplôme ?</li>
            </ul>
            </div>
            <div>
            <p class="font-semibold">Santé / Sciences</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Quelle méthodologie pour valider un protocole / une étude ?</li>
                <li>Pourquoi la France pour ce champ de recherche ?</li>
            </ul>
            </div>
            <div>
            <p class="font-semibold">Arts / Design</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Raconte la démarche derrière ton projet le plus abouti.</li>
                <li>Comment ton portfolio traduit-il ton positionnement ?</li>
            </ul>
            </div>
            <div>
            <p class="font-semibold">Sciences sociales</p>
            <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Quel cadre théorique mobilises-tu pour ton mémoire ? Pourquoi ?</li>
                <li>Que feras-tu concrètement après diplôme (exemples d’organisations) ?</li>
            </ul>
            </div>
        </div>
        <p class="mt-3 text-sm text-gray-600">Chaque lot de questions est accompagné de <b>réponses types</b> pour t’inspirer — tu les adaptes à ton parcours en 3 étapes simples.</p>`
            },
            {
                title: "Suivi, garanties & esprit Sooro",
                html: `
        <ul class="list-disc pl-5 space-y-1">
            <li><b>Support illimité par messages</b> entre les sessions pour reformuler tes réponses.</li>
            <li><b>Rattrapage offert</b> : si tu ne te sens pas prêt, on t’ajoute une mini-session de 20 min.</li>
            <li><b>Communauté</b> : accès à un canal d’entraide d’étudiants admis (retours d’expérience).</li>
            <li><b>Horaires flexibles</b> (soir & week-end) pour s’adapter à ton emploi du temps.</li>
        </ul>
        <p class="mt-3">Notre mission est claire : <b>zéro stress, 100% prêt</b>. Tu arrives au rendez-vous avec un pitch solide, des réponses maîtrisées et un plan B crédible.</p>
        <p class="mt-4 text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg p-3"><b>Prêt à t’entraîner ?</b> Réserve tes 5 sessions dans la Bibliothèque Premium ou contactes-nous pour un créneau express.</p>`
            }
            ],
        },
  
  }
  
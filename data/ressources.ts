export type ArticleLite = {
    slug: string
    tag:
      | 'Guide'
      | 'Checklist'
      | 'Conseils'
      | 'Outils'
      | 'Finances'
      | 'Entretien'
      | 'Visa'
      | 'Vie étudiante'
    title: string
    excerpt: string
    cover: string
  }
  
  export type PremiumDownload = {
    label: string
    href: string // chemin depuis /public (ex: /premium/xxx/file.pdf)
    note?: string
  }
  
  export type PremiumRichSection = {
    title: string
    content: string // Texte/markdown simple (whitespace-pre-line côté UI)
  }
  
  export type ArticleFull = ArticleLite & {
    intro: string
    freeSections: { title: string; content: string }[]
    premiumSections: { title: string; bullets: string[] }[]
    // --- enrichissements premium (optionnels) ---
    premiumRich?: PremiumRichSection[]
    premiumDownloads?: PremiumDownload[]
  }
  
  export const ARTICLES: ArticleFull[] = [
    // ---------------------------------------------------------------------------
    // 1) Procédure Campus France
    // ---------------------------------------------------------------------------
    {
      slug: 'procedure-campus-france',
      tag: 'Guide',
      title: 'Procédure Campus France : le guide étape par étape',
      excerpt: 'De la création de compte jusqu’au visa : parcours clair et checklists.',
      cover: '/covers/campus-france-guide.png',
      intro:
        "La procédure Études en France (EEF) regroupe candidature aux établissements, instruction Campus France, puis demande de visa. Suis ce fil conducteur pour éviter les oublis.",
      freeSections: [
        { title: 'Créer ton compte EEF', content: "Renseigne identité, parcours, projet d’études. Prépare tes scans (PDF, <2Mo si possible) et des noms de fichiers clairs." },
        { title: 'Choisir tes formations', content: "Vise la cohérence profil ↔ formation ↔ projet. Varie LMD (Licence/Master) et niveaux d’exigence pour sécuriser des admissions." },
        { title: 'Soumettre + frais EEF (selon pays)', content: "Après soumission, des frais EEF peuvent s’appliquer. Dossier instruit par l’espace Campus France local." },
        { title: 'Entretien (si convoqué)', content: "Bref, professionnel : motivations, plan d’études, niveau de langue, autonomie. Prépare 3 arguments forts et un plan B." },
        { title: 'Réponses des établissements', content: "Téléverse ton admission/attestation. Si attente/refus, conserve la stratégie et prépare les alternatives." },
        { title: 'Visa long séjour (France-Visas/TLS)', content: "Crée la demande, prends RDV, dépose les pièces, puis suis le traitement. À l’arrivée : validation VLS-TS." },
      ],
      premiumSections: [
        { title: 'Checklist par étape', bullets: ['Calendrier personnalisé', 'Pièces exactes par étape', 'Modèles de mails pour relances', 'Plan de cohérence prêt à adapter'] },
        { title: 'Pack modèles', bullets: ['CV FR/EN', 'Lettre de motivation', 'Relances école/consulat', 'Tableur de suivi (deadlines, RDV, pièces)'] },
      ],
      premiumRich: [
        {
          title: 'Feuille de route « 30–60–90 jours »',
          content:
            "• **J-90 → J-60** : shortlist programmes, test langue, budget (+ preuves).\n" +
            "• **J-60 → J-30** : candidatures, uploads, corrections, paiement EEF (si requis).\n" +
            "• **J-30 → J** : entretien (si), réponses, visa, logement + assurances."
        },
        {
          title: 'Nommage & hygiène documentaire',
          content:
            "Convention : `NOM_Prénom_TypeDoc_YYYYMM.pdf` — ex. `DIALLO_Aminata_Passeport_202406.pdf`.\n" +
            "Règles : PDF lisibles, compressés, **mêmes noms** côté EEF/visa, dates cohérentes."
        },
        {
          title: 'Plan B quand un maillon bloque',
          content:
            "• Créneaux TLS rares : alerte quotidienne + centres alternatifs.\n" +
            "• Attente réponses : justificatifs des échanges + lettre explicative pour visa.\n" +
            "• Budget juste : montage garant + explications chiffrées."
        }
      ],
      premiumDownloads: [
        { label: 'Tableau de suivi (Google Sheets)', href: '/premium/procedure/tableau-suivi.xlsx' },
        { label: 'Pack relances écoles/consulat', href: '/premium/procedure/pack-relances.zip', note: 'FR + EN' },
        { label: 'Template plan de cohérence', href: '/premium/procedure/plan-coherence.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 2) Checklist documents
    // ---------------------------------------------------------------------------
    {
      slug: 'checklist-documents',
      tag: 'Checklist',
      title: 'Documents indispensables pour ton dossier',
      excerpt: 'La liste à jour des pièces + astuces anti-refus.',
      cover: '/covers/checklist-docs.png',
      intro:
        "Les libellés varient selon pays/établissement, mais les catégories restent stables. Mieux vaut trop préparer que pas assez, et nommer tes fichiers proprement.",
      freeSections: [
        { title: 'Identité & parcours', content: "Passeport valide, état-civil, diplômes, relevés, traductions assermentées si demandé." },
        { title: 'Académique & langue', content: "Preuves d’admission/candidatures, TCF/DELF/DALF/IELTS/TOEFL ou attestation d’exemption." },
        { title: 'Finances & logement', content: "Preuves de ressources (étudiant/garant), hébergement (CROUS, bail, attestation), assurance logement." },
      ],
      premiumSections: [
        { title: 'Nomenclature & formats', bullets: ['Noms de fichiers normalisés', 'Poids/format acceptés', 'Exemples valides', 'Motifs de refus fréquents'] },
        { title: 'Modèles prêts', bullets: ['Attestation d’hébergement', 'Prise en charge financière', 'Déclaration sur l’honneur', 'Courriels types de suivi'] },
      ],
      premiumRich: [
        {
          title: 'Nomenclature commune (= zéro rejet)',
          content:
            "1) Un **nommage unique** pour tous les portails (EEF, visa, école).\n" +
            "2) **Piles de documents** : fusion PDF par catégorie + sommaire.\n" +
            "3) **Versions datées** et archivées pour chaque itération."
        },
        {
          title: 'Qualité d’image et OCR',
          content:
            "• Scanner à 150–200 dpi, N&B si texte, découpes propres.\n" +
            "• OCR recommandé (texte sélectionnable) → relecture rapide par agents."
        }
      ],
      premiumDownloads: [
        { label: 'Arborescence type (dossier ZIP)', href: '/premium/docs/arborescence.zip' },
        { label: 'Modèle attestation d’hébergement', href: '/premium/docs/attestation-hebergement.docx' },
        { label: 'Modèle prise en charge financière', href: '/premium/docs/prise-en-charge.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 3) Lettre de motivation
    // ---------------------------------------------------------------------------
    {
      slug: 'lettre-de-motivation',
      tag: 'Conseils',
      title: 'Réussir sa lettre de motivation',
      excerpt: 'Structure, ton, erreurs à éviter + exemple commenté.',
      cover: '/covers/lettre-motivation.png',
      intro:
        "Ta lettre doit lier parcours, formation visée et projet professionnel. Sobre, claire, personnalisée (éviter le copier-coller).",
      freeSections: [
        { title: 'Structure gagnante', content: "Intro brève (qui tu es), motivations académiques, adéquation programme, projection pro, conclusion polie." },
        { title: 'Ton & style', content: "Professionnel, affirmé sans excès. Privilégie des exemples concrets plutôt que des adjectifs vagues." },
        { title: 'Erreurs courantes', content: "Incohérence, lettres génériques, fautes, longueurs. Vérifie orthographe et noms d’établissement." },
      ],
      premiumSections: [
        { title: 'Exemples commentés', bullets: ['Licence → Master : angle évolution', 'Reconversion : valoriser expériences', 'Alternance : employabilité', 'Modèle FR + EN'] },
        { title: 'Checklist qualité', bullets: ['10 points à vérifier', 'Mots-clés acad./pro', 'Longueur idéale', 'Adaptations par filière'] },
      ],
      premiumRich: [
        {
          title: 'Trame « 3 actes » + amorces',
          content:
            "1) **Qui je suis** : « Actuellement [parcours], j’ai développé [compétences]… »\n" +
            "2) **Pourquoi votre programme** : « Il se distingue par [modules] alignés avec [objectif]… »\n" +
            "3) **Projet** : « À 3 ans je vise [poste/secteur], votre formation m’apporte [leviers]… »"
        },
        {
          title: 'Mini-Bibliothèque de verbatims',
          content:
            "• « cohérence **modules ↔ objectif** », « **transférabilité** des compétences », « **dimension internationale**/recherche »…\n" +
            "À doser, jamais en bloc."
        }
      ],
      premiumDownloads: [
        { label: 'Modèle LM FR (DOCX)', href: '/premium/lm/modele-fr.docx' },
        { label: 'Modèle LM EN (DOCX)', href: '/premium/lm/modele-en.docx' },
        { label: 'Grille d’auto-évaluation (PDF)', href: '/premium/lm/grille-eval.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 4) Modèles & templates
    // ---------------------------------------------------------------------------
    {
      slug: 'modeles-templates',
      tag: 'Outils',
      title: 'Modèles & templates téléchargeables',
      excerpt: 'CV, LM, emails types, planning, checklists prêtes.',
      cover: '/covers/templates.png',
      intro:
        "Tous nos modèles standards au format modifiable (Docx/Google Docs/Sheets). Utilise-les tels quels ou adapte-les à ton dossier.",
      freeSections: [
        { title: 'Ce que tu obtiens', content: "CV FR/EN, Lettre de motivation, Relances école/TLS, Tableur deadlines, Checklist visa, Plan de cohérence." },
        { title: 'Comment les utiliser', content: "Duplique et remplis. Conserve une version PDF pour les dépôts. Nomme-les correctement." },
      ],
      premiumSections: [
        { title: 'Accès complet', bullets: ['Téléchargements illimités', 'Mises à jour', 'Exemples réels anonymisés', 'Guides d’usage rapides'] },
      ],
      premiumRich: [
        {
          title: 'Pack « démarrage rapide »',
          content:
            "• **CV + LM** en FR/EN, prêts à compléter.\n" +
            "• **Tableur de suivi** (deadlines + statut + liens).\n" +
            "• **Relances types** adaptées écoles/consulat/TLS."
        },
        {
          title: 'Exemples réels anonymisés',
          content:
            "Trois dossiers **avant/après** : on met en évidence **cohérence** et **impact** des ajustements."
        }
      ],
      premiumDownloads: [
        { label: 'Pack modèles (ZIP)', href: '/premium/modeles/pack-modeles.zip', note: 'CV, LM, relances, checklist' },
        { label: 'Tableur de suivi', href: '/premium/modeles/tableur-suivi.xlsx' },
        { label: 'Exemples anonymisés (PDF)', href: '/premium/modeles/exemples.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 5) Finances & preuve de ressources
    // ---------------------------------------------------------------------------
    {
      slug: 'preuve-de-ressources',
      tag: 'Finances',
      title: 'Budget & preuve de ressources',
      excerpt: 'Préparer la preuve financière sans stress.',
      cover: '/covers/finances.png',
      intro:
        "Le consulat vérifie tes moyens de subsistance (étudiant ou garant). La présentation et la cohérence des montants sont clés.",
      freeSections: [
        { title: 'Sources acceptées', content: "Revenus/épargne, prise en charge par un garant, bourse, justificatifs bancaires récents." },
        { title: 'Bonnes pratiques', content: "Relevés lisibles, montants stables, cohérents avec les frais (logement/transport/scolarité)." },
        { title: 'Ce qui bloque', content: "Montants insuffisants, documents illisibles, comptes trop récents, conversions douteuses." },
      ],
      premiumSections: [
        { title: 'Dossiers béton', bullets: ['Modèle de prise en charge', 'Tableau budget mensuel', 'Conversion devises', 'Exemples validés'] },
      ],
      premiumRich: [
        {
          title: 'Montage financier lisible',
          content:
            "• **Tableau budget** : dépenses mensuelles réalistes (logement, transport, assurances…)\n" +
            "• **Flux financier** : origine des fonds (garant/épargne), stabilité sur 3–6 mois."
        },
        {
          title: 'Conversions & pièces probantes',
          content:
            "• Taux **Banque de France**/ECB du jour du dépôt.\n" +
            "• Relevés **au format PDF natif** (pas de captures mobiles floues)."
        }
      ],
      premiumDownloads: [
        { label: 'Tableau budget (xlsx)', href: '/premium/finances/tableau-budget.xlsx' },
        { label: 'Modèle prise en charge (docx)', href: '/premium/finances/prise-en-charge.docx' },
        { label: 'Exemples validés (PDF)', href: '/premium/finances/exemples-budget.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 6) Entretien Campus France
    // ---------------------------------------------------------------------------
    {
      slug: 'entretien-campus-france',
      tag: 'Entretien',
      title: 'Entretien Campus France : questions fréquentes',
      excerpt: 'Attentes des conseillers + erreurs à éviter.',
      cover: '/covers/entretien.webp',
      intro:
        "L’entretien confirme la cohérence de ton projet et ton autonomie. Pas d’interrogatoire : un échange court et structuré.",
      freeSections: [
        { title: 'Ce qu’ils évaluent', content: "Motivations, compréhension du programme, projet pro, ressources, logement, langue." },
        { title: 'Q/R classiques', content: "Pourquoi cette formation ? Pourquoi la France ? Quelle cohérence avec ton parcours ? Et ton plan B ?" },
      ],
      premiumSections: [
        { title: 'Simulations', bullets: ['Trame d’auto-prépa', 'Scores par critère', 'Réponses types', 'Pièges & reformulations'] },
      ],
      premiumRich: [
        {
          title: 'Trame de réponse « 60 secondes »',
          content:
            "Intro (qui je suis) → Pourquoi ce programme → Liens modules ↔ projet → Financement & logistique → Conclusion courte."
        },
        {
          title: 'Fiche « pièges fréquents »',
          content:
            "• Énumérer sans **lier**.\n" +
            "• Douter de la **faisabilité financière**.\n" +
            "• Ignorer **modules précis** du programme."
        }
      ],
      premiumDownloads: [
        { label: 'Grille d’évaluation (PDF)', href: '/premium/entretien/grille-eval.pdf' },
        { label: 'Scripts types (docx)', href: '/premium/entretien/scripts.docx' },
        { label: 'Checklist en 2 pages (PDF)', href: '/premium/entretien/check-2p.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 7) Visa long séjour
    // ---------------------------------------------------------------------------
    {
      slug: 'visa-long-sejour',
      tag: 'Visa',
      title: 'Après Campus France : visa long séjour',
      excerpt: 'France-Visas, RDV TLS/consulat, délais & suivi.',
      cover: '/covers/visa.webp',
      intro:
        "Après admission/validation EEF, dépose ton dossier visa (VLS-TS étudiant). Respecte formats et délais, et garde des copies.",
      freeSections: [
        { title: 'Créer le dossier', content: "Compte France-Visas, formulaire, liste personnalisée, prise de RDV au centre." },
        { title: 'Dépôt & suivi', content: "Empreintes, réception, tracking. À l’arrivée : validation VLS-TS en ligne." },
      ],
      premiumSections: [
        { title: 'Anti-retard', bullets: ['Checklist par pays', 'Pré-remplissages types', 'Relances & escalades', 'Plan B si créneaux rares'] },
      ],
      premiumRich: [
        {
          title: 'Dossier prêt-du-premier-coup',
          content:
            "• **Rendez-vous** : surveiller slots 2×/jour.\n" +
            "• Dossier trié, pages numérotées, justificatifs concordants **admissions/finances/logement**."
        },
        {
          title: 'À l’arrivée (VLS-TS)',
          content:
            "• Validation **ANEF** en ligne.\n" +
            "• Assurances, banque, mobile, logement — en 2 semaines idéalement."
        }
      ],
      premiumDownloads: [
        { label: 'Checklist visa (PDF)', href: '/premium/visa/checklist-visa.pdf' },
        { label: 'Pré-remplissages France-Visas', href: '/premium/visa/pre-remplissages.zip' },
        { label: 'Relances/Esclalades (docx)', href: '/premium/visa/relances.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 8) Logement étudiant
    // ---------------------------------------------------------------------------
    {
      slug: 'logement-etudiant',
      tag: 'Vie étudiante',
      title: 'Se loger en France depuis l’étranger',
      excerpt: 'Crous, résidences, baux, attestations, anti-arnaques.',
      cover: '/covers/logement.jpeg',
      intro:
        "Anticipe : attestation de logement peut être demandée pour le visa. Diversifie tes pistes et sécurise les paiements.",
      freeSections: [
        { title: 'Options', content: "CROUS, résidences privées, colocations, hébergement chez un proche (attestation + pièces du logeur)." },
        { title: 'Dossiers', content: "Pièces standard : identité, ressources, garant selon résidence. Vérifie les plateformes officielles." },
      ],
      premiumSections: [
        { title: 'Modèles utiles', bullets: ['Attestation d’hébergement', 'Lettre au CROUS', 'Checklist état des lieux', 'Liste plateformes sûres'] },
      ],
      premiumRich: [
        {
          title: 'Sécuriser les paiements',
          content:
            "• Jamais de **virement sans bail/signature**.\n" +
            "• Vérifier **SIREN/SIRET** et **IBAN** de la résidence.\n" +
            "• Utiliser plateformes officielles."
        },
        {
          title: 'État des lieux sans surprises',
          content:
            "• Photos datées, relevés compteurs, **liste des défauts** signée.\n" +
            "• Garder copie numérique du dossier complet."
        }
      ],
      premiumDownloads: [
        { label: 'Attestation d’hébergement (docx)', href: '/premium/logement/attestation.docx' },
        { label: 'Checklist état des lieux (pdf)', href: '/premium/logement/check-etat-des-lieux.pdf' },
        { label: 'Modèle lettre CROUS (docx)', href: '/premium/logement/lettre-crous.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 9) Calendrier / deadlines (pays)
    // ---------------------------------------------------------------------------
    {
      slug: 'calendrier-deadlines',
      tag: 'Guide',
      title: 'Calendrier & deadlines (selon pays)',
      excerpt: 'Planning type + marges de sécurité.',
      cover: '/covers/calendrier.png',
      intro:
        "Les fenêtres de candidature et RDV varient. Utilise un rétroplanning : soumission → entretien (si) → réponses → visa.",
      freeSections: [
        { title: 'Rétroplanning', content: "Remonter 3–6 mois selon pays. Bloquer des jalons (dossier, RDV, paiement, logement)." },
        { title: 'Rappels', content: "Utilise notre tableur/agenda pour notifications et partages avec le garant." },
      ],
      premiumSections: [
        { title: 'Plannings prêts', bullets: ['Modèle universel', 'Modèle “pays A”', 'Modèle “pays B”', 'Feuille de route équipe/garant'] },
      ],
      premiumRich: [
        {
          title: 'Rétro-planning détaillé (ex. pays A)',
          content:
            "• **M-6 → M-4** : repérage programmes, tests langue, budget.\n" +
            "• **M-4 → M-3** : candidatures, uploads, EEF.\n" +
            "• **M-3 → M-2** : entretien/réponses + visa.\n" +
            "• **M-1 → J** : RDV, logement, assurances."
        },
        {
          title: 'Rôles (étudiant/garant/équipe)',
          content:
            "• Étudiant = **soumissions/échanges**.\n" +
            "• Garant = **pièces financières**.\n" +
            "• Équipe = **cohérence + corrections + relances**."
        }
      ],
      premiumDownloads: [
        { label: 'Rétro-planning (xlsx)', href: '/premium/calendrier/retroplanning.xlsx' },
        { label: 'Checklist deadlines (pdf)', href: '/premium/calendrier/checklist-deadlines.pdf' },
        { label: 'Pack relances (zip)', href: '/premium/calendrier/pack-relances.zip' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 10) Traductions & légalisation
    // ---------------------------------------------------------------------------
    {
      slug: 'traductions-legalisation',
      tag: 'Checklist',
      title: 'Traductions & légalisation de documents',
      excerpt: 'Quand traduire, qui légalise, formats & bonnes pratiques.',
      cover: '/covers/legalisation.webp',
      intro:
        "Certaines pièces exigent une traduction assermentée ou une légalisation/apostille. Anticipe les délais.",
      freeSections: [
        { title: 'Traduction assermentée', content: "Liste de traducteurs agréés selon pays. Conserver l’original + la traduction." },
        { title: 'Légalisation/Apostille', content: "Selon l’origine des documents. Vérifie l’exigence de l’établissement/consulat." },
      ],
      premiumSections: [
        { title: 'Modèles & circuit', bullets: ['Courrier demande légalisation', 'Check pays/apostille', 'Délais moyens', 'Packaging du dossier'] },
      ],
      premiumRich: [
        {
          title: 'Circuit express',
          content:
            "• **Traduction** d’abord, puis **légalisation** si requise.\n" +
            "• Payer en ligne quand possible, éviter les envois multiples."
        },
        {
          title: 'Packaging irréprochable',
          content:
            "• Cover page par **catégorie**, pièces agrafées, cachets **lisibles**.\n" +
            "• Mention « Conforme à l’original » quand autorisé."
        }
      ],
      premiumDownloads: [
        { label: 'Courrier légalisation (docx)', href: '/premium/traductions/courrier-legalisation.docx' },
        { label: 'Checklist Apostille (pdf)', href: '/premium/traductions/check-apostille.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 11) Attestation de logement
    // ---------------------------------------------------------------------------
    {
      slug: 'attestation-logement',
      tag: 'Checklist',
      title: 'Attestation de logement : quoi fournir ?',
      excerpt: 'Bail, CROUS, attestation d’hébergement + pièces du logeur.',
      cover: '/covers/attestation-hebergement.webp',
      intro:
        "Le visa étudiant peut exiger une preuve de logement (ou d’hébergement). Adapte selon ton cas (résidence, proche, bail).",
      freeSections: [
        { title: 'Cas fréquents', content: "Bail nominatif, CROUS (notification), hébergement chez un proche (attestation + justificatifs du logeur)." },
        { title: 'Points de vigilance', content: "Adresses cohérentes, durées alignées au séjour, documents lisibles et récents." },
      ],
      premiumSections: [
        { title: 'Modèles prêts', bullets: ['Attestation d’hébergement', 'Lettre explicative consulat', 'Checklist pièces du logeur', 'Exemples acceptés'] },
      ],
      premiumRich: [
        {
          title: 'Montage « proche logeur »',
          content:
            "• Attestation **signée** + pièce d’identité logeur.\n" +
            "• Justificatif de domicile récent + mention **hébergement gratuit** ou charges."
        },
        {
          title: 'Aligner les adresses',
          content:
            "Même **adresse** sur attestation, preuves financières (si garant logeur) et formulaire visa."
        }
      ],
      premiumDownloads: [
        { label: 'Attestation d’hébergement (docx)', href: '/premium/attestation/attestation-hebergement.docx' },
        { label: 'Lettre explicative consulat (docx)', href: '/premium/attestation/lettre-consulat.docx' },
        { label: 'Checklist pièces logeur (pdf)', href: '/premium/attestation/check-logeur.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 12) Assurances & santé
    // ---------------------------------------------------------------------------
    {
      slug: 'assurances-sante',
      tag: 'Vie étudiante',
      title: 'Assurances & santé : ce qu’il faut prévoir',
      excerpt: 'Logement, responsabilité civile, sécu étudiante, mutuelle.',
      cover: '/covers/santé.jpeg',
      intro:
        "L’assurance logement est quasi systématique. Prévois aussi la responsabilité civile et la couverture santé adaptée.",
      freeSections: [
        { title: 'Avant l’arrivée', content: "Attestation logement, RC, éventuellement assurance voyage pour le visa." },
        { title: 'Après l’arrivée', content: "Inscription à la sécu étudiante (selon statut), mutuelle recommandée." },
      ],
      premiumSections: [
        { title: 'Guides pratiques', bullets: ['Comparatif assurances', 'Courriers types', 'Check d’installation', 'Conseils budget'] },
      ],
      premiumRich: [
        {
          title: 'Combo minimal légal + utile',
          content:
            "• **Assurance logement** + **responsabilité civile** dès l’entrée.\n" +
            "• Couverture **santé** : sécu étudiante + mutuelle adaptée."
        },
        {
          title: 'Démarches ANEF & sécu',
          content:
            "• Garde **numérique** de toutes tes attestations (ANEF, sécu, mutuelle) + dates de validité."
        }
      ],
      premiumDownloads: [
        { label: 'Checklist installation (pdf)', href: '/premium/assurances/check-installation.pdf' },
        { label: 'Courriers types (docx)', href: '/premium/assurances/courriers.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 13) Premier CV
    // ---------------------------------------------------------------------------
    {
      slug: 'cv-etudiant-modele',
      tag: 'Outils',
      title: 'Premier CV pour étude en France : modèle commenté',
      excerpt: 'Rubriques, erreurs fréquentes, exemple annoté.',
      cover: '/covers/cv_sooro.png',
      intro:
        "Un CV français est synthétique (1 page), centré sur compétences/expériences utiles pour la formation visée.",
      freeSections: [
        { title: 'Sections', content: "En-tête, formation, compétences, expériences/projets, langues, centres d’intérêt." },
        { title: 'Erreurs', content: "CV trop long, informations inutiles, fautes, photo inadaptée." },
      ],
      premiumSections: [
        { title: 'Modèles', bullets: ['Template sobre FR/EN', 'Version stage/alternance', 'Exemple annoté', 'Pack icônes'] },
      ],
      premiumRich: [
        {
          title: 'CV académique → formation',
          content:
            "• Mets **d’abord** la formation visée (intitulé officiel) en **objectif**.\n" +
            "• Compétences = **modules/logiciels** du programme ciblé."
        },
        {
          title: 'Micro-projets qui comptent',
          content:
            "• Projet de cours/stage : **contexte → action → résultat** en 2 lignes."
        }
      ],
      premiumDownloads: [
        { label: 'Templates FR/EN (zip)', href: '/premium/cv/templates.zip' },
        { label: 'Exemple annoté (pdf)', href: '/premium/cv/exemple-annote.pdf' },
        { label: 'Pack icônes (png)', href: '/premium/cv/icons.zip' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 14) Emails de relance
    // ---------------------------------------------------------------------------
    {
      slug: 'emails-relance',
      tag: 'Outils',
      title: 'Emails types pour relancer école/consulat',
      excerpt: 'Modèles pros, ton, timing & bonnes pratiques.',
      cover: '/covers/relance_mail.png',
      intro:
        "Des relances courtes et polies font avancer ton dossier. Utilise un objet clair et un contexte précis.",
      freeSections: [
        { title: 'Timing', content: "Relance 5–10 jours ouvrés après la première demande, puis espacements raisonnables." },
        { title: 'Structure', content: "Objet précis, rappel du contexte, demande claire, remerciements, signature complète." },
      ],
      premiumSections: [
        { title: 'Modèles prêts', bullets: ['Relance école', 'Relance consulat/TLS', 'Escalade polie', 'Réponse à informations manquantes'] },
      ],
      premiumRich: [
        {
          title: 'Tri des cas d’usage',
          content:
            "• **École** (dossier en cours / pièce manquante / décision tardive).\n" +
            "• **TLS/consulat** (créneaux / suivi / escalade mesurée)."
        },
        {
          title: 'Objets qui marchent',
          content:
            "• `[Nom – Candidature n°X] Demande de mise à jour`\n" +
            "• `Suivi dépôt VLS-TS – RDV et pièces`"
        }
      ],
      premiumDownloads: [
        { label: 'Pack de mails (docx)', href: '/premium/emails/pack-relances.docx' },
        { label: 'Objets & formules (pdf)', href: '/premium/emails/objets-formules.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 15) Cohérence de projet
    // ---------------------------------------------------------------------------
    {
      slug: 'coherence-projet',
      tag: 'Conseils',
      title: 'Prouver la cohérence de ton projet d’études',
      excerpt: 'Articuler parcours, formation et objectif pro.',
      cover: '/covers/projet.png',
      intro:
        "La cohérence est le fil rouge qui rassure les évaluateurs : admissibilité académique + employabilité.",
      freeSections: [
        { title: 'Storyline', content: "Parcours → compétences → formation visée → objectif pro concret. Ajoute des preuves (stages, projets)." },
        { title: 'Alignement', content: "Lien entre modules du programme et compétences ciblées. Mentionne le marché/secteur visé." },
      ],
      premiumSections: [
        { title: 'Trames', bullets: ['Reprise d’études', 'Changement de filière', 'Renforcement post-licence', 'Internationalisation de profil'] },
      ],
      premiumRich: [
        {
          title: 'Carte de cohérence',
          content:
            "• Chaque **module** du programme doit pointer vers **une compétence utile** pour le **poste-cible**.\n" +
            "• Ajoute **preuves** : projet X, stage Y, certif Z."
        },
        {
          title: 'Pitch 60 secondes',
          content:
            "Contexte → déclic → formation ciblée → valeur pour l’employeur → plan à 3 ans."
        }
      ],
      premiumDownloads: [
        { label: 'Template plan de cohérence (docx)', href: '/premium/coherence/plan.docx' },
        { label: 'Carte de cohérence (pptx)', href: '/premium/coherence/map.pptx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 16) Frais de scolarité & paiements
    // ---------------------------------------------------------------------------
    {
      slug: 'frais-scolarite',
      tag: 'Finances',
      title: 'Frais de scolarité & modalités de paiement',
      excerpt: 'Acomptes, virements internationaux, justificatifs.',
      cover: '/covers/frais_scolarité.png',
      intro:
        "Anticipe les échéances : certains établissements demandent un acompte pour confirmer l’inscription.",
      freeSections: [
        { title: 'Moyens de paiement', content: "CB, virement international, plateformes dédiées, preuves à conserver (reçus, captures)." },
        { title: 'Astuce budget', content: "Planifie devises/frais bancaires, délais de transfert, et garde des marges." },
      ],
      premiumSections: [
        { title: 'Documents utiles', bullets: ['Modèle d’attestation de paiement', 'Courrier de confirmation', 'Checklist reçus', 'Tableau de suivi'] },
      ],
      premiumRich: [
        {
          title: 'Circuit de paiement sans stress',
          content:
            "• **Acompte** = preuve d’inscription rapide.\n" +
            "• Reçus **bancaires + établissement** archivés au même endroit."
        },
        {
          title: 'Change & timing',
          content:
            "• Conversions au meilleur taux (virement groupé vs. fractionné).\n" +
            "• Anticiper **jours fériés**/délais bancaires."
        }
      ],
      premiumDownloads: [
        { label: 'Attestation de paiement (docx)', href: '/premium/frais/attestation-paiement.docx' },
        { label: 'Checklist reçus (pdf)', href: '/premium/frais/check-recus.pdf' },
        { label: 'Tableau suivi paiements (xlsx)', href: '/premium/frais/suivi-paiements.xlsx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 17) Arriver en France – 30 jours
    // ---------------------------------------------------------------------------
    {
      slug: 'arriver-en-france-30-jours',
      tag: 'Vie étudiante',
      title: 'Arriver en France : les 30 premiers jours',
      excerpt: 'OFII/ANEF, banque, téléphone, logement — par priorité.',
      cover: '/covers/arrive_france.png',
      intro:
        "Ces démarches débloquent ta vie pratique : validation VLS-TS, compte bancaire, forfait mobile, assurances, logement.",
      freeSections: [
        { title: 'Priorités J+7', content: "Validation VLS-TS, ouverture bancaire, forfait mobile, assurance logement." },
        { title: 'Avant J+30', content: "CAF (selon cas), inscription sécu, mutuelle, carte de transport, titres de séjour si besoin." },
      ],
      premiumSections: [
        { title: 'Checklist complète', bullets: ['Séquence par semaine', 'Liens utiles', 'Docs à prévoir', 'Rappels automatiques (modèle)'] },
      ],
      premiumRich: [
        {
          title: 'Semaine 1 (administratif)',
          content:
            "• **ANEF** : validation VLS-TS.\n" +
            "• Banque + forfait mobile + assurances logement/RC."
        },
        {
          title: 'Semaine 2–4 (confort)',
          content:
            "• Sécu étudiante, mutuelle, CAF (selon cas), transport, associations étudiantes."
        }
      ],
      premiumDownloads: [
        { label: 'Checklist J+30 (pdf)', href: '/premium/j30/checklist-j30.pdf' },
        { label: 'Liens utiles (pdf)', href: '/premium/j30/liens-utiles.pdf' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 18) FAQ 50 questions
    // ---------------------------------------------------------------------------
    {
      slug: 'faq-50-questions',
      tag: 'Guide',
      title: 'FAQ Campus France : 50 réponses rapides',
      excerpt: 'Les doutes les plus courants expliqués simplement.',
      cover: '/covers/faq_campus.png',
      intro:
        "Une FAQ condensée pour te débloquer vite : “est-ce obligatoire ?”, “comment prouver… ?”, “et si je rate…”",
      freeSections: [
        { title: 'Bloc 1', content: "10 Q/R sur candidature & pièces." },
        { title: 'Bloc 2', content: "10 Q/R sur entretien & admissions." },
        { title: 'Bloc 3', content: "10 Q/R sur visa & arrivée." },
      ],
      premiumSections: [
        { title: 'La totale', bullets: ['50 Q/R classées', 'Liens directs officiels', 'Modèles de réponses', 'Mises à jour régulières'] },
      ],
      premiumRich: [
        {
          title: 'Q/R « must-know »',
          content:
            "• Prouver ressources sans virement mensuel ?\n" +
            "• Entretien non convoqué, que faire ?\n" +
            "• Retard réponses : visa possible ?"
        },
        {
          title: 'Sources officielles à jour',
          content:
            "Liens **France-Visas**, **Campus France**, **consulats** + notes d’interprétation terrain."
        }
      ],
      premiumDownloads: [
        { label: 'FAQ complète (pdf)', href: '/premium/faq/faq-50.pdf' },
        { label: 'Modèles de réponses (docx)', href: '/premium/faq/modeles-reponses.docx' }
      ]
    },
  
    // ---------------------------------------------------------------------------
    // 19) Simulation entretien (pack)
    // ---------------------------------------------------------------------------
    {
      slug: 'simulation-entretien-campus-france',
      tag: 'Entretien',
      title: 'Prépare ton entretien Campus France comme un pro',
      excerpt:
        'Rassure-toi : nos simulations et exemples concrets te guideront pas à pas. Jusqu’à 5 entretiens types avec retours personnalisés.',
      cover: '/covers/questions.png',
      intro:
        "L’entretien Campus France n’est pas un examen, mais une conversation pour vérifier la cohérence de ton projet. Avec un peu de préparation, tu peux le réussir haut la main. Voici tout ce qu’il faut savoir, et comment notre équipe peut t’aider à t’entraîner.",
      freeSections: [
        { title: 'Comprendre les attentes du conseiller', content: "Le but est de confirmer la cohérence de ton projet d’études : motivations, choix du programme, financement, logement et préparation linguistique. L’agent évalue ta clarté, ta sincérité et ton autonomie." },
        { title: 'Structure d’un bon entretien', content: "1️⃣ Présentation rapide → 2️⃣ Pourquoi études/France → 3️⃣ Cohérence & objectif pro → 4️⃣ Vie étudiante & autonomie → 5️⃣ Conclusion polie." },
        { title: 'Questions les plus fréquentes', content: "• Pourquoi la France ? • Pourquoi ce programme ? • Comment finances-tu tes études ? • Projets après le diplôme ? • Logement ?"},
      ],
      premiumSections: [
        { title: 'Pack simulation entretien', bullets: [
          '5 simulations (visio ou écrites)',
          'Questions types réelles',
          'Corrections et feedback personnalisés',
          'Exemples de réponses réussies',
          'Grille d’évaluation',
          'Trame de préparation'
        ]},
        { title: 'Guides exclusifs', bullets: [
          'Plan de réponse en 3 étapes',
          'Scripts d’introduction/conclusion',
          'Check langage corporel',
          'Révision express avant entretien'
        ]}
      ],
      premiumRich: [
        {
          title: 'Banque de 60 questions classées',
          content:
            "Motivations, programme, cohérence, financements, logement, autonomie. **Exemples de bonnes formulations** inclus."
        },
        {
          title: 'Scorecards & feedback',
          content:
            "Grille à 5 critères (clarté, cohérence, réalisme, ton, preuves). **Conseils actionnables** par critère."
        }
      ],
      premiumDownloads: [
        { label: 'Banque de questions (pdf)', href: '/premium/sim/banque-questions.pdf' },
        { label: 'Grille d’évaluation (pdf)', href: '/premium/sim/grille.pdf' },
        { label: 'Trame de préparation (docx)', href: '/premium/sim/trame.docx' }
      ]
    },
  ]
  
  // liste “lite” pour les grilles
  export const ARTICLES_LITE: ArticleLite[] = ARTICLES.map(
    ({ freeSections, premiumSections, premiumRich, premiumDownloads, intro, ...rest }) => rest
  )
  
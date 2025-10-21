// app/sitemap.ts
import type { MetadataRoute } from "next";

// TODO: si tu préfères le sous-domaine "www", remplace la ligne ci-dessous par:
// const base = "https://www.soorocampus.com";
const base = "https://soorocampus.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ---------- Routes statiques publiques détectées ----------
  const staticUrls: MetadataRoute.Sitemap = [
    // Accueil
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },

    // Marketing group (les parenthèses ne sont PAS dans l'URL)
    { url: `${base}/a-propos`,        lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/contact`,         lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/formules`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/ressources`,      lastModified: now, changeFrequency: "weekly",  priority: 0.7 },

    // Légal
    { url: `${base}/conditions`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/confidentialite`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/mentions-legales`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },

    // Auth
    { url: `${base}/auth/login`,    lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/auth/register`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/auth/forgot`,   lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/auth/reset`,    lastModified: now, changeFrequency: "yearly", priority: 0.1 },

    // Espace appli (si public/SEO—sinon tu peux les retirer)
    { url: `${base}/paiements`,         lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${base}/paiements/success`, lastModified: now, changeFrequency: "yearly",  priority: 0.1 },
    { url: `${base}/messages`,          lastModified: now, changeFrequency: "weekly",  priority: 0.2 },
    { url: `${base}/documents`,         lastModified: now, changeFrequency: "weekly",  priority: 0.2 },
    { url: `${base}/mon-dossier`,       lastModified: now, changeFrequency: "weekly",  priority: 0.4 },
    { url: `${base}/premium`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/profil`,            lastModified: now, changeFrequency: "monthly", priority: 0.1 },
    { url: `${base}/tableau-de-bord`,   lastModified: now, changeFrequency: "daily",   priority: 0.4 },

    // Conseils (listing)
    { url: `${base}/conseils`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // ---------- Dynamiques : ajoute tes slugs ici si tu en as ----------
  // Exemples : remplis ces tableaux depuis une DB, fichiers MDX, etc.
  const conseilsSlugs: string[] = [];          // ex: ["lettre-de-motivation", "erreurs-campus-france"]
  const marketingRessourcesSlugs: string[] = []; // ex: ["procedure-campus-france", "checklist-documents"]

  const dynamicUrls: MetadataRoute.Sitemap = [
    ...conseilsSlugs.map((slug) => ({
      url: `${base}/conseils/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...marketingRessourcesSlugs.map((slug) => ({
      url: `${base}/ressources/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // ---------- Retourner l'ensemble ----------
  return [...staticUrls, ...dynamicUrls];
}

// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://soorocampus.com"),
  title: {
    default: "Sooro Campus – Réussis ton projet Campus France",
    template: "%s | Sooro Campus",
  },
  description:
    "Guides pas à pas, modèles, checklists, coaching et suivi de dossier Campus France jusqu’à validation.",
  openGraph: {
    type: "website",
    url: "https://soorocampus.com/",
    siteName: "Sooro Campus",
    title: "Sooro Campus – Réussis ton projet Campus France",
    description:
      "Guides, modèles, checklists et accompagnement expert pour réussir Campus France.",
    images: [{ url: "/og/og-cover.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sooro Campus – Réussis ton projet Campus France",
    description:
      "Guides, modèles et coaching jusqu’à la validation du dossier.",
    images: ["/og/og-cover.jpg"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

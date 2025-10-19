import "./globals.css";                // 1️⃣ ton CSS global
import { Inter } from "next/font/google"; // 2️⃣ importer la police
import type { Metadata } from "next";     // 3️⃣ types Next.js

// 4️⃣ initialiser la police
const inter = Inter({ subsets: ["latin"] });

// 5️⃣ métadonnées de ton site
export const metadata: Metadata = {
  title: "Sooro Campus",
  description: "Portail étudiant Sooro Campus",
};

// 6️⃣ composant RootLayout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* on applique la police à tout le body */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

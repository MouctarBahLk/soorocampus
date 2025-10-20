/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  // PAS de output: 'standalone' pour Vercel !
  // Vercel gère ça automatiquement
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ TEMPORAIRE : Ignore les erreurs TypeScript pendant le build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ TEMPORAIRE : Ignore les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  // Configuration pour Netlify
  output: 'standalone',
}

module.exports = nextConfig
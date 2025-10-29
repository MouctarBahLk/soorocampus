"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HomeClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- Thèmes de couleurs par tag (Articles) ---
  const colorByTag: Record<string, { card: string; badge: string; cta: string }> = {
    Guide: {
      card: "from-blue-50 to-blue-100",
      badge: "bg-blue-100 text-blue-900 border-blue-200",
      cta: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    Checklist: {
      card: "from-teal-50 to-emerald-100",
      badge: "bg-teal-100 text-teal-900 border-teal-200",
      cta: "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100",
    },
    Conseils: {
      card: "from-amber-50 to-orange-100",
      badge: "bg-amber-100 text-amber-900 border-amber-200",
      cta: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    },
    Outils: {
      card: "from-indigo-50 to-purple-100",
      badge: "bg-indigo-100 text-indigo-900 border-indigo-200",
      cta: "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
    },
    Finances: {
      card: "from-emerald-50 to-lime-100",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
      cta: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    },
  };

  const defaultTheme = {
    card: "from-slate-50 to-white",
    badge: "bg-white/95 text-gray-700 border-gray-200",
    cta: "bg-white/80 text-blue-700 border-blue-200 hover:bg-white",
  };

  // ---------- AUTOSCROLL (section resources) ----------
  const railRef = useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf: number;
    const step = () => {
      if (!isHover) {
        rail.scrollLeft += 0.6;
        const max = rail.scrollWidth - rail.clientWidth - 1;
        if (rail.scrollLeft >= max) rail.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isHover]);

  // Données d’exemple pour les articles (remplace par tes vraies données plus tard)
  const articles = [
    {
      id: 1,
      tag: "Guide",
      title: "Procédure Campus France : le guide étape par étape",
      excerpt:
        "Du choix de la formation jusqu’au dépôt du visa, tout le process expliqué simplement.",
      image: "/covers/campus-france-guide.jpg",
      href: "/ressources/procedure-campus-france",
    },
    {
      id: 2,
      tag: "Checklist",
      title: "Documents indispensables pour ton dossier",
      excerpt:
        "La liste à jour des pièces à fournir + conseils pour éviter les refus.",
      image: "/covers/checklist-docs.jpg",
      href: "/ressources/checklist-documents",
    },
    {
      id: 3,
      tag: "Conseils",
      title: "Réussir sa lettre de motivation",
      excerpt: "Structure, ton, erreurs à éviter et exemples commentés.",
      image: "/covers/lettre-motivation.jpg",
      href: "/ressources/lettre-de-motivation",
    },
    {
      id: 4,
      tag: "Outils",
      title: "Modèles & templates téléchargeables",
      excerpt: "CV, LM, mails types, planning de dépôt… prêts à être utilisés.",
      image: "/covers/templates.jpg",
      href: "/ressources/modeles-templates",
    },
    {
      id: 5,
      tag: "Finances",
      title: "Budget & preuve de ressources",
      excerpt:
        "Comment préparer la preuve financière et éviter les rejets au consulat.",
      image: "/covers/finances.jpg",
      href: "/ressources/preuve-de-ressources",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo_sooro.png"
                alt="Sooro Campus"
                className="h-14 w-14 rounded-full object-cover"
              />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Sooro Campus
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                Services
              </a>
              <a
                href="#resources"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                Articles & ressources
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                Comment ça marche
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                Tarifs
              </a>
              <Link
                href="/aide-inscription"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                aide
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-700/30"
              >
                S&apos;inscrire gratuitement
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3">
              <a
                href="#features"
                className="block text-gray-600 hover:text-blue-700 font-medium"
              >
                Services
              </a>
              <a
                href="#resources"
                className="block text-gray-600 hover:text-blue-700 font-medium"
              >
                Articles & ressources
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-600 hover:text-blue-700 font-medium"
              >
                Comment ça marche
              </a>
              <a
                href="#pricing"
                className="block text-gray-600 hover:text-blue-700 font-medium"
              >
                Tarifs
              </a>
              <Link
                href="/aide-inscription"
                className="text-gray-600 hover:text-blue-700 font-medium transition"
              >
                aide
              </Link>
              <Link
                href="/auth/login"
                className="block text-gray-600 hover:text-blue-700 font-medium"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="block bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold text-center"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm mb-6 animate-fadeInUp">

                Votre réussite commence ici
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '100ms' }}>

                Réussis ton projet <span className="text-blue-700">Campus France</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>

                Accompagnement personnalisé, suivi de dossier en temps réel et
                conseils d&apos;experts pour concrétiser tes études en France.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <Link
                  href="/auth/register"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl shadow-blue-700/30 transform hover:scale-105 text-center"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="#how-it-works"
                  className="border-2 border-gray-300 hover:border-blue-700 text-gray-700 hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 text-center"
                >
                  Découvrir nos services
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-8">
                <div>{/* métriques masquées */}</div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 shadow-2xl flex items-center justify-center">
                <img
                  src="/Sooro_Campus.png"
                  alt="Guide Campus France - Sooro Campus"
                  className="w-full h-auto rounded-2xl object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Sooro Campus ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour t&apos;accompagner à chaque étape de ton projet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Suivi de dossier en temps réel</h3>
              <p className="text-gray-600">
                Suis l&apos;avancement de ton dossier à chaque étape. Reçois des
                notifications instantanées sur ton statut.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Accompagnement personnalisé</h3>
              <p className="text-gray-600">
                Des experts dédiés t&apos;accompagnent tout au long de ton parcours
                avec des conseils sur mesure.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Plateforme intuitive</h3>
              <p className="text-gray-600">
                Interface simple et claire. Upload tes documents, communique
                avec l&apos;équipe, tout en un seul endroit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources / Articles Section */}
      <section id="resources" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Ressources & Conseils</h2>
              <p className="text-gray-600 mt-1">
                Des contenus pratiques pour t&apos;aider de A à Z — nouveaux articles
                chaque semaine.
              </p>
            </div>
            <Link
              href="/ressources"
              className="hidden md:inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
            >
              Voir tout
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div
              ref={railRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              {/* Article 1 - Guide */}
              <article className="min-w-[300px] max-w-[340px] snap-start group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
                  alt="Campus France"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Default State */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 w-fit">
                    Guide
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug line-clamp-2">
                    Procédure Campus France
                  </h3>
                  <p className="text-white/80 text-xs mt-2 line-clamp-2">
                    Du choix de la formation au dépôt du visa
                  </p>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div>
                    <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3">
                      Guide
                    </span>
                    <h3 className="text-white text-lg font-bold leading-snug">
                      Procédure Campus France : étape par étape
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <Link href="/ressources/procedure-campus-france" className="text-white font-semibold text-sm hover:underline">
                      Lire
                    </Link>
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>

              {/* Article 2 - Checklist */}
              <article className="min-w-[300px] max-w-[340px] snap-start group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
                  alt="Checklist"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Default State */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 w-fit">
                    Checklist
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug line-clamp-2">
                    Documents indispensables
                  </h3>
                  <p className="text-white/80 text-xs mt-2 line-clamp-2">La liste à jour des pièces à fournir</p>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div>
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3">
                      Checklist
                    </span>
                    <h3 className="text-white text-lg font-bold leading-snug">Documents indispensables pour ton dossier</h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <Link href="/ressources/checklist-documents" className="text-white font-semibold text-sm hover:underline">
                      Lire
                    </Link>
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>

              {/* Article 3 - Conseils */}
              <article className="min-w-[300px] max-w-[340px] snap-start group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
                  alt="Lettre"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Default State */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 w-fit">
                    Conseils
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug line-clamp-2">Réussir sa lettre de motivation</h3>
                  <p className="text-white/80 text-xs mt-2 line-clamp-2">Structure, ton, erreurs à éviter</p>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div>
                    <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3">
                      Conseils
                    </span>
                    <h3 className="text-white text-lg font-bold leading-snug">Réussir sa lettre de motivation</h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <Link href="/ressources/lettre-de-motivation" className="text-white font-semibold text-sm hover:underline">
                      Lire
                    </Link>
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>

              {/* Article 4 - Outils */}
              <article className="min-w-[300px] max-w-[340px] snap-start group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                  alt="Modèles"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Default State */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 w-fit">
                    Outils
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug line-clamp-2">Modèles & templates</h3>
                  <p className="text-white/80 text-xs mt-2 line-clamp-2">CV, LM, mails types prêts à utiliser</p>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div>
                    <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3">
                      Outils
                    </span>
                    <h3 className="text-white text-lg font-bold leading-snug">Modèles & templates téléchargeables</h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <Link href="/ressources/modeles-templates" className="text-white font-semibold text-sm hover:underline">
                      Lire
                    </Link>
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>

              {/* Article 5 - Finances */}
              <article className="min-w-[300px] max-w-[340px] snap-start group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-96">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-430f63602d4b?w=400&h=300&fit=crop"
                  alt="Finances"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Default State */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3 w-fit">
                    Finances
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug line-clamp-2">Budget & preuve de ressources</h3>
                  <p className="text-white/80 text-xs mt-2 line-clamp-2">Préparer la preuve financière</p>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div>
                    <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3">
                      Finances
                    </span>
                    <h3 className="text-white text-lg font-bold leading-snug">Budget & preuve de ressources</h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <Link href="/ressources/preuve-de-ressources" className="text-white font-semibold text-sm hover:underline">
                      Lire
                    </Link>
                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>

              {/* Carte marketing Premium */}
              <div className="min-w-[300px] max-w-[340px] snap-start bg-gradient-to-br from-blue-950 to-blue-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all group transform hover:-translate-y-2 h-96">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-3">⭐ Premium</p>
                  <h3 className="text-xl font-bold leading-snug mb-4">
                    Accède à la bibliothèque complète + modèles & suivi
                  </h3>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>Conseils détaillés pour chaque étape</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>Modèles (CV, LM, emails) & checklists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">✓</span>
                      <span>Vérification de documents</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4">
                  <Link
                    href="/auth/register"
                    className="block w-full text-center bg-white text-blue-900 font-bold py-3 rounded-xl hover:bg-blue-50 transition-all transform group-hover:scale-105"
                  >
                    Créer un compte
                  </Link>
                  <p className="text-xs text-blue-300 mt-2 text-center">Paiement après inscription</p>
                </div>
              </div>
            </div>

            {/* CTA secondaire */}
            <div className="mt-8 border border-blue-100 bg-blue-50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-blue-900">
                Tu veux qu&apos;on s&apos;occupe de tout (création de compte, dépôt du
                dossier, suivi) ? Notre équipe t&apos;accompagne jusqu&apos;à la
                validation.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-800"
              >
                Démarrer mon accompagnement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm mb-6">
              Le processus en 3 étapes
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ton parcours vers le succès, simplifié et guidé étape par étape
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Ligne de connexion (desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-blue-400 to-transparent" />

            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mt-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Inscris-toi gratuitement</h3>
                  <p className="text-gray-600">
                    Crée ton compte en 2 minutes. Aucune carte bancaire requise pour commencer.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accès immédiat aux 18+ guides
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Procédure Campus France A→Z
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mt-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Prépare ton dossier</h3>
                  <p className="text-gray-600">
                    Lis les guides, comprends chaque étape, utilise nos ressources pour bien construire ton projet.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Conseils d&apos;experts
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Progression à ton rythme
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300">
                  ✓
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mt-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Suis ton avancement</h3>
                  <p className="text-gray-600">
                    Reçois les mises à jour en temps réel et communique avec notre équipe via la messagerie.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Notifications en temps réel
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Support dédié
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6 text-lg">Prêt à commencer ?</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 duration-200 shadow-lg hover:shadow-xl"
            >
              Créer un compte gratuit
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm mb-6">
              Deux façons de réussir
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Choisis ce qui te correspond</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gratuit ou avec accompagnement expert — dans les deux cas, tu as les meilleures ressources
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Gratuit */}
            <div className="group rounded-3xl border-2 border-gray-200 p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl" />

              <div className="relative mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Accès Gratuit</h3>
                <p className="text-gray-600 text-lg">Pour bien préparer ton dossier</p>
              </div>

              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-4">Tu reçois :</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">18+ guides pratiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Procédure Campus France A→Z</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Conseils d&apos;experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Accès à la communauté</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowPricingModal(true)}
                className="relative w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                Créer mon compte gratuit
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">En 2 minutes • Sans carte bancaire</p>
            </div>

            {/* Plan Accompagnement */}
            <div className="group rounded-3xl border-3 border-blue-600 p-8 pt-12 bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-visible md:overflow-hidden">

              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-3xl" />

              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                  ⭐ Plus complet
                </div>
              </div>


              <div className="relative mb-8 mt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Avec Accompagnement</h3>
                <p className="text-gray-600 text-lg">Pour maîtriser chaque étape</p>
              </div>

              {/* Prix floutté stylisé */}
              <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-6 mb-8 border border-amber-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-3xl font-bold text-gray-400 blur-sm">Tarif spécial</p>
                <p className="text-gray-500 text-sm mt-1 blur-sm">Flexible selon tes besoins</p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white/90 px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-700">Accès illimité</p>
                    <p className="text-xs text-gray-600">+ Support permanent</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-4">Tu reçois tout du gratuit, plus :</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">500+ modèles & checklists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">5 simulations d&apos;entretien</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Coaching par experts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Vérification de documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Suivi jusqu&apos;à validation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-1 font-bold" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">Garantie 100% satisfait</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition text-center text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200"
              >
                Démarrer l&apos;accompagnement
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">Support illimité jusqu&apos;à ta réussite</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Inscription Gratuite */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <button
              onClick={() => setShowPricingModal(false)}
              className="float-right text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Rejoins-nous</h2>
              <p className="text-gray-600 mt-2">Gratuit en 2 minutes</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border border-blue-100">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>18+ guides offerts</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Procédure A→Z incluse</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Accès pour toujours</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 mb-4">
              <Link
                href="/auth/register"
                className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition text-center transform hover:scale-105 duration-200"
              >
                Créer mon compte
              </Link>
              <Link
                href="/auth/login"
                className="block w-full border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold py-3 rounded-xl transition text-center"
              >
                Déjà inscrit ?
              </Link>
            </div>

            <button
              onClick={() => setShowPricingModal(false)}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Accompagnement Payant */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="float-right text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Accompagnement Premium</h2>
              <p className="text-gray-600 mt-2">Jusqu&apos;à validation de ton dossier</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Coaching personnel</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>500+ ressources</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Suivi complet</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Garantie satisfaction</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 mb-4">
              <Link
                href="/auth/register"
                className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition text-center transform hover:scale-105 duration-200"
              >
                Créer un compte d&apos;abord
              </Link>
              <Link
                href="/auth/login"
                className="block w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl transition text-center"
              >
                Se connecter
              </Link>
            </div>

            <p className="text-center text-xs text-gray-600 px-4">
              Une fois connecté, tu pourras passer à la caisse et démarrer l&apos;accompagnement immédiatement
            </p>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition mt-4"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Prêt à démarrer ton projet ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoins des centaines d&apos;étudiants qui ont réussi leur projet Campus
            France avec Sooro Campus
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white hover:bg-gray-100 text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl transform hover:scale-105"
          >
            Créer mon compte gratuitement
          </Link>
          <p className="text-blue-200 text-sm mt-4">Aucune carte bancaire requise • Accès immédiat</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo_sooro.png" alt="Sooro Campus" className="h-14 w-14 rounded-full object-cover" />
                <span className="ml-3 text-lg font-bold text-white tracking-wide">Sooro Campus</span>
              </div>
              <p className="text-sm">Ta plateforme de confiance pour réussir ton projet Campus France.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#resources" className="hover:text-white transition">
                    Articles & ressources
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition">
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Tarifs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/conditions" className="hover:text-white transition">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="hover:text-white transition">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="hover:text-white transition">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>contact@soorocampus.com</li>
                <li>+33 7 44 28 98 10</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Sooro Campus. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

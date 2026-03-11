'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  Brain,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Zap,
  Clock,
  SmilePlus,
} from 'lucide-react';

// Hook d'animation au scroll (Intersection Observer)
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal-section ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <style jsx global>{`
        .reveal-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-delay { animation: float-delay 7s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #06c656, #fce117, #06c656);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-linear-to-br from-candlelight-50 via-white to-malachite-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-[90vh] flex items-center">
        {/* Orbes décoratives */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-125 h-125 bg-candlelight-200/40 dark:bg-candlelight-500/10 rounded-full blur-[100px] float-anim" />
          <div className="absolute -bottom-40 -left-40 w-125 h-125 bg-malachite-200/40 dark:bg-malachite-500/10 rounded-full blur-[100px] float-anim-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-candlelight-100/20 dark:bg-candlelight-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Grille de fond */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32 w-full">
          <div className="text-center">
            <RevealSection>
              <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
                <Sparkles className="w-4 h-4 text-candlelight-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Plateforme du Ministère des Solidarités et de la Santé
                </span>
              </div>
            </RevealSection>

            <RevealSection delay={100}>
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
                <span className="gradient-text">CESI</span>
                <span className="text-gray-900 dark:text-white">ZEN</span>
              </h1>
            </RevealSection>

            <RevealSection delay={200}>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 font-light">
                Votre compagnon pour une{' '}
                <span className="font-semibold text-malachite-600 dark:text-malachite-400">santé mentale</span>{' '}
                épanouie
              </p>
            </RevealSection>

            <RevealSection delay={300}>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
                Suivez vos émotions, comprenez vos tendances et prenez soin de vous
                au quotidien avec des outils simples, bienveillants et confidentiels.
              </p>
            </RevealSection>

            <RevealSection delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/inscription"
                  className="group inline-flex items-center justify-center gap-2 bg-candlelight-500 hover:bg-candlelight-400 text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-candlelight-500/30 hover:-translate-y-0.5 text-lg"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/informations"
                  className="inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  En savoir plus
                </Link>
              </div>
            </RevealSection>

            {/* Mini stats */}
            <RevealSection delay={500}>
              <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                <MiniStat icon={<Users className="w-5 h-5" />} value="100%" label="Gratuit" />
                <MiniStat icon={<Shield className="w-5 h-5" />} value="RGPD" label="Conforme" />
                <MiniStat icon={<Clock className="w-5 h-5" />} value="2 min" label="Pour commencer" />
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Séparateur vague */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" className="fill-white dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* ─── Comment ça marche ─── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 text-malachite-600 dark:text-malachite-400 font-semibold text-sm uppercase tracking-wider mb-4">
                <Zap className="w-4 h-4" />
                Simple et rapide
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Trois étapes simples pour prendre soin de votre bien-être émotionnel.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Ligne de connexion */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-linear-to-r from-candlelight-300 via-malachite-300 to-candlelight-300 dark:from-candlelight-800 dark:via-malachite-800 dark:to-candlelight-800" />

            <RevealSection delay={0}>
              <StepCard
                step={1}
                icon={<SmilePlus className="w-7 h-7" />}
                title="Identifiez votre émotion"
                description="Choisissez parmi un panel d'émotions et sous-émotions. Notez l'intensité ressentie sur une échelle de 1 à 10."
                color="candlelight"
              />
            </RevealSection>
            <RevealSection delay={150}>
              <StepCard
                step={2}
                icon={<Brain className="w-7 h-7" />}
                title="Ajoutez du contexte"
                description="Notez ce qui a déclenché cette émotion. Même quelques mots suffisent à mieux comprendre vos tendances."
                color="malachite"
              />
            </RevealSection>
            <RevealSection delay={300}>
              <StepCard
                step={3}
                icon={<TrendingUp className="w-7 h-7" />}
                title="Suivez votre évolution"
                description="Consultez vos rapports visuels pour identifier vos tendances émotionnelles sur la semaine, le mois ou l'année."
                color="candlelight"
              />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-candlelight-200/20 dark:bg-candlelight-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-malachite-200/20 dark:bg-malachite-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative">
          <RevealSection>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 text-candlelight-600 dark:text-candlelight-400 font-semibold text-sm uppercase tracking-wider mb-4">
                <Star className="w-4 h-4" />
                Fonctionnalités
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Des outils conçus pour vous accompagner au quotidien dans la gestion
                de votre bien-être émotionnel.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Journal d'émotions",
                description: "Enregistrez vos émotions quotidiennes et suivez leur évolution dans le temps grâce à un journal intime sécurisé.",
                color: 'malachite' as const,
                delay: 0,
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: 'Rapports visuels',
                description: "Visualisez vos tendances grâce à des graphiques clairs : répartition, évolution et intensité de vos émotions.",
                color: 'candlelight' as const,
                delay: 100,
              },
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: 'Ressources fiables',
                description: "Accédez à des contenus validés par des experts sur la santé mentale, la gestion du stress et le bien-être.",
                color: 'malachite' as const,
                delay: 200,
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Données protégées',
                description: "Vos données sont chiffrées et protégées conformément au RGPD. Vous gardez le contrôle total sur vos informations.",
                color: 'candlelight' as const,
                delay: 300,
              },
            ].map((feature) => (
              <RevealSection key={feature.title} delay={feature.delay}>
                <FeatureCard {...feature} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Témoignages / Social Proof ─── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 text-malachite-600 dark:text-malachite-400 font-semibold text-sm uppercase tracking-wider mb-4">
                <Heart className="w-4 h-4" />
                Pourquoi CESIZen ?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Conçu pour votre bien-être
              </h2>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Prendre conscience de ses émotions est le premier pas vers une meilleure santé mentale.",
                author: "Approche scientifique",
                detail: "Basé sur les travaux de la psychologie positive",
                delay: 0,
              },
              {
                quote: "Le simple fait de nommer une émotion réduit son intensité de 50%. C'est scientifiquement prouvé.",
                author: "Affect Labeling",
                detail: "Étude UCLA, Lieberman et al.",
                delay: 150,
              },
              {
                quote: "L'écriture expressive améliore la santé physique et mentale sur le long terme.",
                author: "Journaling thérapeutique",
                detail: "Méthode Pennebaker",
                delay: 300,
              },
            ].map((item) => (
              <RevealSection key={item.author} delay={item.delay}>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 h-full flex flex-col border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-candlelight-400 text-candlelight-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-1 italic">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.author}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{item.detail}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Checklist Section ─── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealSection>
              <div>
                <span className="inline-flex items-center gap-2 text-candlelight-600 dark:text-candlelight-400 font-semibold text-sm uppercase tracking-wider mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                  Avantages
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Une application pensée pour vous
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                  CESIZen est conçu par le Ministère des Solidarités et de la Santé
                  pour offrir un outil fiable, accessible et respectueux de votre vie privée.
                </p>
                <div className="space-y-4">
                  {[
                    'Totalement gratuit et sans publicité',
                    'Conforme RGPD — vos données vous appartiennent',
                    'Interface accessible et inclusive (RGAA)',
                    'Mode sombre pour un usage confortable',
                    'Rapports visuels pour comprendre vos tendances',
                    'Contenus validés par des professionnels de santé',
                    'Export de vos données à tout moment',
                    'Suppression de compte en un clic',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-malachite-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={200}>
              <div className="relative">
                {/* Carte décorative simulant l'app */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/30 p-8 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-candlelight-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Comment vous sentez-vous ?</p>
                      <p className="text-gray-500 text-xs">Aujourd&apos;hui à 14:30</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { emoji: '😊', label: 'Joie', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
                      { emoji: '😌', label: 'Calme', color: 'bg-blue-100 dark:bg-blue-900/30' },
                      { emoji: '😤', label: 'Colère', color: 'bg-red-100 dark:bg-red-900/30' },
                      { emoji: '😢', label: 'Triste', color: 'bg-purple-100 dark:bg-purple-900/30' },
                    ].map((e) => (
                      <div key={e.label} className={`${e.color} rounded-2xl p-3 text-center transition-transform hover:scale-105`}>
                        <span className="text-2xl block mb-1">{e.emoji}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{e.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Intensité</span>
                      <span className="text-sm font-semibold text-malachite-600 dark:text-malachite-400">7/10</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-linear-to-r from-malachite-400 to-malachite-500 rounded-full h-3" style={{ width: '70%' }} />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      &ldquo;Belle journée au travail, bonne ambiance avec l&apos;équipe...&rdquo;
                    </p>
                  </div>
                </div>

                {/* Décoration */}
                <div className="absolute -z-10 -top-6 -right-6 w-full h-full bg-linear-to-br from-candlelight-200 to-malachite-200 dark:from-candlelight-900/30 dark:to-malachite-900/30 rounded-3xl" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-malachite-500 via-malachite-600 to-malachite-700" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-candlelight-400/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-malachite-300/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <RevealSection>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-candlelight-300" />
              <span className="text-sm font-medium text-white/90">Rejoignez la communauté</span>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à prendre soin de vous ?
            </h2>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Créez votre compte en 2 minutes et commencez à suivre votre bien-être
              émotionnel. C&apos;est gratuit, confidentiel et sans engagement.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="group inline-flex items-center gap-2 bg-candlelight-500 hover:bg-candlelight-400 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-candlelight-500/30 hover:-translate-y-0.5 text-lg"
              >
                Créer mon compte
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-2xl border border-white/20 transition-all duration-300 hover:-translate-y-0.5 text-lg"
              >
                Se connecter
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Urgence Banner ─── */}
      <section className="bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium leading-relaxed">
            <span className="font-bold">En cas d&apos;urgence</span>, appelez le{' '}
            <a href="tel:3114" className="font-bold underline decoration-2 underline-offset-2 hover:text-red-900 dark:hover:text-red-200 transition-colors">
              3114
            </a>{' '}
            (numéro national de prévention du suicide) ou le{' '}
            <a href="tel:15" className="font-bold underline decoration-2 underline-offset-2 hover:text-red-900 dark:hover:text-red-200 transition-colors">
              15
            </a>{' '}
            (SAMU)
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─── Composants ─── */

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl flex items-center justify-center text-malachite-600 dark:text-malachite-400 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-bold text-gray-900 dark:text-white text-sm">{value}</p>
        <p className="text-gray-500 dark:text-gray-500 text-xs">{label}</p>
      </div>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
  color,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'malachite' | 'candlelight';
}) {
  const colors = color === 'malachite'
    ? { bg: 'bg-malachite-50 dark:bg-malachite-950/30', icon: 'text-malachite-600 dark:text-malachite-400', iconBg: 'bg-malachite-100 dark:bg-malachite-900/50', badge: 'bg-malachite-500' }
    : { bg: 'bg-candlelight-50 dark:bg-candlelight-950/30', icon: 'text-candlelight-600 dark:text-candlelight-400', iconBg: 'bg-candlelight-100 dark:bg-candlelight-900/50', badge: 'bg-candlelight-500' };

  return (
    <div className={`${colors.bg} rounded-3xl p-8 text-center relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 h-full`}>
      <div className={`${colors.badge} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg`}>
        {step}
      </div>
      <div className={`${colors.iconBg} ${colors.icon} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'malachite' | 'candlelight';
}) {
  const bgColor = color === 'malachite'
    ? 'bg-white dark:bg-gray-800/50'
    : 'bg-white dark:bg-gray-800/50';
  const iconColor = color === 'malachite'
    ? 'text-malachite-600 dark:text-malachite-400'
    : 'text-candlelight-600 dark:text-candlelight-400';
  const iconBg = color === 'malachite'
    ? 'bg-malachite-100 dark:bg-malachite-900/50'
    : 'bg-candlelight-100 dark:bg-candlelight-900/50';

  return (
    <div className={`${bgColor} rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 h-full`}>
      <div className={`${iconBg} ${iconColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

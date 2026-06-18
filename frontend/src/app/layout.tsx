import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CESIZen - Votre santé mentale",
  description:
    "Plateforme publique de gestion du stress et de suivi émotionnel. Suivez vos émotions, consultez des ressources et prenez soin de votre santé mentale.",
  icons: {
    icon: [{ url: "/dsfr/favicon/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/dsfr/favicon/favicon.ico"],
    apple: [{ url: "/dsfr/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-fr-scheme="system" suppressHydrationWarning>
      <body>
        {/* Système de Design de l'État (DSFR) — feuilles de style officielles */}
        <link rel="stylesheet" href="/dsfr/dsfr.min.css" />
        <link rel="stylesheet" href="/dsfr/utility/utility.min.css" />
        <Providers>{children}</Providers>
        {/* JS DSFR : comportements interactifs (menu, navigation, modales) */}
        <Script src="/dsfr/dsfr.module.min.js" type="module" strategy="afterInteractive" />
        <Script
          src="/dsfr/dsfr.nomodule.min.js"
          noModule
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

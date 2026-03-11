"use client";

import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Bandeau urgence */}
      <div className="bg-red-50 dark:bg-red-950/50 border-b border-red-100 dark:border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="flex items-center justify-center gap-2 text-sm text-red-700 dark:text-red-400 font-medium text-center">
            <Phone size={16} className="shrink-0" />
            En cas d&apos;urgence : 3114 (numéro national de prévention du suicide)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-bold font-display text-malachite-500">
                CESI
              </span>
              <span className="text-xl font-bold font-display text-candlelight-500">
                ZEN
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              CESIZen 2024 - Ministère des Solidarités et de la Santé
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/mentions-legales"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/contacts-urgence"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Contacts d&apos;urgence
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BarChart3,
  BookOpen,
  Home,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuthStore } from "@/lib/auth-store";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();

  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isAdmin = user?.role?.nom === "administrateur";

  const publicLinks: NavLink[] = [
    { href: "/", label: "Accueil", icon: <Home size={18} /> },
    { href: "/informations", label: "Informations", icon: <BookOpen size={18} /> },
  ];

  const authLinks: NavLink[] = [
    { href: "/journal", label: "Journal", icon: <BookOpen size={18} /> },
    { href: "/journal/rapports", label: "Rapports", icon: <BarChart3 size={18} /> },
  ];

  const adminLinks: NavLink[] = [
    { href: "/admin", label: "Admin", icon: <Settings size={18} /> },
  ];

  const navLinks = [
    ...publicLinks,
    ...(isAuthenticated ? authLinks : []),
    ...(isAdmin ? adminLinks : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="text-2xl font-bold font-display text-malachite-500">
              CESI
            </span>
            <span className="text-2xl font-bold font-display text-candlelight-500">
              ZEN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive(link.href)
                      ? "bg-candlelight-100 dark:bg-candlelight-950 text-candlelight-700 dark:text-candlelight-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-malachite-100 dark:bg-malachite-900 flex items-center justify-center">
                      <User
                        size={16}
                        className="text-malachite-600 dark:text-malachite-400"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.prenom || "Utilisateur"}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 z-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-150">
                        <Link
                          href="/profil"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Settings size={16} />
                          Mon profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          <LogOut size={16} />
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    className="px-4 py-2 text-sm font-semibold bg-candlelight-500 hover:bg-candlelight-600 text-black rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-in slide-in-from-top duration-200">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive(link.href)
                      ? "bg-candlelight-100 dark:bg-candlelight-950 text-candlelight-700 dark:text-candlelight-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User size={18} />
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-candlelight-500 hover:bg-candlelight-600 text-black transition-all duration-200"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

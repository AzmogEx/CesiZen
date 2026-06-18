"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

interface NavLink {
  href: string;
  label: string;
}

export default function Header() {
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isAdmin = user?.role?.nom === "administrateur";

  const navLinks: NavLink[] = [
    { href: "/", label: "Accueil" },
    { href: "/informations", label: "Informations" },
    { href: "/contacts-urgence", label: "Contacts d'urgence" },
    ...(isAuthenticated
      ? [
          { href: "/journal", label: "Mon journal" },
          { href: "/journal/rapports", label: "Mes rapports" },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin/dashboard", label: "Administration" }] : []),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    République
                    <br />
                    Française
                  </p>
                </div>
                <div className="fr-header__navbar">
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls="modal-menu-mobile"
                    aria-haspopup="menu"
                    id="button-menu-mobile"
                    title="Menu"
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div className="fr-header__service">
                <Link href="/" title="Accueil - CESIZen">
                  <span className="fr-header__service-title">CESIZen</span>
                </Link>
                <p className="fr-header__service-tagline">
                  Votre santé mentale — Ministère des Solidarités et de la Santé
                </p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          className="fr-btn fr-icon-account-line"
                          href="/profil"
                        >
                          {user?.prenom || "Mon profil"}
                        </Link>
                      </li>
                      <li>
                        <button
                          className="fr-btn fr-icon-logout-box-r-line"
                          onClick={() => logout()}
                        >
                          Déconnexion
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          className="fr-btn fr-icon-account-line"
                          href="/connexion"
                        >
                          Connexion
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="fr-btn fr-icon-add-line"
                          href="/inscription"
                        >
                          Créer un compte
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale (et menu mobile DSFR) */}
      <div
        className="fr-header__menu fr-modal"
        id="modal-menu-mobile"
        aria-labelledby="button-menu-mobile"
      >
        <div className="fr-container">
          <button
            className="fr-btn--close fr-btn"
            aria-controls="modal-menu-mobile"
            title="Fermer"
          >
            Fermer
          </button>
          {/* Conteneur requis par le JS DSFR (recopie des liens d'action en mobile) */}
          <div className="fr-header__menu-links"></div>
          <nav
            className="fr-nav"
            id="navigation-principale"
            role="navigation"
            aria-label="Menu principal"
          >
            <ul className="fr-nav__list">
              {navLinks.map((link) => (
                <li className="fr-nav__item" key={link.href}>
                  <Link
                    className="fr-nav__link"
                    href={link.href}
                    target="_self"
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

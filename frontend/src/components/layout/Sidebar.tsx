"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLink {
  href: string;
  label: string;
  icon: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "fr-icon-dashboard-3-line",
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: "fr-icon-user-line",
  },
  {
    href: "/admin/contenus",
    label: "Contenus",
    icon: "fr-icon-file-text-line",
  },
  {
    href: "/admin/emotions",
    label: "Émotions",
    icon: "fr-icon-heart-line",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fr-sidemenu"
      aria-labelledby="fr-sidemenu-title"
      role="navigation"
    >
      <div className="fr-sidemenu__inner">
        <button
          type="button"
          className="fr-sidemenu__btn"
          aria-controls="fr-sidemenu-wrapper"
          aria-expanded={collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          Menu d&apos;administration
        </button>
        <div
          className={`fr-collapse${collapsed ? " fr-collapse--expanded" : ""}`}
          id="fr-sidemenu-wrapper"
        >
          <div className="fr-sidemenu__title" id="fr-sidemenu-title">
            <Link href="/admin" className="fr-sidemenu__link">
              Administration CESIZen
            </Link>
          </div>
          <ul className="fr-sidemenu__list">
            {sidebarLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li className="fr-sidemenu__item" key={link.href}>
                  <Link
                    className={`fr-sidemenu__link ${link.icon} fr-link--icon-left`}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setCollapsed(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Heart,
  Menu,
  X,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: <Users size={20} />,
  },
  {
    href: "/admin/contenus",
    label: "Contenus",
    icon: <FileText size={20} />,
  },
  {
    href: "/admin/emotions",
    label: "Émotions",
    icon: <Heart size={20} />,
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
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay mobile */}
      {collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 lg:z-auto
          h-screen w-64
          bg-white dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin" className="flex items-center gap-0.5">
            <span className="text-xl font-bold font-display text-malachite-500">
              CESI
            </span>
            <span className="text-xl font-bold font-display text-candlelight-500">
              ZEN
            </span>
          </Link>
          <button
            onClick={() => setCollapsed(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setCollapsed(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive(link.href)
                    ? "bg-candlelight-100 dark:bg-candlelight-950 text-candlelight-700 dark:text-candlelight-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Administration CESIZen
          </p>
        </div>
      </aside>
    </>
  );
}

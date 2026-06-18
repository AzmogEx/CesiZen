"use client";

import React from "react";

type Scheme = "light" | "dark";

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [scheme, setScheme] = React.useState<Scheme>("light");

  React.useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute("data-fr-theme");
    setScheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-fr-theme", next);
    document.documentElement.setAttribute("data-fr-scheme", next);
    setScheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="fr-btn fr-btn--tertiary fr-btn--icon-left fr-icon-theme-fill"
        aria-label="Changer le thème"
      >
        Thème
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`fr-btn fr-btn--tertiary fr-btn--icon-left ${
        scheme === "dark" ? "fr-icon-sun-fill" : "fr-icon-moon-fill"
      }`}
      aria-label={
        scheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
      }
      title={scheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {scheme === "dark" ? "Mode clair" : "Mode sombre"}
    </button>
  );
}

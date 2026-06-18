"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

// Conteneur neutre au style DSFR (fr-card sans la structure imposée d'une carte
// éditoriale DSFR, afin de garder un conteneur générique réutilisable).
export default function Card({ children, className = "", hover = false }: CardProps) {
  const classes = [
    "app-panel",
    "fr-p-3w",
    hover ? "fr-enlarge-link" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

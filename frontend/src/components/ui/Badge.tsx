"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

// Mappe une couleur (hex) vers une variante de statut DSFR `fr-badge--*`.
// Conserve la prop `color` pour garder la même signature, mais le rendu
// utilise désormais le système de couleurs du DSFR (thème clair/sombre géré).
function badgeVariant(color: string): string {
  const c = color.toLowerCase();
  switch (c) {
    case "#22c55e":
    case "#16a34a":
    case "green":
      return "fr-badge--success";
    case "#ef4444":
    case "#dc2626":
    case "red":
      return "fr-badge--error";
    case "#f59e0b":
    case "#fce117":
    case "orange":
      return "fr-badge--warning";
    case "#3b82f6":
    case "#0ea5e9":
    case "blue":
      return "fr-badge--info";
    default:
      return "fr-badge--new";
  }
}

export default function Badge({
  children,
  color = "#fce117",
  className = "",
}: BadgeProps) {
  const classes = ["fr-badge", "fr-badge--sm", badgeVariant(color), className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}

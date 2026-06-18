"use client";

import React from "react";

type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

// Dimensions/forme selon la variante. Couleur neutre gérée en ligne pour
// rester cohérent avec le thème DSFR (sans couleur custom Tailwind).
const variantStyle: Record<SkeletonVariant, React.CSSProperties> = {
  text: { height: "1rem", width: "100%", borderRadius: "0.25rem" },
  circle: { height: "2.5rem", width: "2.5rem", borderRadius: "9999px" },
  rect: { height: "6rem", width: "100%", borderRadius: "0.25rem" },
};

export default function Skeleton({
  className = "",
  variant = "text",
}: SkeletonProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        ...variantStyle[variant],
        backgroundColor: "var(--background-contrast-grey)",
        opacity: 0.6,
        animation: "fr-skeleton-pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

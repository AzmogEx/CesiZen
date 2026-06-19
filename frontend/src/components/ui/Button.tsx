"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

// Mappe les variantes internes sur les classes du Système de Design de l'État (DSFR).
const variantClasses: Record<ButtonVariant, string> = {
  primary: "",
  secondary: "fr-btn--secondary",
  outline: "fr-btn--secondary",
  ghost: "fr-btn--tertiary-no-outline",
  danger: "app-btn--danger",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "fr-btn--sm",
  md: "",
  lg: "fr-btn--lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = [
    "fr-btn",
    variantClasses[variant],
    sizeClasses[size],
    loading ? "fr-btn--icon-left fr-icon-refresh-line" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {children}
    </button>
  );
}

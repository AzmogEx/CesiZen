"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({
  children,
  color = "#fce117",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs font-medium
        transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {children}
    </span>
  );
}

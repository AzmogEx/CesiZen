"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        rounded-2xl shadow-sm
        border border-gray-100 dark:border-gray-800
        p-6
        transition-all duration-200
        ${hover ? "hover:shadow-lg hover:-translate-y-0.5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

"use client";

import React from "react";

type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circle: "h-10 w-10 rounded-full",
  rect: "h-24 w-full rounded-xl",
};

export default function Skeleton({
  className = "",
  variant = "text",
}: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200 dark:bg-gray-700
        ${variantClasses[variant]}
        ${className}
      `}
    />
  );
}

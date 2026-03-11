"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...inputProps
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-candlelight-500 focus:border-candlelight-500
            transition-all duration-200
            px-4 py-2.5 text-base
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${className}
          `}
          {...inputProps}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

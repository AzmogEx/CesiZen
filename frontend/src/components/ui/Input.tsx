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
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`fr-input-group${error ? " fr-input-group--error" : ""}`}>
      {label && (
        <label className="fr-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={icon ? "fr-input-wrap" : undefined}>
        {icon && <span aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          className={`fr-input${error ? " fr-input--error" : ""} ${className}`.trim()}
          aria-describedby={errorId}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={errorId} className="fr-error-text">
          {error}
        </p>
      )}
    </div>
  );
}

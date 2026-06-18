"use client";

import React, { useEffect, useCallback } from "react";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
}

const maxWidthBySize: Record<ModalSize, string> = {
  sm: "480px",
  md: "672px",
  lg: "896px",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Overlay React maîtrisé (pas le JS DSFR) : fond assombri visible, fermeture
  // au clic extérieur / Échap / bouton. Look DSFR via les classes fr-modal__*.
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "2rem 1rem",
        background: "rgba(22, 22, 22, 0.64)",
      }}
    >
      <div
        className="fr-modal__body"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: maxWidthBySize[size],
          background: "var(--background-default-grey, #fff)",
          borderRadius: "0.25rem",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.32)",
          padding: "1.5rem",
        }}
      >
        <div className="fr-modal__header">
          <button
            type="button"
            className="fr-btn--close fr-btn"
            aria-label="Fermer"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <div className="fr-modal__content">
          {title && <h1 className="fr-modal__title">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
}

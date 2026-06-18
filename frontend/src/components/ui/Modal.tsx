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

// Largeur de la colonne DSFR selon la taille demandée.
const sizeColClasses: Record<ModalSize, string> = {
  sm: "fr-col-12 fr-col-md-4",
  md: "fr-col-12 fr-col-md-6",
  lg: "fr-col-12 fr-col-md-8",
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
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // L'ouverture/fermeture est pilotée par React (isOpen/onClose), on applique
  // donc la structure et les classes visuelles DSFR sans le JS d'ouverture DSFR.
  return (
    <dialog
      className="fr-modal fr-modal--opened"
      aria-modal="true"
      role="dialog"
      open
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "block",
        background: "transparent",
        border: "none",
        maxWidth: "none",
        maxHeight: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className={sizeColClasses[size]}>
            <div className="fr-modal__body">
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
        </div>
      </div>
    </dialog>
  );
}

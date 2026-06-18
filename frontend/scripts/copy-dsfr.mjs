// Copie les assets du Système de Design de l'État (DSFR) vers public/dsfr,
// pour les servir en statique (CSS, JS, polices Marianne, icônes).
// Lancé automatiquement après `npm install` (script postinstall).
import { cpSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "@codegouvfr", "react-dsfr", "dsfr");
const dest = join(root, "public", "dsfr");

if (!existsSync(src)) {
  console.warn("[copy-dsfr] Source DSFR introuvable, étape ignorée.");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("[copy-dsfr] Assets DSFR copiés vers public/dsfr.");

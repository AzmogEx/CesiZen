#!/usr/bin/env python3
"""
Génère les schémas du dossier Bloc 3 (Déployer et sécuriser) — CESIZen.
Sortie : ./assets_bloc3/*.png  (réutilisés dans le .docx et le .pptx)
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.font_manager as fm

# ─── Charte CESIZen ───────────────────────────────────────────────
GREEN   = "#06C656"
GREEN_D = "#049641"
BLUE    = "#004682"
BLUE_L  = "#E6F0FA"
GREY_D  = "#232323"
GREY    = "#6E6E6E"
WHITE   = "#FFFFFF"
INK     = "#23232D"
RED      = "#C8102E"
ORANGE   = "#E4801C"
YELLOW_A = "#F0C808"

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "assets_bloc3")
os.makedirs(OUT, exist_ok=True)

plt.rcParams["font.family"] = "DejaVu Sans"


def box(ax, x, y, w, h, text, fc, ec=None, tc="white", fs=10, bold=True, radius=0.02):
    ec = ec or fc
    p = FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.005,rounding_size={radius}",
                       fc=fc, ec=ec, lw=1.4, mutation_aspect=1)
    ax.add_patch(p)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            color=tc, fontsize=fs, fontweight="bold" if bold else "normal", zorder=5)


def arrow(ax, x1, y1, x2, y2, color=GREY_D, style="-|>", lw=1.8, ls="-"):
    a = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=16,
                        color=color, lw=lw, linestyle=ls, zorder=1)
    ax.add_patch(a)


# ══════════════════════════════════════════════════════════════════
# 1. ARCHITECTURE DE DÉPLOIEMENT + CHAÎNE CI/CD
# ══════════════════════════════════════════════════════════════════
def diagram_deploiement():
    fig, ax = plt.subplots(figsize=(12, 6.6))
    ax.set_xlim(0, 12); ax.set_ylim(0, 6.6); ax.axis("off")

    ax.text(6, 6.35, "Chaîne de déploiement CESIZen — du poste développeur à la production",
            ha="center", fontsize=13, fontweight="bold", color=BLUE)

    # --- Bandeau des 3 environnements ---
    envs = [
        (0.3,  "DÉVELOPPEMENT", "Poste local", GREEN,
         ["Docker Compose (dev)", "PostgreSQL 16 + Redis 7", "Hot-reload back & front", "APP_DEBUG=true"]),
        (4.15, "TEST / INTÉGRATION", "Gitea Actions (CI)", ORANGE,
         ["Runner conteneurisé", "Base SQLite en mémoire", "29 tests automatisés", "Lint (Pint / ESLint)"]),
        (8.0,  "PRODUCTION", "Coolify (PaaS)", BLUE,
         ["Docker Compose (prod)", "HTTPS / TLS (reverse proxy)", "Secrets générés hors dépôt", "Health checks + restart"]),
    ]
    for x, titre, sous, col, items in envs:
        box(ax, x, 3.4, 3.55, 2.2, "", BLUE_L, ec=col, tc=INK)
        box(ax, x, 5.0, 3.55, 0.6, titre, col, fs=11)
        ax.text(x + 1.775, 4.75, sous, ha="center", fontsize=9.5, style="italic", color=GREY_D)
        for i, it in enumerate(items):
            ax.text(x + 0.15, 4.45 - i * 0.27, "• " + it, ha="left", fontsize=8.5, color=INK)

    arrow(ax, 3.95, 4.5, 4.1, 4.5, color=GREY_D)
    arrow(ax, 7.8, 4.5, 7.95, 4.5, color=GREY_D)

    # --- Chaîne CI/CD (bas) ---
    ax.text(6, 2.9, "Flux d'intégration & de livraison continues", ha="center",
            fontsize=11, fontweight="bold", color=GREEN_D)
    steps = [
        (0.3,  "git push\n(Gitea)", GREY_D),
        (2.55, "Gitea Actions\ndéclenché", ORANGE),
        (4.8,  "Build + Tests\n(29 tests)", ORANGE),
        (7.05, "Webhook\nCoolify", BLUE),
        (9.3,  "Build images\n+ déploiement", BLUE),
    ]
    for x, t, col in steps:
        box(ax, x, 1.3, 2.05, 1.05, t, col, fs=9.5)
    for i in range(len(steps) - 1):
        arrow(ax, steps[i][0] + 2.05, 1.82, steps[i + 1][0], 1.82, color=GREEN_D, lw=2)

    box(ax, 9.3, 0.15, 2.05, 0.8, "cesizen.cleanows.fr\napi.cesizen.cleanows.fr", GREEN, fs=8)
    arrow(ax, 10.32, 1.3, 10.32, 0.95, color=GREEN_D, lw=2)
    ax.text(0.3, 0.55, "Rollback : redéploiement de la version\nGit précédente (tag) en 1 clic Coolify.",
            ha="left", fontsize=8, color=GREY, style="italic")

    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "archi_deploiement.png"), dpi=170, bbox_inches="tight")
    plt.close(fig)


# ══════════════════════════════════════════════════════════════════
# 2. MATRICE DE RISQUES (criticité = gravité × probabilité)
# ══════════════════════════════════════════════════════════════════
def diagram_matrice_risques():
    fig, ax = plt.subplots(figsize=(11, 6.8))
    n = 5
    for g in range(n):          # gravité (y)
        for p in range(n):      # probabilité (x)
            crit = (g + 1) * (p + 1)
            if crit <= 4:
                c = "#2E9E4F"
            elif crit <= 9:
                c = "#F0C808"
            elif crit <= 14:
                c = "#E4801C"
            else:
                c = "#C8102E"
            ax.add_patch(plt.Rectangle((p, g), 1, 1, fc=c, ec="white", lw=2, alpha=0.9))
            ax.text(p + 0.5, g + 0.5, str(crit), ha="center", va="center",
                    fontsize=9, color="white", fontweight="bold", alpha=0.6)

    # Positionnement des risques réels du projet (P sur 1..5, G sur 1..5)
    risques = [
        ("R1", 2, 4),   # Fuite données de santé (Art.9)
        ("R2", 3, 3),   # Injection / XSS
        ("R3", 2, 3),   # Compromission compte admin
        ("R4", 3, 2),   # DDoS / indisponibilité
        ("R5", 2, 2),   # Perte de données (sauvegarde)
        ("R6", 4, 2),   # Dépendances vulnérables
        ("R7", 3, 4),   # Absence de chiffrement au repos
        ("R8", 2, 1),   # Erreur humaine déploiement
    ]
    for nom, p, g in risques:
        ax.plot(p - 0.5, g - 0.5, "o", ms=22, mfc="white", mec=INK, mew=1.8, zorder=6)
        ax.text(p - 0.5, g - 0.5, nom, ha="center", va="center", fontsize=8.5,
                fontweight="bold", color=INK, zorder=7)

    ax.set_xlim(0, n); ax.set_ylim(0, n)
    ax.set_xticks([i + 0.5 for i in range(n)])
    ax.set_yticks([i + 0.5 for i in range(n)])
    ax.set_xticklabels(["Très faible", "Faible", "Moyenne", "Forte", "Très forte"], fontsize=9)
    ax.set_yticklabels(["Mineure", "Modérée", "Grave", "Critique", "Catastroph."], fontsize=9)
    ax.set_xlabel("Probabilité →", fontsize=11, fontweight="bold", color=BLUE)
    ax.set_ylabel("Gravité →", fontsize=11, fontweight="bold", color=BLUE)
    ax.set_title("Matrice de criticité des risques CESIZen (criticité = gravité × probabilité)",
                 fontsize=12.5, fontweight="bold", color=BLUE, pad=12)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.tick_params(length=0)

    legende = ("R1 Fuite de données de santé   R2 Injection SQL/XSS   R3 Compromission compte admin   "
               "R4 DDoS / indisponibilité\nR5 Perte de données   R6 Dépendances vulnérables   "
               "R7 Absence de chiffrement au repos   R8 Erreur humaine de déploiement")
    fig.text(0.5, -0.02, legende, ha="center", fontsize=8.3, color=GREY_D)

    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "matrice_risques.png"), dpi=170, bbox_inches="tight")
    plt.close(fig)


# ══════════════════════════════════════════════════════════════════
# 3. CYCLE DE VIE D'UN TICKET (maintenance corrective)
# ══════════════════════════════════════════════════════════════════
def diagram_ticket():
    fig, ax = plt.subplots(figsize=(12, 5.2))
    ax.set_xlim(0, 12); ax.set_ylim(0, 5.2); ax.axis("off")
    ax.text(6, 4.95, "Cycle de vie d'un ticket sur Gitea (prestataire ↔ Ministère)",
            ha="center", fontsize=13, fontweight="bold", color=BLUE)

    etapes = [
        ("1. Signalement\nIssue créée\n(gabarit incident)", GREY_D),
        ("2. Qualification\nLabels : gravité,\npriorité, module", BLUE),
        ("3. Priorisation\nSLA appliqué\n(bloquant/majeur/mineur)", ORANGE),
        ("4. Correction\nbranche fix/*\n+ tests", GREEN_D),
        ("5. Revue & CI\nPull Request\n29 tests verts", GREEN_D),
        ("6. Livraison\nmerge → Coolify\ndéploie", GREEN),
        ("7. Clôture\nvalidation client\nIssue fermée", GREEN),
    ]
    x = 0.15
    w = 1.58
    gap = 0.11
    y = 2.5
    for i, (t, col) in enumerate(etapes):
        box(ax, x, y, w, 1.3, t, col, fs=8.3)
        if i < len(etapes) - 1:
            arrow(ax, x + w, y + 0.65, x + w + gap, y + 0.65, color=GREY_D, lw=1.6)
        x += w + gap

    # Bandeau SLA
    ax.text(6, 1.9, "Délais contractuels (jours ouvrés) — repris du cahier des charges",
            ha="center", fontsize=10, fontweight="bold", color=GREEN_D)
    sla = [
        ("Bloquant critique", "Prise en compte 1 h", "Correction 3 h", RED),
        ("Bloquant fort", "Prise en compte 2 h", "Correction 6 h", ORANGE),
        ("Majeur", "Prise en compte 7 h", "Correction 16 h", YELLOW_A),
        ("Mineur (par lots)", "Prise en compte 1 j", "Correction 40 h", GREEN),
    ]
    bx = 0.3
    bw = 2.85
    for titre, d1, d2, col in sla:
        box(ax, bx, 0.35, bw, 1.15, "", BLUE_L, ec=col, tc=INK)
        box(ax, bx, 1.12, bw, 0.38, titre, col, fs=9, tc="white")
        ax.text(bx + bw / 2, 0.92, d1, ha="center", fontsize=8.3, color=INK)
        ax.text(bx + bw / 2, 0.62, d2, ha="center", fontsize=8.3, color=INK)
        bx += bw + 0.1

    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "cycle_ticket.png"), dpi=170, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    diagram_deploiement()
    diagram_matrice_risques()
    diagram_ticket()
    print("Schémas Bloc 3 générés dans :", OUT)
    for f in sorted(os.listdir(OUT)):
        print("  -", f)

#!/usr/bin/env python3
"""
Génération du Cahier des Charges CESIZen — version enrichie pour rendu CESI.

Couvre toutes les rubriques de la grille d'évaluation INFCDAAL1 :
- Recueil du besoin (contexte, contraintes, livrables, besoins logiciels)
- Critères de priorisation et pondération
- Cahier des charges (analyse, contraintes, opportunités)
- Réponse fonctionnelle 2 modules obligatoires (Comptes, Informations) + 1 au choix (Tracker)
- Modélisation : MCD, MVC, spécifications, RGPD
"""
from fpdf import FPDF


# Remplace les caractères Unicode non-Latin-1 par des équivalents.
_UNICODE_FIX = {
    '—': '-',   # em-dash
    '–': '-',   # en-dash
    '…': '...', # ellipsis
    '‘': "'",   # left single quote
    '’': "'",   # right single quote
    '“': '"',   # left double quote
    '”': '"',   # right double quote
    '→': '->',  # right arrow
    '←': '<-',  # left arrow
    '•': '-',   # bullet
    ' ': ' ',   # nbsp
    '✅': 'OK',  # check mark
    '❌': 'X',   # cross mark
    '⚠': '!',   # warning
    'ᵉ': 'e',   # superscript e
    'ᵒ': 'o',
    '€': 'EUR',
    '×': 'x',
    '≤': '<=',
    '≥': '>=',
    '°': 'deg',
}

def _safe(s):
    if not isinstance(s, str):
        return s
    for k, v in _UNICODE_FIX.items():
        s = s.replace(k, v)
    return s


# ─── Couleurs CESIZen ──────────────────────────────────────────────
COULEUR_PRIMAIRE = (252, 225, 23)      # candlelight (#fce117)
COULEUR_SECONDAIRE = (6, 198, 86)      # malachite (#06c656)
COULEUR_BLEU = (0, 70, 130)
COULEUR_BLEU_CLAIR = (230, 240, 250)
COULEUR_GRIS_FONCE = (50, 50, 50)
COULEUR_GRIS_MOYEN = (110, 110, 110)
COULEUR_GRIS_CLAIR = (240, 240, 240)
COULEUR_BLANC = (255, 255, 255)
COULEUR_ROUGE = (200, 40, 40)


class CahierCharges(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=20)

    def cell(self, w=0, h=0, text='', *args, **kwargs):  # noqa
        return super().cell(w, h, _safe(text), *args, **kwargs)

    def multi_cell(self, w, h, text='', *args, **kwargs):  # noqa
        return super().multi_cell(w, h, _safe(text), *args, **kwargs)

    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(*COULEUR_GRIS_MOYEN)
            self.cell(0, 8, 'CESIZen — Cahier des charges', align='L')
            self.cell(0, 8, f'Page {self.page_no()}', align='R', new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(*COULEUR_SECONDAIRE)
            self.set_line_width(0.5)
            self.line(10, 18, 200, 18)
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 7)
        self.set_text_color(*COULEUR_GRIS_MOYEN)
        self.cell(0, 10, "CESI École d'Ingénieurs — Bloc INFCDAAL1 — Ministère des Solidarités et de la Santé", align='C')

    # ─── Helpers ────────────────────────────────────────────────────
    def h1(self, num, title):
        if self.get_y() > 230:
            self.add_page()
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(*COULEUR_BLEU)
        self.set_fill_color(*COULEUR_BLEU_CLAIR)
        self.cell(0, 11, f'  {num}. {title}', fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(3)

    def h2(self, title):
        if self.get_y() > 250:
            self.add_page()
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(*COULEUR_SECONDAIRE)
        self.cell(0, 8, f'   {title}', new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def h3(self, title):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(*COULEUR_GRIS_FONCE)
        self.cell(0, 7, f'     {title}', new_x="LMARGIN", new_y="NEXT")

    def paragraph(self, text):
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.2, text)
        self.ln(1.5)

    def bullet(self, text, indent=8):
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(40, 40, 40)
        x_start = self.l_margin + indent
        self.set_x(x_start)
        # puce
        self.set_font('Helvetica', 'B', 9.5)
        self.set_text_color(*COULEUR_SECONDAIRE)
        self.cell(4, 5, chr(149))
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(40, 40, 40)
        self.multi_cell(self.w - self.r_margin - self.get_x(), 5, text)
        self.ln(0.5)

    def table(self, headers, rows, col_widths=None, header_bg=None):
        if col_widths is None:
            page_width = self.w - self.l_margin - self.r_margin
            col_widths = [page_width / len(headers)] * len(headers)
        header_bg = header_bg or COULEUR_SECONDAIRE
        # header
        self.set_font('Helvetica', 'B', 8.5)
        self.set_fill_color(*header_bg)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True, align='C')
        self.ln()
        # rows
        self.set_font('Helvetica', '', 8.5)
        self.set_text_color(40, 40, 40)
        fill = False
        for row in rows:
            # estimate max height for this row
            line_h = 5
            max_lines = 1
            for i, cell_value in enumerate(row):
                s = str(cell_value)
                # approximate text width per line: each char ~ 1.8mm at size 8.5
                chars_per_line = max(1, int(col_widths[i] / 1.8))
                lines = sum(max(1, (len(w) + chars_per_line - 1) // chars_per_line)
                            for w in s.split('\n'))
                max_lines = max(max_lines, lines)
            row_h = line_h * max_lines + 1

            if self.get_y() + row_h > self.h - 25:
                self.add_page()
                self.set_font('Helvetica', 'B', 8.5)
                self.set_fill_color(*header_bg)
                self.set_text_color(255, 255, 255)
                for i, h in enumerate(headers):
                    self.cell(col_widths[i], 7, h, border=1, fill=True, align='C')
                self.ln()
                self.set_font('Helvetica', '', 8.5)
                self.set_text_color(40, 40, 40)

            if fill:
                self.set_fill_color(248, 250, 252)
            else:
                self.set_fill_color(255, 255, 255)
            x_init = self.get_x()
            y_init = self.get_y()
            for i, cell_value in enumerate(row):
                self.rect(x_init + sum(col_widths[:i]), y_init, col_widths[i], row_h, 'F' if fill else 'D')
                self.set_xy(x_init + sum(col_widths[:i]) + 1, y_init + 0.5)
                self.multi_cell(col_widths[i] - 2, line_h, str(cell_value))
            self.set_xy(x_init, y_init + row_h)
            fill = not fill
        self.ln(2)

    def callout(self, text, color=None):
        color = color or COULEUR_SECONDAIRE
        self.set_fill_color(*color)
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 9.5)
        # gentle wrap
        self.multi_cell(0, 7, '  ' + text, fill=True)
        self.ln(2)

    def block_callout(self, title, body, color=None):
        color = color or COULEUR_SECONDAIRE
        self.set_fill_color(*color)
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 10)
        self.cell(0, 7, '  ' + title, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(40, 40, 40)
        self.set_fill_color(248, 250, 252)
        self.set_font('Helvetica', '', 9)
        self.multi_cell(0, 5, '  ' + body, fill=True)
        self.ln(2)

    def figure(self, path, w, caption=None, x=None, new_page_if_below=None):
        """Insère une image centrée (largeur w en mm) avec légende optionnelle.
        Saut de page auto si la figure ne tient pas dans l'espace restant."""
        from PIL import Image as _PILImage
        iw, ih = _PILImage.open(path).size
        disp_h = w * ih / iw
        page_w = self.w - self.l_margin - self.r_margin
        if x is None:
            x = self.l_margin + (page_w - w) / 2
        seuil = new_page_if_below if new_page_if_below is not None else (self.h - 22)
        if self.get_y() + disp_h + (6 if caption else 0) > seuil:
            self.add_page()
        self.image(path, x=x, w=w)
        self.ln(1)
        if caption:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(*COULEUR_GRIS_MOYEN)
            self.cell(0, 4, caption, align='C', new_x="LMARGIN", new_y="NEXT")
            self.set_font('Helvetica', '', 9.5)
            self.set_text_color(40, 40, 40)
        self.ln(2)


# ─── Construction du document ─────────────────────────────────────────
# Dossier des schémas générés par generate_diagrams.py
import os as _os
ASSETS = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'assets_dossier')

pdf = CahierCharges()

# ─────────────── Page de garde ───────────────
pdf.add_page()
pdf.ln(40)
pdf.set_font('Helvetica', 'B', 32)
pdf.set_text_color(*COULEUR_SECONDAIRE)
pdf.cell(0, 14, 'CESIZen', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(*COULEUR_GRIS_FONCE)
pdf.cell(0, 10, "L'application de votre santé mentale", align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(10)
pdf.set_font('Helvetica', '', 14)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 8, 'Cahier des charges', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.ln(40)

pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(60, 60, 60)
metadata = [
    ('Intitulé du projet', 'CESIZen — Plateforme Web & Mobile de santé mentale'),
    ('Commanditaire', 'Ministère des Solidarités et de la Santé'),
    ('Apprenant', 'Adam Marzuk — CESI École d\'Ingénieurs'),
    ('Bloc', 'INFCDAAL1 — Concevoir les solutions logicielles'),
    ('Date', '16 mai 2026'),
    ('Version', '2.0'),
]
for lib, val in metadata:
    pdf.set_x(40)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(45, 7, lib)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 7, val, new_x="LMARGIN", new_y="NEXT")

# ─────────────── 1. Glossaire ───────────────
pdf.add_page()
pdf.h1(1, 'Glossaire')
glossaire = [
    ('MVC', "Modèle-Vue-Contrôleur. Patron d'architecture séparant données, présentation et logique applicative."),
    ('MCD', "Modèle Conceptuel de Données (Merise). Représentation abstraite des entités et de leurs relations."),
    ('MLD', "Modèle Logique de Données. Traduction du MCD en tables et clés étrangères pour un SGBD relationnel."),
    ('JWT', "JSON Web Token. Format de jeton d'authentification stateless porté dans l'en-tête HTTP Authorization."),
    ('RGPD', "Règlement Général sur la Protection des Données. Loi européenne (2018) qui encadre le traitement des données personnelles."),
    ('RGAA', "Référentiel Général d'Amélioration de l'Accessibilité (norme française d'accessibilité numérique)."),
    ('HDS', "Hébergeur de Données de Santé — certification ASIP Santé obligatoire pour héberger des données de santé en France."),
    ('Mobile-First', "Conception prioritairement orientée vers les terminaux mobiles, puis étendue au desktop."),
    ('Tracker', "Journal de bord émotionnel : suite de saisies datées associant émotion et intensité."),
    ('Saisie tracker', "Entrée individuelle du journal : date, émotion, intensité (1-10), note libre."),
]
for terme, definition in glossaire:
    pdf.set_font('Helvetica', 'B', 9.5)
    pdf.set_text_color(*COULEUR_SECONDAIRE)
    pdf.cell(28, 6, terme)
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 6, definition)
    pdf.ln(0.5)

# ─────────────── 2. Recueil du besoin ───────────────
pdf.add_page()
pdf.h1(2, 'Recueil du besoin')
pdf.paragraph(
    "Le recueil du besoin s'articule autour de quatre blocs structurants demandés par la consigne CESI : "
    "(1) le contexte et les objectifs, (2) les contraintes et ressources, (3) les livrables et prestations, "
    "et (4) les besoins logiciels reformulés."
)

# Bloc 1 — Contexte
pdf.h2('2.1 Bloc 1 — Contexte, objectifs et enjeux')
pdf.paragraph(
    "Le projet CESIZen est commandité par le Ministère des Solidarités et de la Santé. Il vise à proposer "
    "une plateforme grand public d'accompagnement quotidien en santé mentale, axée sur la prévention du stress "
    "et la sensibilisation. Le besoin émerge d'un constat sociétal : 22% des Français présentent un trouble "
    "de santé mentale au cours de leur vie (Santé Publique France, 2023), mais la stigmatisation et la "
    "méconnaissance freinent l'accès au soin."
)
pdf.block_callout(
    'Objectifs stratégiques',
    "1. Donner accès à un contenu éducatif fiable sur la santé mentale.  "
    "2. Permettre à chacun de suivre son humeur dans le temps.  "
    "3. Diriger les personnes en détresse vers des ressources adaptées (numéros d'urgence).  "
    "4. Garantir la confidentialité absolue des données émotionnelles (RGPD + HDS).",
    color=COULEUR_BLEU
)

# Bloc 2 — Contraintes & ressources
pdf.h2('2.2 Bloc 2 — Contraintes et ressources catégorisées')
pdf.table(
    headers=['Catégorie', 'Contrainte', 'Niveau'],
    rows=[
        ['Légale', 'Conformité RGPD (consentement, droits, portabilité, oubli)', 'CRITIQUE'],
        ['Légale', 'Hébergement certifié HDS (données de santé)', 'CRITIQUE'],
        ['Légale', 'Accessibilité RGAA niveau AA', 'FORTE'],
        ['Technique', 'Compatibilité Web modernes (Chrome 100+, Firefox, Safari)', 'FORTE'],
        ['Technique', 'Mobile multi-plateformes (iOS 14+, Android 8+)', 'FORTE'],
        ['Technique', 'API REST stateless, chiffrement HTTPS strict', 'FORTE'],
        ['Organisationnelle', 'Réalisation individuelle, 3 mois calendaires', 'CRITIQUE'],
        ['Organisationnelle', "Pas de budget dédié à la création de contenu", 'MOYENNE'],
        ['Fonctionnelle', '2 modules obligatoires + 1 au choix (Tracker retenu)', 'CRITIQUE'],
        ['Budgétaire', 'Stack open-source uniquement (pas de licence payante)', 'MOYENNE'],
    ],
    col_widths=[35, 130, 25],
)
pdf.h3('Ressources mobilisées')
pdf.bullet("1 apprenant ingénieur (compétences full-stack PHP/JS/TS).")
pdf.bullet("Stack open-source : Laravel 11, Next.js 16, React Native (Expo), PostgreSQL 16, Docker.")
pdf.bullet("Hébergement cible : Scaleway Healthcare ou OVH Healthcare (HDS).")
pdf.bullet("Outils de gestion : GitHub (versioning), Figma (maquettes), draw.io (UML).")

# Bloc 3 — Livrables
pdf.h2('2.3 Bloc 3 — Types de prestations et livrables')
pdf.paragraph(
    "Le projet livre les éléments suivants au commanditaire :"
)
pdf.table(
    headers=['#', 'Livrable', 'Format', 'Pondération'],
    rows=[
        ['M1', 'Cahier des charges détaillé', 'PDF', '10%'],
        ['M2', "Dossier d'architecture & conception (MCD, UML, MVC)", 'PDF + diagrammes', '15%'],
        ['M3', 'Maquettes UI/UX (Web + Mobile)', 'Figma / images', '20%'],
        ['M4', 'Code source v1 (API Laravel + Web Next.js + Mobile RN)', 'Dépôt Git', '40%'],
        ['M5', "Documentation technique & utilisateur (installation, admin)", 'PDF / Markdown', '15%'],
    ],
    col_widths=[12, 100, 50, 28],
)

# Bloc 4 — Besoins logiciels
pdf.h2('2.4 Bloc 4 — Besoins logiciels reformulés')
pdf.paragraph(
    "Les besoins fonctionnels sont organisés par module. Les modules retenus pour les spécifications "
    "détaillées (cf. section 5) sont en gras :"
)
pdf.table(
    headers=['Module', 'Statut', 'Besoins principaux'],
    rows=[
        ['Comptes utilisateurs',
         'OBLIGATOIRE',
         "Inscription, connexion JWT, gestion profil, reset mot de passe, RGPD, CRUD admin"],
        ['Informations',
         'OBLIGATOIRE',
         "Affichage pages publiques, modification contenus (admin)"],
        ['Tracker d\'émotions',
         'CHOIX',
         "Journal de bord, ajout/édition/suppression saisies, rapports périodiques, configuration émotions"],
        ['Diagnostics de stress',
         'NON RETENU',
         "Module questionnaire — non couvert pour ce livrable"],
        ['Exercices de respiration',
         'NON RETENU',
         "Cohérence cardiaque — non couvert pour ce livrable"],
        ['Activités de détente',
         'NON RETENU',
         "Catalogue activités — non couvert pour ce livrable"],
    ],
    col_widths=[40, 30, 120],
)

# ─────────────── 3. Critères de priorisation ───────────────
pdf.add_page()
pdf.h1(3, 'Critères de priorisation et pondération')
pdf.paragraph(
    "Face à l'amplitude initiale du besoin, une grille de priorisation pondérée a été établie pour identifier "
    "les fonctionnalités à fort impact et à forte valeur ajoutée. Cinq critères ont été retenus, totalisant 15 points."
)
pdf.table(
    headers=['Critère', 'Échelle', 'Justification du critère'],
    rows=[
        ['Complexité', '0 - 3', "Effort technique / risque d'implémentation (3 = très complexe)."],
        ['Valeur Ministère', '0 - 3', "Réponse aux enjeux de santé publique (3 = très alignée)."],
        ['Valeur Utilisateur', '0 - 3', "Utilité quotidienne perçue par l'utilisateur final."],
        ['Nécessité', '0 - 2', "Caractère obligatoire ou différenciant pour le périmètre."],
        ['Interdépendance', '0 - 2', "Nombre de fonctionnalités qui en dépendent."],
    ],
    col_widths=[40, 25, 125],
)
pdf.h2('3.1 Tableau de priorisation des fonctionnalités')
pdf.paragraph(
    "Note : 'C' = Complexité, 'VM' = Valeur Ministère, 'VU' = Valeur Utilisateur, 'N' = Nécessité, "
    "'I' = Interdépendance. Total sur 15."
)
prio_rows = [
    ['Afficher le questionnaire diagnostic de stress', '3', '3', '2', '2', '0', '10'],
    ["Afficher le journal de bord du tracker d'émotions", '2', '3', '3', '2', '0', '10'],
    ['Visualiser un rapport (semaine/mois/trimestre/année)', '3', '2', '3', '1', '1', '10'],
    ['Cryptage des données', '3', '2', '1', '2', '1', '9'],
    ["Création d'un compte utilisateur", '1', '1', '3', '2', '2', '9'],
    ['Cohérence cardiaque', '1', '3', '3', '2', '0', '9'],
    ['Catalogue activités détente', '1', '2', '3', '1', '2', '9'],
    ['Ajouter / modifier une saisie tracker', '1', '2', '3', '2', '1', '9'],
    ['Conformité RGPD', '3', '0', '2', '2', '1', '8'],
    ['Réinitialisation mot de passe', '2', '1', '3', '1', '0', '7'],
    ['Affichage pages de contenus', '1', '2', '2', '1', '0', '6'],
    ['Gestion compte (profil)', '1', '1', '1', '2', '0', '5'],
    ['Création comptes admin', '1', '1', '1', '2', '0', '5'],
    ['Modification contenus (admin)', '2', '2', '1', '0', '0', '5'],
    ['Désactivation / suppression compte', '1', '1', '0', '2', '0', '4'],
    ['Supprimer une saisie tracker', '1', '1', '2', '0', '0', '4'],
    ['Configurer la liste d\'émotions (admin)', '2', '1', '0', '0', '0', '3'],
]
pdf.table(
    headers=['Fonctionnalité', 'C', 'VM', 'VU', 'N', 'I', 'Total'],
    rows=prio_rows,
    col_widths=[100, 12, 12, 12, 12, 12, 16],
)
pdf.h2('3.2 Conclusion de la priorisation')
pdf.bullet(
    "Le module Tracker (journal + rapports + ajout/édition) cumule 4 fonctionnalités notées 9-10/15. "
    "C'est le module à plus forte valeur ajoutée pour l'utilisateur, retenu comme module au choix."
)
pdf.bullet(
    "Les modules obligatoires (Comptes utilisateurs, Informations) sont en seconde priorité : "
    "fondations indispensables mais à valeur ajoutée moins différenciante."
)
pdf.bullet(
    "Les modules Diagnostic, Cohérence cardiaque et Activités détente — bien que théoriquement attractifs — "
    "ne sont pas implémentés dans le périmètre actuel pour garantir la qualité des modules retenus."
)
pdf.bullet(
    "La conformité RGPD (8/15) est traitée transversalement (consentement, soft delete, export, anonymisation)."
)

# ─────────────── 4. Cahier des charges — Analyse ───────────────
pdf.add_page()
pdf.h1(4, 'Cahier des charges — Analyse')
pdf.h2('4.1 Acteurs identifiés')
pdf.table(
    headers=['Acteur', 'Description', 'Périmètre fonctionnel'],
    rows=[
        ['Visiteur anonyme',
         "Internaute non authentifié",
         "Consulter pages info, créer un compte"],
        ['Utilisateur connecté',
         "Personne ayant un compte CESIZen actif",
         "Gérer profil, journal émotions, rapports, RGPD"],
        ['Administrateur',
         "Modérateur / professionnel de la plateforme",
         "Gérer utilisateurs, contenus, émotions, statistiques"],
    ],
    col_widths=[35, 60, 90],
)

pdf.h2('4.2 Personas')
personas = [
    ("Claire — Utilisatrice (Visiteur → Membre)",
     "35 ans, responsable marketing à Lille. Mère célibataire de 2 enfants. Stressée par le travail, "
     "elle veut un outil mobile rapide pour noter son ressenti dans les transports et lire des conseils le soir."),
    ("Karim — Utilisateur (Membre)",
     "45 ans, entrepreneur à Bordeaux. Marié, malvoyant. Recherche une application accessible "
     "(RGAA AA, contraste, navigation clavier) pour suivre son humeur sans dépendre d'un proche."),
    ("Samia — Administratrice",
     "42 ans, professionnelle de santé. Modère et publie les ressources informatives. "
     "Configure les listes d'émotions, désactive les comptes signalés, consulte les statistiques anonymes globales."),
]
for nom, desc in personas:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(*COULEUR_SECONDAIRE)
    pdf.cell(0, 6, '  ' + nom, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 5, '  ' + desc)
    pdf.ln(1)

pdf.h2('4.3 Opportunités et pérennité')
pdf.bullet(
    "Évolutivité : architecture découplée (API REST + 2 clients web/mobile) permettant l'ajout futur "
    "des modules Diagnostic, Respiration, Activités sans réécriture."
)
pdf.bullet(
    "Open Data : la base de saisies anonymisées pourra alimenter des études épidémiologiques nationales."
)
pdf.bullet(
    "Partenariat institutionnel : intégration future possible avec Mon Espace Santé (DMP) via FHIR."
)
pdf.bullet(
    "Internationalisation : l'i18n est anticipée (clés de traduction), permettant un déploiement européen."
)

# ─────────────── 5. Réponse fonctionnelle ───────────────
pdf.add_page()
pdf.h1(5, "Réponse fonctionnelle — Spécifications par module")

# ─── Module 1 — Comptes
pdf.h2("5.1 Module 'Comptes utilisateurs' (obligatoire)")
pdf.h3("Écrans principaux")
pdf.bullet("Page inscription : formulaire (nom, prénom, email, mot de passe + confirmation, case consentement RGPD).")
pdf.bullet("Page connexion : email + mot de passe, lien 'Mot de passe oublié'.")
pdf.bullet("Page profil utilisateur : affichage + édition (nom, prénom, email), changement mot de passe.")
pdf.bullet("Page admin — liste utilisateurs : tableau paginé avec recherche, filtre rôle, action toggle/supprimer.")
pdf.bullet("Page admin — création utilisateur : formulaire avec attribution rôle (membre/admin).")

pdf.h3("Règles de gestion")
pdf.table(
    headers=['Règle', 'Détail'],
    rows=[
        ['RG-CU-01', 'Email unique en base — vérification avant insertion.'],
        ['RG-CU-02', 'Mot de passe : minimum 8 caractères, hash bcrypt (12 rounds).'],
        ['RG-CU-03', "Consentement RGPD obligatoire à l'inscription (case à cocher non-pré-cochée)."],
        ['RG-CU-04', "JWT expiration 60 minutes, refresh token 14 jours."],
        ['RG-CU-05', "Soft delete sur Utilisateur (champ deleted_at) — conservation 30 jours puis purge."],
        ['RG-CU-06', "Compte désactivé ne peut plus se connecter (statut est_actif = false → 403)."],
        ['RG-CU-07', "Seul un compte de rôle 'administrateur' peut créer un autre administrateur."],
    ],
    col_widths=[20, 170],
)
pdf.h3("Endpoints API (extrait)")
pdf.set_font('Courier', '', 8.5)
pdf.set_text_color(40, 40, 40)
endpoints_cu = [
    "POST   /api/v1/auth/register        Inscription public",
    "POST   /api/v1/auth/login           Connexion (throttle 5/min)",
    "GET    /api/v1/profil               Lecture profil (JWT)",
    "PUT    /api/v1/profil               Mise à jour profil",
    "PUT    /api/v1/profil/password      Changement mot de passe",
    "GET    /api/v1/profil/export        Export RGPD (JSON)",
    "POST   /api/v1/profil/anonymiser    Anonymisation RGPD",
    "GET    /api/v1/admin/utilisateurs   Liste paginée (admin)",
    "POST   /api/v1/admin/utilisateurs   Création (admin)",
    "PATCH  /api/v1/admin/utilisateurs/{id}/toggle-active",
]
for ep in endpoints_cu:
    pdf.cell(0, 5, ep, new_x="LMARGIN", new_y="NEXT")
pdf.set_font('Helvetica', '', 9.5)
pdf.ln(2)
pdf.figure(_os.path.join(ASSETS, 'mockup_inscription.png'), 62,
           caption="Maquette - écran d'inscription (consentement RGPD obligatoire)")

# ─── Module 2 — Informations
pdf.add_page()
pdf.h2("5.2 Module 'Informations' (obligatoire)")
pdf.h3("Écrans principaux")
pdf.bullet("Page publique liste : grille de cartes (titre, extrait 120 caractères, image, date).")
pdf.bullet("Page publique détail : titre, contenu HTML rendu, auteur, date de publication.")
pdf.bullet("Page admin — liste contenus : tableau avec actions modifier / publier / supprimer.")
pdf.bullet("Page admin — formulaire création/édition : titre, slug auto, contenu (éditeur riche), image_url, ordre, case 'publié'.")

pdf.h3("Règles de gestion")
pdf.table(
    headers=['Règle', 'Détail'],
    rows=[
        ['RG-INF-01', "Slug unique généré automatiquement à partir du titre (ex: 'Gérer son stress' → 'gerer-son-stress')."],
        ['RG-INF-02', "Champ booléen est_publie : false (brouillon, invisible) ou true (publié, visible)."],
        ['RG-INF-03', "Ordre numérique pour le tri sur la page liste publique (1 = en haut)."],
        ['RG-INF-04', "Auteur enregistré automatiquement (utilisateur authentifié à la création)."],
        ['RG-INF-05', "Suppression d'un contenu réservée à l'administrateur (action tracée dans audits)."],
        ['RG-INF-06', "Modération obligatoire : un admin valide avant publication."],
    ],
    col_widths=[20, 170],
)

# ─── Module 3 — Tracker
pdf.h2("5.3 Module 'Tracker d'émotions' (au choix)")
pdf.paragraph(
    "Le module Tracker permet à l'utilisateur d'enregistrer son état émotionnel via un wizard en 3 étapes, "
    "de consulter son journal, et de visualiser des rapports analytiques sur 4 périodes (semaine, mois, trimestre, année). "
    "Les émotions sont structurées en 2 niveaux (7 émotions de base + 33 sous-émotions précises)."
)
pdf.h3("Wizard d'ajout de saisie (3 étapes)")
pdf.block_callout(
    "Étape 1 — Sélection de l'émotion de base (niveau 1)",
    "L'utilisateur choisit parmi 7 émotions fondamentales : Joie, Tristesse, Colère, Peur, Dégoût, Surprise, Amour. "
    "Chaque émotion est représentée par une couleur et un icône distinctifs.",
    color=COULEUR_SECONDAIRE
)
pdf.block_callout(
    "Étape 2 — Sous-émotion (niveau 2) + intensité 1-10",
    "Selon l'émotion choisie, 4 à 6 sous-émotions plus précises sont proposées (ex: Joie → Sérénité, Enthousiasme, Fierté, Gratitude). "
    "L'intensité est ajustée via un slider de 1 (très faible) à 10 (très forte).",
    color=COULEUR_BLEU
)
pdf.block_callout(
    "Étape 3 — Date + note libre",
    "La date est pré-remplie à aujourd'hui (modifiable). Une note libre (0-2000 caractères) permet "
    "de contextualiser la saisie. Validation finale → enregistrement.",
    color=COULEUR_PRIMAIRE
)
pdf.figure(_os.path.join(ASSETS, 'mockup_wizard.png'), 50,
           caption="Maquette - étape 2 du wizard (sous-émotion + slider d'intensité)")

pdf.h3("Règles de gestion")
pdf.table(
    headers=['Règle', 'Détail'],
    rows=[
        ['RG-TR-01', "L'utilisateur dispose d'un seul tracker (1-1 avec son compte)."],
        ['RG-TR-02', "Intensité obligatoire entre 1 et 10 (entier)."],
        ['RG-TR-03', "Une seule saisie par jour autorisée → modification possible (pas de duplicat)."],
        ['RG-TR-04', "Émotion obligatoire (référence emotion_id valide, niveau 1 ou 2)."],
        ['RG-TR-05', "Note libre limitée à 2000 caractères."],
        ['RG-TR-06', "Rapports : période min 7j (semaine), max 365j (année)."],
        ['RG-TR-07', "Statistiques : moyenne d'intensité, répartition par émotion, courbe temporelle."],
        ['RG-TR-08', "Suppression de saisie : hard delete (pas de soft delete car données personnelles)."],
    ],
    col_widths=[20, 170],
)
pdf.figure(_os.path.join(ASSETS, 'mockup_rapports.png'), 120,
           caption="Maquette - rapport d'émotions par période (statistiques + répartition)")

# ─────────────── 6. Diagramme cas d'usage ───────────────
pdf.add_page()
pdf.h1(6, "Schématisation UML — Cas d'usage")
pdf.paragraph(
    "Le diagramme ci-dessous présente les cas d'usage couverts par le périmètre actuel. Les modules non retenus "
    "(Diagnostic, Respiration, Activités) ne sont volontairement pas représentés."
)
pdf.figure(_os.path.join(ASSETS, 'usecase.png'), 185,
           caption="Diagramme de cas d'usage UML - 3 acteurs et fonctionnalités par module")

# ─────────────── 7. MCD ───────────────
pdf.add_page()
pdf.h1(7, 'Modèle Conceptuel de Données (MCD)')
pdf.paragraph(
    "Le MCD utilise le formalisme Merise (entités, associations, cardinalités). 8 entités principales sont "
    "modélisées : Utilisateur, Rôle, Tracker, Émotion, SaisieTracker, Feed, ContactUrgence, Audit."
)
pdf.figure(_os.path.join(ASSETS, 'mcd.png'), 150,
           caption="Modèle Conceptuel de Données (Merise) - cardinalités et hiérarchie d'émotions")

pdf.h2("7.1 Cardinalités principales")
pdf.bullet("Un Rôle est porté par 0..N Utilisateurs. Un Utilisateur a exactement 1 Rôle. [1,1 — 0,N]")
pdf.bullet("Un Utilisateur possède exactement 1 Tracker (créé à l'inscription). Un Tracker appartient à 1 Utilisateur. [1,1 — 1,1]")
pdf.bullet("Un Tracker contient 0..N SaisieTracker. Une SaisieTracker appartient à exactement 1 Tracker. [1,1 — 0,N]")
pdf.bullet("Une Émotion (niveau 1) regroupe 0..N sous-émotions (niveau 2). Auto-référence parent_id. [0,1 — 0,N]")
pdf.bullet("Une Émotion est utilisée dans 0..N SaisieTracker. [1,1 — 0,N]")
pdf.bullet("Un Utilisateur (admin) rédige 0..N Feeds. Un Feed a exactement 1 auteur. [1,1 — 0,N]")

pdf.h2("7.2 MLD — Traduction en tables")
pdf.set_font('Courier', '', 8)
pdf.set_text_color(40, 40, 40)
mld_text = """\
roles            (id, nom, description)
utilisateurs     (id, nom, prenom, email UNIQUE, password, role_id FK→roles, est_actif,
                  consentement_rgpd, created_at, updated_at, deleted_at)
trackers         (id, utilisateur_id FK→utilisateurs, nom, created_at, updated_at)
emotions         (id, nom, couleur, icone, niveau, parent_id FK→emotions, est_actif)
saisie_trackers  (id, tracker_id FK→trackers, emotion_id FK→emotions,
                  intensite CHECK BETWEEN 1 AND 10, note, date_saisie, created_at)
feeds            (id, titre, slug UNIQUE, contenu, image_url, est_publie,
                  auteur_id FK→utilisateurs, ordre, created_at, updated_at)
contacts_urgence (id, utilisateur_id FK→utilisateurs, nom, telephone, relation)
audits           (id, utilisateur_id FK→utilisateurs, action, table_cible,
                  enregistrement_id, anciennes_valeurs JSON, nouvelles_valeurs JSON,
                  ip_address, created_at)"""
for line in mld_text.split('\n'):
    pdf.cell(0, 4.6, line, new_x="LMARGIN", new_y="NEXT")
pdf.set_font('Helvetica', '', 9.5)
pdf.ln(2)

# ─────────────── 8. Architecture MVC ───────────────
pdf.add_page()
pdf.h1(8, 'Conception technique — Architecture MVC')
pdf.paragraph(
    "L'architecture exploite le patron MVC (Modèle-Vue-Contrôleur) en mode découplé : le Backend Laravel "
    "expose une API REST JSON qui alimente deux clients (Vue Web Next.js + Vue Mobile React Native)."
)
pdf.figure(_os.path.join(ASSETS, 'mvc.png'), 175,
           caption="Architecture MVC découplée - une API REST alimente les vues Web et Mobile")
pdf.h2('8.1 Justification du choix MVC')
pdf.bullet("Séparation stricte modèle / logique / présentation, facilitant les tests unitaires.")
pdf.bullet("Évolutivité : ajout d'un client (TV, assistant vocal) sans toucher au modèle.")
pdf.bullet("Maintenabilité : modification d'un écran n'impacte ni les contrôleurs ni les modèles.")
pdf.bullet("Conformité au cahier des charges (consigne explicite : 'justifier le Design Pattern MVC').")

pdf.h2('8.2 Répartition des responsabilités')
pdf.table(
    headers=['Couche', 'Responsabilité', 'Technologie'],
    rows=[
        ['Model',
         "Représentation données + relations + règles métier intrinsèques",
         "Eloquent ORM (Laravel) + PostgreSQL 16"],
        ['Controller',
         "Réception requêtes HTTP, validation, application des règles métier, retour JSON",
         "Laravel Controllers + FormRequest + Middleware (JWT, role, throttle)"],
        ['View — Web',
         "Rendu UI desktop & mobile-first, gestion état client, interactions",
         "Next.js 16 (App Router) + Zustand + TanStack Query"],
        ['View — Mobile',
         "Rendu UI native iOS + Android, navigation, SecureStore",
         "React Native (Expo 53) + Expo Router + Zustand"],
    ],
    col_widths=[28, 100, 62],
)

pdf.h2("8.3 Choix techniques justifiés")
pdf.table(
    headers=['Domaine', 'Technologie', 'Justification clé'],
    rows=[
        ['Backend', 'Laravel 11 (PHP 8.2)',
         "Framework MVC mature, sécurité native (CSRF, XSS, SQL Inj.), Eloquent ORM, écosystème JWT."],
        ['Frontend Web', 'Next.js 16 + TS',
         "SSR pour SEO, App Router, Mobile-First, accessibilité RGAA via composants standard."],
        ['Mobile', 'React Native (Expo)',
         "Code partagé avec le web (logique métier), iOS + Android sans bi-développement natif."],
        ['BDD', 'PostgreSQL 16',
         "ACID, support JSON, intégrité référentielle robuste, certifié HDS chez OVH / Scaleway."],
        ['Auth', 'JWT (tymon/jwt-auth)',
         "Stateless, scalable, expiration configurable, refresh tokens."],
        ['Conteneurisation', 'Docker Compose',
         "Reproductibilité environnements (dev / staging / prod), isolation services."],
        ['Versioning', 'Git + GitHub',
         "CI/CD intégré, branches/PR, conventions équipe."],
    ],
    col_widths=[28, 35, 127],
)

# ─────────────── 9. Diagrammes de séquence ───────────────
pdf.add_page()
pdf.h1(9, "Diagrammes UML — Séquences clés")
pdf.h2("9.1 Authentification JWT (login)")
pdf.figure(_os.path.join(ASSETS, 'seq_login.png'), 165,
           caption="Séquence d'authentification - validation, vérification bcrypt et émission du JWT")

pdf.h2("9.2 Création d'une saisie tracker (wizard 3 étapes)")
pdf.figure(_os.path.join(ASSETS, 'seq_saisie.png'), 165,
           caption="Séquence d'ajout d'une saisie via le wizard - validation et persistance")

# ─────────────── 10. RGPD ───────────────
pdf.add_page()
pdf.h1(10, "Gestion des données personnelles et sensibles (RGPD)")
pdf.paragraph(
    "CESIZen manipule des données sensibles relevant de la santé mentale. La conformité au RGPD "
    "(et à la doctrine HDS française) est traitée en profondeur."
)
pdf.h2('10.1 Données collectées et finalités')
pdf.table(
    headers=['Donnée', 'Sensibilité', 'Base légale', 'Conservation'],
    rows=[
        ['Email, nom, prénom', 'Personnelle', 'Consentement (art. 6.1.a)', 'Durée du compte + 30j'],
        ['Mot de passe (hash bcrypt)', 'Sensible (sécurité)', 'Consentement', "Idem"],
        ['Saisies émotionnelles (intensité, note, date)', 'Sensible (santé)', 'Consentement explicite', 'Durée du compte'],
        ['Logs d\'accès admin', 'Technique', "Intérêt légitime (art. 6.1.f)", '12 mois'],
        ['IP & user-agent', 'Technique', 'Sécurité (HDS)', '6 mois'],
    ],
    col_widths=[55, 35, 50, 45],
)
pdf.h2('10.2 Droits CNIL implémentés')
pdf.table(
    headers=['Droit RGPD', 'Article', 'Implémentation CESIZen'],
    rows=[
        ['Information', 'Art. 13-14', "Politique de confidentialité accessible (page publique)."],
        ['Accès', 'Art. 15', "Endpoint GET /profil retourne toutes les données."],
        ['Rectification', 'Art. 16', "Endpoint PUT /profil modifie les champs autorisés."],
        ['Effacement (oubli)', 'Art. 17', "Endpoint DELETE /profil — soft delete + purge à 30j."],
        ['Portabilité', 'Art. 20', "Endpoint GET /profil/export retourne JSON téléchargeable."],
        ['Limitation', 'Art. 18', "Désactivation compte sans suppression (admin)."],
        ['Opposition', 'Art. 21', "Désactivation des notifications (en cours)."],
        ['Anonymisation', '—', "Endpoint POST /profil/anonymiser dissocie données du compte."],
    ],
    col_widths=[40, 20, 130],
)
pdf.h2('10.3 Mesures de sécurité techniques')
pdf.bullet("Chiffrement en transit : HTTPS strict (HSTS), TLS 1.3 minimum.")
pdf.bullet("Chiffrement au repos : AES-256 sur le volume PostgreSQL, secrets dans .env hors-versioning.")
pdf.bullet("Hash mot de passe : bcrypt 12 rounds (configurable selon serveur).")
pdf.bullet("Authentification : JWT signé (HS256), expiration 60min, refresh 14j, throttle login 5/min.")
pdf.bullet("Autorisation : middleware role-based (jwt.auth + role:administrateur), rate limit admin 60/min.")
pdf.bullet("Journalisation : table audits trace toute action admin sensible (sans exposer données métier).")
pdf.bullet("Sauvegardes : snapshot quotidien chiffré, rétention 30 jours, restauration testée trimestriellement.")
pdf.bullet("HDS : hébergement chez prestataire certifié (Scaleway Healthcare ou OVH Healthcare).")

# ─────────────── 11. Risques ───────────────
pdf.add_page()
pdf.h1(11, "Analyse des risques et mitigation")
pdf.table(
    headers=['Risque', 'Impact', 'Probabilité', 'Mitigation'],
    rows=[
        ['Fuite données de santé', 'CRITIQUE', 'Faible',
         "Chiffrement AES-256, HDS, audits trimestriels, minimisation données."],
        ['Dérive contenus (conseil médical dangereux)', 'FORT', 'Moyen',
         "Modération admin obligatoire avant publication. Avertissement légal en pied de page."],
        ['Perte de données utilisateur', 'FORT', 'Faible',
         "Sauvegardes quotidiennes chiffrées, restauration testée, redondance serveur."],
        ['Détresse aiguë / risque suicidaire', 'CRITIQUE', 'Faible',
         "Page contacts urgence accessible 1 clic (3114, 15, 112). Bandeau permanent en cas de score critique."],
        ['Retard de livraison', 'MOYEN', 'Moyen',
         "Méthode MoSCoW (focus MVP Must Have). Stack maîtrisée (Laravel/React)."],
        ['Compromission compte admin', 'CRITIQUE', 'Faible',
         "MFA prévu (TOTP), rate limit, audit log."],
        ['Non-accessibilité (RGAA)', 'MOYEN', 'Faible',
         "Tests automatisés axe-core en CI, validation manuelle navigation clavier."],
    ],
    col_widths=[55, 22, 25, 88],
)

# ─────────────── 12. Exigences non-fonctionnelles ───────────────
pdf.h1(12, "Exigences non-fonctionnelles")
pdf.table(
    headers=['Catégorie', 'Exigence', 'Valeur cible'],
    rows=[
        ['Performance', 'Temps de réponse API (95ᵉ percentile)', '< 300ms'],
        ['Performance', 'Temps de chargement Dashboard (LCP)', '< 1.5s'],
        ['Disponibilité', 'SLA mensuel', '99,5%'],
        ['Capacité', 'Utilisateurs simultanés', '5 000 (cible)'],
        ['Capacité', 'Saisies stockées', '10 millions (sans dégradation)'],
        ['Sécurité', 'Conformité OWASP Top 10', '100% des risques traités'],
        ['Sécurité', 'Audit pénétration', 'Annuel (tiers indépendant)'],
        ['Accessibilité', 'RGAA niveau', 'AA'],
        ['Ergonomie', 'Dark Mode', "Natif iOS / Android / Web"],
        ['Internationalisation', 'Langues supportées', 'FR (v1), EN (v2)'],
    ],
    col_widths=[30, 80, 80],
)

# ─────────────── 13. Conclusion ───────────────
pdf.h1(13, "Conclusion")
pdf.paragraph(
    "Le cahier des charges CESIZen formalise un projet aligné sur les enjeux de santé publique "
    "(prévention de la souffrance psychique, accessibilité grand public), tout en garantissant les "
    "exigences strictes de protection des données sensibles (RGPD, HDS)."
)
pdf.paragraph(
    "Le périmètre couvre les 2 modules obligatoires (Comptes utilisateurs, Informations) ainsi que le "
    "module Tracker d'émotions au choix, avec une grille de priorisation pondérée justifiant ce périmètre. "
    "L'architecture MVC découplée (API Laravel + clients Next.js / React Native) garantit l'évolutivité "
    "vers les modules futurs (Diagnostic, Respiration, Activités) sans réécriture."
)
pdf.paragraph(
    "Un prototype fonctionnel (backend Laravel + frontend Next.js + mobile Expo) accompagne ce dossier "
    "et démontre la faisabilité technique des choix présentés."
)

pdf.ln(6)
pdf.set_font('Helvetica', 'I', 9)
pdf.set_text_color(*COULEUR_GRIS_MOYEN)
pdf.cell(0, 6, 'Sources : consignes CESI INFCDAAL1, Santé Publique France 2023, CNIL — Guide RGPD santé.',
         new_x="LMARGIN", new_y="NEXT")


# ─── Sortie ──────────────────────────────────────────────────────────
OUTPUT = '/Users/azmog/Desktop/CESI/Cahier_des_charges_CESIZen_v2.pdf'
pdf.output(OUTPUT)
print(f"Cahier des charges généré : {OUTPUT}")
print(f"Nombre de pages : {pdf.page_no()}")

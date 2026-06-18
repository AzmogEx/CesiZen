#!/usr/bin/env python3
"""
Génération des schémas du dossier CESIZen (MCD, UML cas d'usage, séquences,
architecture MVC, mockups) en PNG, à partir du code réel du projet.

Rendu avec Pillow uniquement (aucune dépendance externe de diagramme).
Supersampling x2 pour un anti-aliasing propre des traits.

Sortie : ./assets_dossier/*.png
"""
import os
from PIL import Image, ImageDraw, ImageFont

# ─── Palette CESIZen ───────────────────────────────────────────────
GREEN      = (6, 198, 86)
GREEN_D    = (4, 150, 65)
BLUE       = (0, 70, 130)
BLUE_L     = (230, 240, 250)
YELLOW     = (252, 225, 23)
GREY_D     = (50, 50, 50)
GREY       = (110, 110, 110)
GREY_L     = (235, 238, 242)
GREY_LL    = (247, 249, 251)
WHITE      = (255, 255, 255)
RED        = (200, 40, 40)
INK        = (35, 35, 45)

FONT_REG  = '/System/Library/Fonts/Supplemental/Arial.ttf'
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_MONO = '/System/Library/Fonts/Menlo.ttc'

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets_dossier')


class Canvas:
    """Toile de dessin avec supersampling : on dessine à `scale`x puis on réduit."""

    def __init__(self, w, h, scale=2, bg=WHITE):
        self.w, self.h, self.s = w, h, scale
        self.img = Image.new('RGB', (w * scale, h * scale), bg)
        self.d = ImageDraw.Draw(self.img)
        self._fonts = {}

    def font(self, size, bold=False, mono=False):
        key = (size, bold, mono)
        if key not in self._fonts:
            path = FONT_MONO if mono else (FONT_BOLD if bold else FONT_REG)
            self._fonts[key] = ImageFont.truetype(path, size * self.s)
        return self._fonts[key]

    # ---- primitives (coordonnées logiques) ----
    def box(self, x, y, w, h, fill=WHITE, outline=BLUE, width=2, radius=10):
        s = self.s
        self.d.rounded_rectangle(
            [x * s, y * s, (x + w) * s, (y + h) * s],
            radius=radius * s, fill=fill, outline=outline, width=width * s)

    def rect(self, x, y, w, h, fill=None, outline=None, width=1):
        s = self.s
        self.d.rectangle([x * s, y * s, (x + w) * s, (y + h) * s],
                         fill=fill, outline=outline, width=width * s)

    def text(self, x, y, txt, size=13, color=INK, bold=False, anchor='lm', mono=False):
        self.d.text((x * self.s, y * self.s), txt, font=self.font(size, bold, mono),
                    fill=color, anchor=anchor)

    def text_w(self, txt, size, bold=False, mono=False):
        """Largeur logique d'un texte."""
        bb = self.d.textbbox((0, 0), txt, font=self.font(size, bold, mono))
        return (bb[2] - bb[0]) / self.s

    def line(self, x0, y0, x1, y1, color=GREY_D, width=2, dash=None):
        s = self.s
        if dash:
            self._dashed(x0, y0, x1, y1, color, width, dash)
        else:
            self.d.line([x0 * s, y0 * s, x1 * s, y1 * s], fill=color, width=width * s)

    def _dashed(self, x0, y0, x1, y1, color, width, dash):
        import math
        s = self.s
        dx, dy = x1 - x0, y1 - y0
        dist = math.hypot(dx, dy)
        if dist == 0:
            return
        ux, uy = dx / dist, dy / dist
        on, off = dash
        pos = 0
        while pos < dist:
            seg = min(on, dist - pos)
            ax, ay = x0 + ux * pos, y0 + uy * pos
            bx, by = x0 + ux * (pos + seg), y0 + uy * (pos + seg)
            self.d.line([ax * s, ay * s, bx * s, by * s], fill=color, width=width * s)
            pos += on + off

    def arrow(self, x0, y0, x1, y1, color=GREY_D, width=2, head=9, dash=None,
              double=False):
        import math
        self.line(x0, y0, x1, y1, color, width, dash)
        ang = math.atan2(y1 - y0, x1 - x0)
        self._head(x1, y1, ang, color, head)
        if double:
            self._head(x0, y0, ang + math.pi, color, head)

    def _head(self, x, y, ang, color, head):
        import math
        s = self.s
        a1 = ang + math.radians(150)
        a2 = ang - math.radians(150)
        p = [(x * s, y * s),
             ((x + head * math.cos(a1)) * s, (y + head * math.sin(a1)) * s),
             ((x + head * math.cos(a2)) * s, (y + head * math.sin(a2)) * s)]
        self.d.polygon(p, fill=color)

    def open_head(self, x, y, ang, color, head=9, width=2):
        """Pointe ouverte (flèche async UML)."""
        import math
        s = self.s
        a1 = ang + math.radians(150)
        a2 = ang - math.radians(150)
        self.d.line([( (x+head*math.cos(a1))*s,(y+head*math.sin(a1))*s),(x*s,y*s)],
                    fill=color, width=width*s)
        self.d.line([( (x+head*math.cos(a2))*s,(y+head*math.sin(a2))*s),(x*s,y*s)],
                    fill=color, width=width*s)

    def check(self, x, y, size=14, color=GREEN_D, width=3):
        """Coche dessinée au trait (Arial n'a pas le glyphe ✓)."""
        self.line(x, y + size * 0.55, x + size * 0.38, y + size * 0.92, color, width)
        self.line(x + size * 0.38, y + size * 0.92, x + size, y, color, width)

    def ellipse(self, cx, cy, rx, ry, fill=WHITE, outline=BLUE, width=2):
        s = self.s
        self.d.ellipse([(cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s],
                       fill=fill, outline=outline, width=width * s)

    def polygon(self, pts, fill=None, outline=None, width=1):
        s = self.s
        self.d.polygon([(p[0] * s, p[1] * s) for p in pts], fill=fill,
                       outline=outline, width=width * s)

    def pill(self, cx, cy, txt, size=11, fill=GREEN, color=WHITE, pad=8):
        w = self.text_w(txt, size, bold=True) + 2 * pad
        h = size + 10
        self.box(cx - w / 2, cy - h / 2, w, h, fill=fill, outline=fill, radius=h / 2, width=1)
        self.text(cx, cy, txt, size, color, bold=True, anchor='mm')

    def save(self, name):
        os.makedirs(OUT_DIR, exist_ok=True)
        out = self.img.resize((self.w, self.h), Image.LANCZOS)
        path = os.path.join(OUT_DIR, name)
        out.save(path, 'PNG')
        print(f'  ✓ {name}  ({self.w}x{self.h})')
        return path


def title_bar(c, x, y, w, txt, sub=None, fill=BLUE):
    """Bandeau de titre pour un schéma."""
    c.box(x, y, w, 40, fill=fill, outline=fill, radius=8)
    c.text(x + 16, y + 20, txt, 16, WHITE, bold=True, anchor='lm')
    if sub:
        c.text(x + w - 16, y + 20, sub, 10, BLUE_L, anchor='rm')


# ════════════════════════════════════════════════════════════════════
# 1. MCD (Merise) — fidèle au schéma réel (8 entités)
# ════════════════════════════════════════════════════════════════════
def diagram_mcd():
    c = Canvas(1480, 1030)
    title_bar(c, 30, 24, 1420, "Modèle Conceptuel de Données (MCD - Merise)",
              "# = clé étrangère")

    entities = {
        'Role':        (110, 110, 210, ['id', 'nom', 'description']),
        'Utilisateur': (90, 360, 250, ['id', 'nom', 'prenom', 'email', 'password',
                                       'est_actif', 'consentement_rgpd', 'role_id #',
                                       'deleted_at']),
        'Tracker':     (480, 200, 210, ['id', 'nom', 'utilisateur_id #']),
        'SaisieTracker': (820, 200, 250, ['id', 'intensite', 'note', 'date_saisie',
                                          'tracker_id #', 'emotion_id #']),
        'Emotion':     (1095, 410, 250, ['id', 'nom', 'couleur', 'icone', 'niveau',
                                         'est_actif', 'parent_id #']),
        'ContactUrgence': (90, 760, 250, ['id', 'nom', 'telephone', 'relation',
                                          'utilisateur_id #']),
        'Feed':        (480, 600, 250, ['id', 'titre', 'slug', 'contenu', 'image_url',
                                        'est_publie', 'ordre', 'auteur_id #']),
        'Audit':       (840, 720, 250, ['id', 'action', 'table_cible',
                                        'enregistrement_id', 'ip_address', 'created_at',
                                        'utilisateur_id #']),
    }

    line_h = 25
    boxes = {}  # name -> (x, y, w, h)
    for name, (x, y, w, attrs) in entities.items():
        h = 34 + len(attrs) * line_h + 10
        boxes[name] = (x, y, w, h)

    def edge(name, side):
        x, y, w, h = boxes[name]
        return {
            'l': (x, y + h / 2), 'r': (x + w, y + h / 2),
            't': (x + w / 2, y), 'b': (x + w / 2, y + h),
            'tr': (x + w, y + 18), 'br': (x + w, y + h - 18),
            'tl': (x, y + 18), 'bl': (x, y + h - 18),
        }[side]

    def connect(a, sa, b, sb, verb, card_a, card_b):
        p0 = edge(a, sa)
        p1 = edge(b, sb)
        c.line(p0[0], p0[1], p1[0], p1[1], GREEN_D, 2)
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        # cardinalités à 18% de chaque extrémité
        ca = (p0[0] + (p1[0] - p0[0]) * 0.16, p0[1] + (p1[1] - p0[1]) * 0.16)
        cb = (p0[0] + (p1[0] - p0[0]) * 0.84, p0[1] + (p1[1] - p0[1]) * 0.84)
        for (cx, cy), card in ((ca, card_a), (cb, card_b)):
            w = c.text_w(card, 13, bold=True) + 12
            c.box(cx - w / 2, cy - 12, w, 24, fill=WHITE, outline=GREEN_D, width=2, radius=6)
            c.text(cx, cy, card, 13, GREEN_D, bold=True, anchor='mm')
        c.pill(mx, my, verb, 11, GREEN)

    # liens (cardinalités Merise : (min,max) côté de chaque entité)
    connect('Role', 'b', 'Utilisateur', 't', 'possède', '0,n', '1,1')
    connect('Utilisateur', 'tr', 'Tracker', 'l', 'dispose', '1,1', '1,1')
    connect('Tracker', 'r', 'SaisieTracker', 'l', 'contient', '0,n', '1,1')
    connect('SaisieTracker', 'r', 'Emotion', 't', 'porte sur', '1,1', '0,n')
    connect('Utilisateur', 'b', 'ContactUrgence', 't', 'déclare', '0,n', '1,1')
    connect('Utilisateur', 'br', 'Feed', 'l', 'rédige', '0,n', '1,1')
    connect('Utilisateur', 'r', 'Audit', 'tl', 'génère', '0,n', '0,1')

    # auto-référence Emotion (hiérarchie niveau 1 -> 2)
    ex, ey, ew, eh = boxes['Emotion']
    c.line(ex + ew, ey + 40, ex + ew + 45, ey + 40, GREEN_D, 2)
    c.line(ex + ew + 45, ey + 40, ex + ew + 45, ey - 5, GREEN_D, 2)
    c.line(ex + ew + 45, ey - 5, ex + ew / 2, ey - 5, GREEN_D, 2)
    c.line(ex + ew / 2, ey - 5, ex + ew / 2, ey, GREEN_D, 2)
    c.pill(ex + ew + 45, ey + 18, 'hiérarchie', 10, GREEN)
    c.text(ex + ew + 52, ey + 40, '0,n', 12, GREEN_D, bold=True, anchor='lm')
    c.text(ex + ew / 2 + 10, ey - 13, '0,1', 12, GREEN_D, bold=True, anchor='lm')

    # dessin des entités (au-dessus des liens)
    for name, (x, y, w, attrs) in entities.items():
        bx, by, bw, bh = boxes[name]
        c.box(bx, by, bw, bh, fill=WHITE, outline=BLUE, width=2, radius=8)
        c.box(bx, by, bw, 34, fill=BLUE, outline=BLUE, radius=8)
        c.rect(bx, by + 20, bw, 14, fill=BLUE)
        c.text(bx + bw / 2, by + 17, name, 14, WHITE, bold=True, anchor='mm')
        for i, a in enumerate(attrs):
            ay = by + 34 + 6 + i * line_h + line_h / 2 - 4
            col = BLUE if a == attrs[0] else INK
            c.text(bx + 14, ay, a, 11, col, bold=(a == attrs[0] or a.endswith('#')))
            c.line(bx + 6, by + 34 + (i + 1) * line_h, bx + bw - 6,
                   by + 34 + (i + 1) * line_h, GREY_L, 1)

    c.save('mcd.png')


# ════════════════════════════════════════════════════════════════════
# 2. Diagramme de cas d'usage UML
# ════════════════════════════════════════════════════════════════════
def stick_figure(c, cx, cy, label, color=BLUE):
    c.ellipse(cx, cy - 26, 11, 11, fill=WHITE, outline=color, width=3)
    c.line(cx, cy - 15, cx, cy + 12, color, 3)       # tronc
    c.line(cx - 16, cy - 5, cx + 16, cy - 5, color, 3)  # bras
    c.line(cx, cy + 12, cx - 14, cy + 34, color, 3)  # jambe g
    c.line(cx, cy + 12, cx + 14, cy + 34, color, 3)  # jambe d
    for i, ln in enumerate(label.split('\n')):
        c.text(cx, cy + 52 + i * 16, ln, 12, GREY_D, bold=True, anchor='mm')


def diagram_usecase():
    c = Canvas(1480, 1020)
    title_bar(c, 30, 24, 1420, "Diagramme de cas d'usage (UML)",
              "Périmètre : modules retenus")

    # frontière système
    c.box(330, 95, 820, 880, fill=GREY_LL, outline=GREY, width=2, radius=14)
    c.text(740, 120, "Système CESIZen", 15, GREY, bold=True, anchor='mm')

    # acteurs
    stick_figure(c, 130, 300, "Visiteur\nanonyme")
    stick_figure(c, 130, 640, "Utilisateur\nconnecté")
    stick_figure(c, 1360, 470, "Administrateur", color=GREEN_D)

    modules = [
        ("Module Comptes utilisateurs", GREEN, [
            ("Créer un compte", 470, 200, ['V']),
            ("Se connecter / déconnecter", 470, 270, ['U']),
            ("Gérer son profil", 740, 200, ['U']),
            ("Réinitialiser mot de passe", 740, 270, ['U']),
            ("Exporter / anonymiser (RGPD)", 1010, 200, ['U']),
            ("Gérer les comptes", 1010, 270, ['A']),
        ]),
        ("Module Informations", BLUE, [
            ("Consulter les pages info", 470, 430, ['V', 'U']),
            ("Gérer les contenus (CRUD)", 1010, 430, ['A']),
        ]),
        ("Module Tracker d'émotions", YELLOW, [
            ("Consulter son journal", 470, 600, ['U']),
            ("Ajouter une saisie (wizard)", 740, 600, ['U']),
            ("Modifier / supprimer une saisie", 470, 690, ['U']),
            ("Visualiser un rapport", 740, 690, ['U']),
            ("Configurer les émotions", 1010, 645, ['A']),
        ]),
    ]

    actor_pt = {'V': (157, 300), 'U': (157, 640), 'A': (1333, 470)}
    # bandes de module
    bands = [(165, GREEN, 'Comptes utilisateurs'),
             (400, BLUE, 'Informations'),
             (560, (180, 150, 20), "Tracker d'émotions")]
    for y, col, lab in bands:
        c.text(350, y, lab.upper(), 9, col, bold=True, anchor='lm')

    for _, col, ucs in modules:
        for (name, cx, cy, actors) in ucs:
            for a in actors:
                ax, ay = actor_pt[a]
                c.line(ax, ay, cx, cy, GREY, 2)
    for _, col, ucs in modules:
        for (name, cx, cy, actors) in ucs:
            w = max(150, c.text_w(name, 11) + 30)
            c.ellipse(cx, cy, w / 2, 30, fill=WHITE, outline=col, width=3)
            c.text(cx, cy, name, 11, GREY_D, anchor='mm')

    c.save('usecase.png')


# ════════════════════════════════════════════════════════════════════
# 3 & 4. Diagrammes de séquence
# ════════════════════════════════════════════════════════════════════
def sequence(c, title, sub, lifelines, messages, notes=None):
    title_bar(c, 30, 24, c.w - 60, title, sub)
    top = 95
    n = len(lifelines)
    gap = (c.w - 180) / (n - 1)
    xs = {name: 90 + i * gap for i, name in enumerate(lifelines)}
    bottom = c.h - 50
    # têtes + lignes de vie
    for name, x in xs.items():
        w = max(150, c.text_w(name, 12, bold=True) + 30)
        c.box(x - w / 2, top, w, 44, fill=BLUE, outline=BLUE, radius=8)
        c.text(x, top + 22, name, 12, WHITE, bold=True, anchor='mm')
        c.line(x, top + 44, x, bottom, GREY, 2, dash=(7, 6))
    # messages
    y = top + 90
    for msg in messages:
        src, dst, label, kind = msg
        x0, x1 = xs[src], xs[dst]
        if src == dst:  # self-call
            c.line(x0, y, x0 + 55, y, BLUE, 2)
            c.line(x0 + 55, y, x0 + 55, y + 26, BLUE, 2)
            c.arrow(x0 + 55, y + 26, x0 + 4, y + 26, BLUE, 2, head=8)
            c.text(x0 + 62, y + 13, label, 11, GREY_D, anchor='lm')
            y += 52
            continue
        color = GREEN_D if kind == 'return' else BLUE
        dash = (6, 5) if kind == 'return' else None
        c.text((x0 + x1) / 2, y - 13, label, 11, GREY_D, anchor='mm')
        c.arrow(x0, y, x1, y, color, 2, head=9, dash=dash)
        y += 46
    if notes:
        for (nx, ny, txt) in notes:
            w = c.text_w(txt, 10) + 22
            c.box(nx - w / 2, ny, w, 26, fill=YELLOW, outline=(200, 180, 20), radius=4)
            c.text(nx, ny + 13, txt, 10, GREY_D, anchor='mm')


def diagram_seq_login():
    c = Canvas(1320, 760)
    sequence(
        c, "Séquence - Authentification JWT", "POST /v1/auth/login",
        ['Utilisateur', 'Client Web/Mobile', 'API Laravel', 'PostgreSQL'],
        [
            ('Utilisateur', 'Client Web/Mobile', 'saisit email + mot de passe', 'call'),
            ('Client Web/Mobile', 'API Laravel', 'POST /v1/auth/login', 'call'),
            ('API Laravel', 'API Laravel', 'LoginRequest::validate()', 'self'),
            ('API Laravel', 'PostgreSQL', 'SELECT utilisateur WHERE email', 'call'),
            ('PostgreSQL', 'API Laravel', 'utilisateur + hash', 'return'),
            ('API Laravel', 'API Laravel', 'Hash::check (bcrypt) + est_actif', 'self'),
            ('API Laravel', 'API Laravel', 'JWTAuth::fromUser() (claims rôle)', 'self'),
            ('API Laravel', 'Client Web/Mobile', '200 { utilisateur, token }', 'return'),
            ('Client Web/Mobile', 'Utilisateur', 'stocke token + redirige', 'return'),
        ],
        notes=[(660, 700, "Token JWT : SecureStore (mobile) / localStorage (web), expiration 60 min")]
    )
    c.save('seq_login.png')


def diagram_seq_saisie():
    c = Canvas(1320, 800)
    sequence(
        c, "Séquence - Ajout d'une saisie (wizard 3 étapes)", "POST /v1/tracker/saisies",
        ['Utilisateur', 'Client (wizard)', 'API Laravel', 'PostgreSQL'],
        [
            ('Utilisateur', 'Client (wizard)', 'Étape 1 : émotion de base', 'call'),
            ('Utilisateur', 'Client (wizard)', 'Étape 2 : sous-émotion + intensité', 'call'),
            ('Utilisateur', 'Client (wizard)', 'Étape 3 : date + note, valider', 'call'),
            ('Client (wizard)', 'API Laravel', 'POST /v1/tracker/saisies (Bearer)', 'call'),
            ('API Laravel', 'API Laravel', 'jwt.auth + StoreSaisieRequest', 'self'),
            ('API Laravel', 'PostgreSQL', 'INSERT saisie_trackers', 'call'),
            ('PostgreSQL', 'API Laravel', 'saisie créée', 'return'),
            ('API Laravel', 'Client (wizard)', '201 { saisie }', 'return'),
            ('Client (wizard)', 'Utilisateur', 'invalide le cache, MAJ journal', 'return'),
        ],
        notes=[(660, 740, "RG-TR-03 : une seule saisie par jour - sinon modification")]
    )
    c.save('seq_saisie.png')


# ════════════════════════════════════════════════════════════════════
# 5. Architecture MVC découplée
# ════════════════════════════════════════════════════════════════════
def diagram_mvc():
    c = Canvas(1320, 820)
    title_bar(c, 30, 24, 1260, "Architecture technique - Design Pattern MVC découplé")

    # Vues (clients)
    c.text(230, 110, "VUES (Clients)", 13, GREY, bold=True, anchor='mm')
    c.box(70, 140, 320, 110, fill=BLUE_L, outline=BLUE, radius=12)
    c.text(230, 170, "Frontend Web", 14, BLUE, bold=True, anchor='mm')
    c.text(230, 200, "Next.js 16 + React 19", 11, INK, anchor='mm')
    c.text(230, 222, "App Router · Zustand · TanStack Query", 9, GREY, anchor='mm')

    c.box(70, 280, 320, 110, fill=BLUE_L, outline=BLUE, radius=12)
    c.text(230, 310, "Application Mobile", 14, BLUE, bold=True, anchor='mm')
    c.text(230, 340, "React Native (Expo 53)", 11, INK, anchor='mm')
    c.text(230, 362, "Expo Router · SecureStore", 9, GREY, anchor='mm')

    # Contrôleur (API)
    c.text(720, 110, "CONTRÔLEUR", 13, GREY, bold=True, anchor='mm')
    c.box(560, 140, 320, 250, fill=WHITE, outline=GREEN_D, width=3, radius=12)
    c.text(720, 170, "API REST Laravel 11", 14, GREEN_D, bold=True, anchor='mm')
    for i, t in enumerate(["Routes /api/v1 (api.php)",
                           "Middleware : jwt.auth, role",
                           "FormRequests (validation)",
                           "Controllers (Auth, Profil,",
                           "  SaisieTracker, Feed, Admin...)",
                           "Services (RapportService)"]):
        c.text(580, 205 + i * 28, "• " + t if not t.startswith('  ') else t, 10, INK, anchor='lm')

    # Modèle + BDD
    c.text(1130, 110, "MODÈLE", 13, GREY, bold=True, anchor='mm')
    c.box(980, 140, 280, 130, fill=GREY_LL, outline=GREEN_D, width=2, radius=12)
    c.text(1120, 168, "Eloquent ORM", 13, GREEN_D, bold=True, anchor='mm')
    c.text(1120, 196, "8 modèles métier", 10, INK, anchor='mm')
    c.text(1120, 216, "Relations · Scopes · Casts", 9, GREY, anchor='mm')
    c.text(1120, 244, "SoftDeletes · JWTSubject", 9, GREY, anchor='mm')

    c.box(980, 300, 280, 90, fill=BLUE, outline=BLUE, radius=12)
    c.text(1120, 330, "PostgreSQL 16", 14, WHITE, bold=True, anchor='mm')
    c.text(1120, 360, "ACID · JSON · HDS", 10, BLUE_L, anchor='mm')

    # flèches
    c.arrow(390, 195, 555, 220, GREY_D, 2, head=10, double=True)
    c.arrow(390, 335, 555, 300, GREY_D, 2, head=10, double=True)
    c.text(470, 175, "JSON / HTTPS", 10, GREY, bold=True, anchor='mm')
    c.arrow(880, 230, 975, 210, GREY_D, 2, head=10, double=True)
    c.arrow(1120, 270, 1120, 298, GREY_D, 2, head=10, double=True)
    c.text(1120, 286, "SQL", 9, GREY, anchor='mm')

    # bandeau bas : justification
    c.box(70, 450, 1190, 320, fill=GREY_LL, outline=GREY_L, radius=12)
    c.text(95, 480, "Pourquoi ce découplage ?", 14, GREEN_D, bold=True, anchor='lm')
    pts = [
        "Séparation stricte Modèle / Logique / Présentation -> testabilité et maintenabilité.",
        "Une seule API REST alimente 2 clients (web + mobile) : logique métier non dupliquée.",
        "Évolutivité : ajout d'un client (TV, assistant vocal) ou d'un module sans toucher au modèle.",
        "Sécurité centralisée côté contrôleur : validation (FormRequest), authz (middleware role), JWT.",
        "Stack 100% open-source, conteneurisée (Docker Compose) : reproductibilité dev / staging / prod.",
    ]
    for i, p in enumerate(pts):
        c.check(106, 518 + i * 42, 15, GREEN_D, 3)
        c.text(140, 525 + i * 42, p, 12, INK, anchor='lm')

    c.save('mvc.png')


# ════════════════════════════════════════════════════════════════════
# 6. Mockups / wireframes
# ════════════════════════════════════════════════════════════════════
def phone_frame(c, x, y, w, h, title):
    c.box(x, y, w, h, fill=WHITE, outline=GREY_D, width=3, radius=28)
    c.box(x, y, w, 54, fill=BLUE, outline=BLUE, radius=28)
    c.rect(x, y + 30, w, 24, fill=BLUE)
    c.text(x + w / 2, y + 28, title, 13, WHITE, bold=True, anchor='mm')
    c.box(x + w / 2 - 28, y + 8, 56, 7, fill=BLUE_L, outline=BLUE_L, radius=4)


def ui_input(c, x, y, w, label, ph):
    c.text(x, y, label, 10, GREY, bold=True, anchor='lm')
    c.box(x, y + 8, w, 34, fill=GREY_LL, outline=GREY_L, width=1, radius=8)
    c.text(x + 10, y + 25, ph, 10, GREY, anchor='lm')


def ui_button(c, x, y, w, label, fill=GREEN):
    c.box(x, y, w, 40, fill=fill, outline=fill, radius=10)
    c.text(x + w / 2, y + 20, label, 12, WHITE, bold=True, anchor='mm')


def mockup_inscription():
    c = Canvas(440, 760)
    title_bar(c, 14, 14, 412, "Maquette - Inscription", fill=GREEN_D)
    x, y, w = 60, 80, 320
    phone_frame(c, x, y, w, 650, "Créer un compte")
    ix = x + 24
    ui_input(c, ix, y + 80, w - 48, "Prénom", "Claire")
    ui_input(c, ix, y + 145, w - 48, "Nom", "Martin")
    ui_input(c, ix, y + 210, w - 48, "Email", "claire@email.fr")
    ui_input(c, ix, y + 275, w - 48, "Mot de passe", "••••••••")
    ui_input(c, ix, y + 340, w - 48, "Confirmation", "••••••••")
    # case RGPD
    c.box(ix, y + 410, 22, 22, fill=GREEN, outline=GREEN, radius=5)
    c.check(ix + 5, y + 414, 13, WHITE, 3)
    c.text(ix + 32, y + 421, "J'accepte la politique de", 10, INK, anchor='lm')
    c.text(ix + 32, y + 438, "confidentialité (RGPD)", 10, INK, anchor='lm')
    ui_button(c, ix, y + 475, w - 48, "S'inscrire")
    c.text(x + w / 2, y + 545, "Déjà un compte ? Se connecter", 10, BLUE, anchor='mm')
    c.text(x + w / 2, y + 600, "RG-CU-02 : mot de passe ≥ 8 car. · RG-CU-03 : consentement requis",
           8, GREY, anchor='mm')
    c.save('mockup_inscription.png')


def mockup_wizard():
    c = Canvas(440, 760)
    title_bar(c, 14, 14, 412, "Maquette - Wizard saisie", fill=GREEN_D)
    x, y, w = 60, 80, 320
    phone_frame(c, x, y, w, 650, "Comment je me sens ?")
    ix = x + 24
    # progression
    for i, on in enumerate([True, True, False]):
        col = GREEN if on else GREY_L
        c.ellipse(ix + 20 + i * 130, y + 85, 14, 14, fill=col, outline=col)
        c.text(ix + 20 + i * 130, y + 85, str(i + 1), 11, WHITE, bold=True, anchor='mm')
        if i < 2:
            c.line(ix + 34 + i * 130, y + 85, ix + 136 + i * 130, y + 85, GREY_L, 3)
    c.text(ix, y + 125, "Étape 2/3 · Sous-émotion + intensité", 10, GREY, bold=True, anchor='lm')
    # émotion choisie
    c.box(ix, y + 145, w - 48, 50, fill=(255, 248, 200), outline=YELLOW, width=2, radius=10)
    c.ellipse(ix + 28, y + 170, 13, 13, fill=(255, 215, 0), outline=(225, 185, 0), width=2)
    c.text(ix + 52, y + 170, "Joie", 14, GREY_D, bold=True, anchor='lm')
    # sous-émotions
    subs = ['Fierté', 'Contentement', 'Enchantement', 'Excitation', 'Émerveillement', 'Gratitude']
    for i, s in enumerate(subs):
        sx = ix + (i % 2) * 140
        sy = y + 215 + (i // 2) * 50
        sel = (i == 0)
        c.box(sx, sy, 128, 38, fill=GREEN if sel else WHITE,
              outline=GREEN if sel else GREY_L, width=2, radius=10)
        c.text(sx + 64, sy + 19, s, 10, WHITE if sel else INK, bold=sel, anchor='mm')
    # slider intensité
    c.text(ix, y + 390, "Intensité : 7 / 10", 11, GREY_D, bold=True, anchor='lm')
    c.box(ix, y + 410, w - 48, 8, fill=GREY_L, outline=GREY_L, radius=4)
    c.box(ix, y + 410, (w - 48) * 0.7, 8, fill=GREEN, outline=GREEN, radius=4)
    c.ellipse(ix + (w - 48) * 0.7, y + 414, 14, 14, fill=WHITE, outline=GREEN, width=3)
    ui_button(c, ix, y + 460, w - 48, "Suivant  →")
    c.text(x + w / 2, y + 540, "RG-TR-02 : intensité 1-10 · RG-TR-04 : émotion obligatoire",
           8, GREY, anchor='mm')
    c.save('mockup_wizard.png')


def mockup_rapports():
    c = Canvas(620, 760)
    title_bar(c, 14, 14, 592, "Maquette - Rapport d'émotions (Web)", fill=GREEN_D)
    x, y, w, h = 40, 80, 540, 650
    # fenêtre navigateur
    c.box(x, y, w, h, fill=WHITE, outline=GREY_D, width=3, radius=14)
    c.box(x, y, w, 40, fill=GREY_L, outline=GREY_L, radius=14)
    c.rect(x, y + 22, w, 18, fill=GREY_L)
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        c.ellipse(x + 22 + i * 22, y + 20, 7, 7, fill=col, outline=col)
    c.text(x + w / 2, y + 20, "cesizen.fr / rapports", 10, GREY_D, anchor='mm')
    ix = x + 28
    c.text(ix, y + 70, "Mon rapport émotionnel", 16, BLUE, bold=True, anchor='lm')
    # onglets période
    for i, (p, on) in enumerate([('Semaine', False), ('Mois', True),
                                 ('Trimestre', False), ('Année', False)]):
        px = ix + i * 110
        c.box(px, y + 95, 100, 32, fill=GREEN if on else GREY_LL,
              outline=GREEN if on else GREY_L, width=1, radius=8)
        c.text(px + 50, y + 111, p, 11, WHITE if on else GREY_D, bold=on, anchor='mm')
    # cartes stats
    cards = [("Saisies", "24"), ("Intensité moy.", "6,4"), ("Émotion dom.", "Joie")]
    for i, (lab, val) in enumerate(cards):
        cx = ix + i * 165
        c.box(cx, y + 145, 150, 80, fill=BLUE_L, outline=BLUE_L, radius=12)
        c.text(cx + 75, y + 175, val, 20, BLUE, bold=True, anchor='mm')
        c.text(cx + 75, y + 205, lab, 10, GREY, anchor='mm')
    # graphe barres
    c.text(ix, y + 255, "Répartition par émotion", 12, GREY_D, bold=True, anchor='lm')
    bars = [("Joie", 0.85, (255, 200, 0)), ("Peur", 0.45, (153, 50, 204)),
            ("Tristesse", 0.35, (65, 105, 225)), ("Colère", 0.25, (220, 20, 60)),
            ("Surprise", 0.15, (255, 140, 0))]
    bx, by, bw = ix, y + 285, 480
    for i, (lab, v, col) in enumerate(bars):
        ry = by + i * 48
        c.text(bx, ry + 14, lab, 10, INK, anchor='lm')
        c.box(bx + 90, ry, (bw - 90) * v, 26, fill=col, outline=col, radius=6)
        c.text(bx + 96 + (bw - 90) * v, ry + 13, f"{int(v*100)}%", 9, GREY_D, anchor='lm')
    c.save('mockup_rapports.png')


def mockup_informations():
    c = Canvas(620, 760)
    title_bar(c, 14, 14, 592, "Maquette - Informations (pages de contenu)", fill=GREEN_D)
    x, y, w, h = 40, 80, 540, 650
    # fenêtre navigateur
    c.box(x, y, w, h, fill=WHITE, outline=GREY_D, width=3, radius=14)
    c.box(x, y, w, 40, fill=GREY_L, outline=GREY_L, radius=14)
    c.rect(x, y + 22, w, 18, fill=GREY_L)
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        c.ellipse(x + 22 + i * 22, y + 20, 7, 7, fill=col, outline=col)
    c.text(x + w / 2, y + 20, "cesizen.fr / informations", 10, GREY_D, anchor='mm')
    ix = x + 28
    c.text(ix, y + 68, "Santé mentale - Ressources", 16, BLUE, bold=True, anchor='lm')
    c.text(ix, y + 92, "Articles et conseils validés par nos professionnels", 10, GREY, anchor='lm')
    # cartes articles (liste publique)
    articles = [
        ("Comprendre le stress", ["Mécanismes du stress et signaux", "d'alerte à reconnaître au quotidien."]),
        ("5 exercices anti-anxiété", ["Respiration et ancrage pour apaiser", "une montée d'anxiété."]),
        ("Bien dormir, mieux vivre", ["L'impact du sommeil sur la santé", "mentale et routines de repos."]),
        ("Quand consulter ?", ["Repères pour identifier le moment", "d'aller voir un professionnel."]),
    ]
    cy0 = y + 118
    for i, (titre, lignes) in enumerate(articles):
        cardx = ix + (i % 2) * 258
        cardy = cy0 + (i // 2) * 152
        c.box(cardx, cardy, 240, 132, fill=GREY_LL, outline=GREY_L, width=1, radius=12)
        c.box(cardx, cardy, 240, 40, fill=BLUE_L, outline=BLUE_L, radius=12)
        c.rect(cardx, cardy + 22, 240, 18, fill=BLUE_L)
        c.text(cardx + 14, cardy + 20, titre, 11, BLUE, bold=True, anchor='lm')
        for j, ln in enumerate(lignes):
            c.text(cardx + 14, cardy + 62 + j * 19, ln, 9, INK, anchor='lm')
        c.text(cardx + 14, cardy + 112, "12 mai 2026  ·  Lire ->", 8, GREEN_D, bold=True, anchor='lm')
    # bandeau back-office admin
    ay = cy0 + 320
    c.box(ix, ay, w - 56, 40, fill=(255, 248, 200), outline=YELLOW, width=2, radius=10)
    c.text(ix + 14, ay + 20, "Back-office admin : créer / modifier / publier  ·  slug auto  ·  "
           "modération avant mise en ligne", 9, GREY_D, anchor='lm')
    c.text(x + w / 2, y + h - 14, "RG-INF-01 slug auto · RG-INF-02 brouillon/publié · RG-INF-06 modération",
           8, GREY, anchor='mm')
    c.save('mockup_informations.png')


# ════════════════════════════════════════════════════════════════════
def main():
    print("Génération des schémas CESIZen ->", OUT_DIR)
    diagram_mcd()
    diagram_usecase()
    diagram_seq_login()
    diagram_seq_saisie()
    diagram_mvc()
    mockup_inscription()
    mockup_wizard()
    mockup_informations()
    mockup_rapports()
    print("Terminé.")


if __name__ == '__main__':
    main()

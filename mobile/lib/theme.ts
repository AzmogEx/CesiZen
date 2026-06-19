// Design tokens centralisés — identité du Système de Design de l'État (DSFR).
// À utiliser partout au lieu de valeurs « magiques » inline, pour une UI cohérente.

/** Espacements (échelle 4px, comme le DSFR). */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

/** Rayons de bordure. Le DSFR est volontairement « carré » (rayons faibles). */
export const Radius = {
  sm: 4,
  md: 8,
  pill: 999,
} as const;

/** Tailles de police. */
export const FontSize = {
  tiny: 11,
  xs: 13,
  sm: 14,
  body: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 32,
} as const;

/** Graisses (typées pour React Native). */
export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

/** Ombres douces, discrètes (le DSFR reste sobre). */
export const Shadow = {
  card: {
    shadowColor: '#161616',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  raised: {
    shadowColor: '#161616',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

/** Cible tactile minimale recommandée (accessibilité). */
export const MIN_TOUCH = 44;

/** hitSlop standard pour agrandir la zone cliquable des petites icônes. */
export const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 } as const;

// Palette inspirée du Système de Design de l'État (DSFR / gouv.fr).
// Le DSFR est un framework web (HTML/CSS) ; ici on en applique uniquement
// l'identité visuelle via les couleurs des StyleSheet React Native.
export const Colors = {
  // Bleu France — couleur primaire / actions
  primary: '#000091',
  primaryDark: '#1212FF', // bleu survol / accent
  blueFranceSun: '#6A6AF4',
  // Rouge Marianne — accent institutionnel / alertes
  secondary: '#000091', // conservé en bleu pour les accents secondaires institutionnels
  secondaryDark: '#1212FF',
  rougeMarianne: '#E1000F',
  black: '#161616', // texte principal DSFR
  white: '#FFFFFF',
  // Échelle de gris DSFR (du plus clair au plus foncé)
  gray: {
    50: '#F6F6F6', // fond alternatif
    100: '#EEEEEE', // gris contrasté
    200: '#DDDDDD', // séparateurs / bordures
    300: '#CECECE',
    400: '#929292', // texte désactivé
    500: '#666666', // texte secondaire / mention
    600: '#3A3A3A',
    700: '#2A2A2A',
    800: '#1F1F1F',
    900: '#161616',
  },
  // États DSFR
  success: '#18753C',
  successBg: '#B8FEC9',
  error: '#CE0500',
  errorBg: '#FFE9E9',
  info: '#0063CB',
  warning: '#B34000',
  // Couleurs par émotion — issues du référentiel, conservées telles quelles
  emotions: {
    joie: '#FFD700',
    colere: '#DC143C',
    peur: '#9932CC',
    tristesse: '#4169E1',
    surprise: '#FF8C00',
    degout: '#228B22',
  },
};

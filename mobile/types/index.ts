export interface Role {
  id: number;
  nom: string;
  description: string | null;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role_id: number;
  role: Role;
  est_actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Emotion {
  id: number;
  nom: string;
  couleur: string;
  icone: string | null;
  niveau: number;
  parent_id: number | null;
  est_actif: boolean;
  enfants?: Emotion[];
}

export interface SaisieTracker {
  id: number;
  tracker_id: number;
  emotion_id: number;
  emotion: Emotion;
  intensite: number;
  note: string | null;
  date_saisie: string;
  created_at: string;
}

export interface Feed {
  id: number;
  titre: string;
  slug: string;
  contenu: string;
  image_url: string | null;
  est_publie: boolean;
  auteur_id: number;
  auteur?: { id: number; nom: string; prenom: string };
  ordre: number;
  created_at: string;
}

export interface RapportStats {
  total_saisies: number;
  intensite_moyenne: number;
  emotion_dominante: {
    nom: string;
    couleur: string;
    icone: string | null;
    count: number;
  } | null;
}

export interface RapportData {
  periode: string;
  date_debut: string;
  date_fin: string;
  stats: RapportStats;
  repartition: {
    nom: string;
    couleur: string;
    icone: string | null;
    count: number;
    pourcentage: number;
    intensite_moyenne: number;
  }[];
  evolution: {
    labels: string[];
    intensite_moyenne: number[];
    emotions: {
      nom: string;
      couleur: string;
      data: number[];
    }[];
  };
}

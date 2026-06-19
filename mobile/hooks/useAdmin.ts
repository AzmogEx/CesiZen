import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Emotion, Feed, Utilisateur } from '@/types';

// Toutes les requêtes ci-dessous tapent les routes /admin/* du backend,
// protégées par le middleware role:administrateur.

/** Normalise une réponse paginée Laravel ({data:[...]}) ou un tableau brut. */
function unwrap<T>(payload: { data?: T } | T): T {
  const body = payload as { data?: T };
  return (body?.data ?? payload) as T;
}

// ----------------------------- Utilisateurs --------------------------------

export function useAdminUtilisateurs() {
  return useQuery<Utilisateur[]>({
    queryKey: ['admin', 'utilisateurs'],
    queryFn: async () => unwrap<Utilisateur[]>((await api.get('/admin/utilisateurs')).data),
  });
}

export interface NouvelUtilisateur {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

export function useCreateUtilisateur() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NouvelUtilisateur) => (await api.post('/admin/utilisateurs', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'utilisateurs'] }),
  });
}

export function useToggleUtilisateurActif() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.patch(`/admin/utilisateurs/${id}/toggle-active`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'utilisateurs'] }),
  });
}

export function useDeleteUtilisateur() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/admin/utilisateurs/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'utilisateurs'] }),
  });
}

// -------------------------------- Feeds ------------------------------------

export function useAdminFeeds() {
  return useQuery<Feed[]>({
    queryKey: ['admin', 'feeds'],
    queryFn: async () => unwrap<Feed[]>((await api.get('/admin/feeds')).data),
  });
}

export interface FeedPayload {
  titre: string;
  contenu: string;
  image_url?: string | null;
  est_publie: boolean;
  ordre: number;
}

export function useSaveFeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: FeedPayload & { id?: number }) =>
      id ? (await api.put(`/admin/feeds/${id}`, data)).data : (await api.post('/admin/feeds', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'feeds'] }),
  });
}

export function useDeleteFeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/admin/feeds/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'feeds'] }),
  });
}

// ------------------------------- Émotions ----------------------------------

export function useAdminEmotions() {
  return useQuery<Emotion[]>({
    queryKey: ['admin', 'emotions'],
    queryFn: async () => unwrap<Emotion[]>((await api.get('/admin/emotions')).data),
  });
}

export interface EmotionPayload {
  nom: string;
  couleur: string;
  icone?: string | null;
  niveau: number;
  parent_id?: number | null;
  est_actif: boolean;
}

export function useSaveEmotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: EmotionPayload & { id?: number }) =>
      id ? (await api.put(`/admin/emotions/${id}`, data)).data : (await api.post('/admin/emotions', data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'emotions'] }),
  });
}

export function useDeleteEmotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/admin/emotions/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'emotions'] }),
  });
}

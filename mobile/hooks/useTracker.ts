import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { SaisieTracker } from '@/types';

interface SaisieFilters {
  date_debut?: string;
  date_fin?: string;
  emotion_id?: number;
}

export function useSaisies(filters?: SaisieFilters) {
  return useQuery<SaisieTracker[]>({
    queryKey: ['saisies', filters],
    queryFn: async () => {
      const response = await api.get('/tracker/saisies', { params: filters });
      return response.data.data ?? response.data;
    },
  });
}

export function useCreateSaisie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      emotion_id: number;
      intensite: number;
      note?: string;
      date_saisie?: string;
    }) => {
      const response = await api.post('/tracker/saisies', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisies'] });
    },
  });
}

export function useUpdateSaisie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: number;
      emotion_id?: number;
      intensite?: number;
      note?: string;
      date_saisie?: string;
    }) => {
      const response = await api.put(`/tracker/saisies/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisies'] });
    },
  });
}

export function useDeleteSaisie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/tracker/saisies/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saisies'] });
    },
  });
}

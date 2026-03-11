import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Emotion } from '@/types';

export function useEmotions() {
  return useQuery<Emotion[]>({
    queryKey: ['emotions'],
    queryFn: async () => {
      const response = await api.get('/emotions');
      return response.data;
    },
  });
}

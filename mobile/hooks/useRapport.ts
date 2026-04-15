import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { RapportData } from '@/types';

export function useRapport(period: 'week' | 'month' | 'quarter' | 'year') {
  return useQuery<RapportData>({
    queryKey: ['rapport', period],
    queryFn: async () => {
      const response = await api.get('/tracker/rapports', { params: { period } });
      return response.data;
    },
    enabled: !!period,
  });
}

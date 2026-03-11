import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Feed } from '@/types';

export function useFeeds() {
  return useQuery<Feed[]>({
    queryKey: ['feeds'],
    queryFn: async () => {
      const response = await api.get('/feeds');
      return response.data;
    },
  });
}

export function useFeed(slug: string) {
  return useQuery<Feed>({
    queryKey: ['feeds', slug],
    queryFn: async () => {
      const response = await api.get(`/feeds/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

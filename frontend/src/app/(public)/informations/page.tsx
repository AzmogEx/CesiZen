'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar } from 'lucide-react';
import { useFeeds } from '@/hooks/useFeeds';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

export default function InformationsPage() {
  const { data: feeds, isLoading } = useFeeds();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Informations & Ressources
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Des contenus validés sur la santé mentale, la gestion du stress
          et le bien-être émotionnel.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton variant="rect" className="h-48 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : feeds && feeds.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {feeds.map((feed) => (
            <Link key={feed.id} href={`/informations/${feed.slug}`}>
              <Card hover className="h-full">
                {feed.image_url && (
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={feed.image_url}
                      alt={feed.titre}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-malachite-500" />
                  <span className="text-xs font-medium text-malachite-600 dark:text-malachite-400 uppercase tracking-wide">
                    Article
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {feed.titre}
                </h2>
                <div
                  className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: (feed.contenu ?? '').replace(/<[^>]*>/g, '').substring(0, 200) + '...',
                  }}
                />
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar size={14} />
                  {new Date(feed.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Aucun article disponible pour le moment</p>
        </div>
      )}
    </div>
  );
}

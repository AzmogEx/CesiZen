'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useFeed } from '@/hooks/useFeeds';
import Skeleton from '@/components/ui/Skeleton';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: feed, isLoading, error } = useFeed(slug);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton variant="rect" className="h-64 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
          Article introuvable
        </p>
        <Link
          href="/informations"
          className="text-malachite-600 dark:text-malachite-400 hover:underline"
        >
          ← Retour aux informations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/informations"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour aux informations
      </Link>

      {feed.image_url && (
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-8">
          <img
            src={feed.image_url}
            alt={feed.titre}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {feed.titre}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 dark:text-gray-500 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        {feed.auteur && (
          <div className="flex items-center gap-1.5">
            <User size={14} />
            {feed.auteur.prenom} {feed.auteur.nom}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          {new Date(feed.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      <article
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-malachite-600 dark:prose-a:text-malachite-400"
        dangerouslySetInnerHTML={{ __html: feed.contenu }}
      />
    </div>
  );
}

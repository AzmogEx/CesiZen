'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';
import api from '@/lib/api';

interface AdminStats {
  total_utilisateurs: number;
  total_feeds: number;
  total_emotions: number;
  total_saisies: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, feedsRes, emotionsRes] = await Promise.all([
          api.get('/admin/utilisateurs'),
          api.get('/admin/feeds'),
          api.get('/admin/emotions'),
        ]);
        setStats({
          total_utilisateurs: Array.isArray(usersRes.data) ? usersRes.data.length : usersRes.data?.data?.length || 0,
          total_feeds: Array.isArray(feedsRes.data) ? feedsRes.data.length : feedsRes.data?.data?.length || 0,
          total_emotions: Array.isArray(emotionsRes.data) ? emotionsRes.data.length : emotionsRes.data?.data?.length || 0,
          total_saisies: 0,
        });
      } catch {
        // Silencieux
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Utilisateurs',
      value: stats?.total_utilisateurs || 0,
      icon: <Users size={24} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Articles',
      value: stats?.total_feeds || 0,
      icon: <FileText size={24} />,
      color: 'text-malachite-500',
      bg: 'bg-malachite-50 dark:bg-malachite-950/30',
    },
    {
      label: 'Émotions',
      value: stats?.total_emotions || 0,
      icon: <Heart size={24} />,
      color: 'text-candlelight-500',
      bg: 'bg-candlelight-50 dark:bg-candlelight-950/30',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Administration
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vue d&apos;ensemble de la plateforme CESIZen
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : card.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/admin/utilisateurs"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Users size={20} className="text-blue-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Gérer les utilisateurs</span>
          </Link>
          <Link
            href="/admin/contenus"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FileText size={20} className="text-malachite-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Gérer les contenus</span>
          </Link>
          <Link
            href="/admin/emotions"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Heart size={20} className="text-candlelight-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Gérer les émotions</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

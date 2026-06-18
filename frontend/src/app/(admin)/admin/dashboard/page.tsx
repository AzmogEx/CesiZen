'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    { label: 'Utilisateurs', value: stats?.total_utilisateurs || 0, icon: 'fr-icon-user-line' },
    { label: 'Articles', value: stats?.total_feeds || 0, icon: 'fr-icon-article-line' },
    { label: 'Émotions', value: stats?.total_emotions || 0, icon: 'fr-icon-heart-line' },
  ];

  const quickActions = [
    { href: '/admin/utilisateurs', icon: 'fr-icon-user-line', label: 'Gérer les utilisateurs' },
    { href: '/admin/contenus', icon: 'fr-icon-article-line', label: 'Gérer les contenus' },
    { href: '/admin/emotions', icon: 'fr-icon-heart-line', label: 'Gérer les émotions' },
  ];

  return (
    <div>
      <h1>Administration</h1>
      <p className="fr-text--lead fr-mb-4w">
        Vue d&apos;ensemble de la plateforme CESIZen
      </p>

      <div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        {statCards.map((card) => (
          <div className="fr-col-12 fr-col-md-4" key={card.label}>
            <div className="fr-tile fr-tile--horizontal">
              <div className="fr-tile__body">
                <div className="fr-tile__content">
                  <h2 className="fr-tile__title">
                    <span className={`${card.icon} fr-mr-1w`} aria-hidden="true" />
                    {card.label}
                  </h2>
                  <p className="fr-tile__detail fr-text--bold fr-display--xs">
                    {loading ? '…' : card.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Actions rapides</h2>
      <div className="fr-grid-row fr-grid-row--gutters">
        {quickActions.map((action) => (
          <div className="fr-col-12 fr-col-md-4" key={action.href}>
            <div className="fr-tile fr-tile--horizontal fr-enlarge-link">
              <div className="fr-tile__body">
                <div className="fr-tile__content">
                  <h3 className="fr-tile__title">
                    <Link href={action.href}>
                      <span className={`${action.icon} fr-mr-1w`} aria-hidden="true" />
                      {action.label}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

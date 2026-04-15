'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import type { Feed } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminContenusPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    contenu: '',
    image_url: '',
    est_publie: true,
    ordre: 0,
  });

  const fetchFeeds = async () => {
    try {
      const res = await api.get('/admin/feeds');
      setFeeds(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeeds(); }, []);

  const openCreate = () => {
    setEditingFeed(null);
    setForm({ titre: '', contenu: '', image_url: '', est_publie: true, ordre: 0 });
    setModalOpen(true);
  };

  const openEdit = (feed: Feed) => {
    setEditingFeed(feed);
    setForm({
      titre: feed.titre,
      contenu: feed.contenu,
      image_url: feed.image_url || '',
      est_publie: feed.est_publie,
      ordre: feed.ordre,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingFeed) {
        await api.put(`/admin/feeds/${editingFeed.id}`, form);
        toast.success('Article mis à jour');
      } else {
        await api.post('/admin/feeds', form);
        toast.success('Article créé');
      }
      setModalOpen(false);
      await fetchFeeds();
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      await api.delete(`/admin/feeds/${id}`);
      await fetchFeeds();
      toast.success('Article supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Contenus
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les articles et ressources de la plateforme
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} />
          Nouvel article
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-48 mb-2" />
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full" />
            </Card>
          ))}
        </div>
      ) : feeds.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-600 mb-4">Aucun article</p>
          <Button onClick={openCreate} size="sm">Créer le premier article</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {feeds.map((feed) => (
            <Card key={feed.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {feed.titre}
                  </h3>
                  <Badge color={feed.est_publie ? '#06c656' : '#9ca3af'}>
                    {feed.est_publie ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  /{feed.slug} · Ordre: {feed.ordre}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(feed)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Modifier"
                >
                  <Edit2 size={16} className="text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(feed.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal création/édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFeed ? 'Modifier l\'article' : 'Nouvel article'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Contenu (HTML)
            </label>
            <textarea
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              rows={10}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-candlelight-500 font-mono text-sm resize-none"
            />
          </div>
          <Input
            label="URL de l'image (optionnel)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                value={form.ordre}
                onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.est_publie}
                  onChange={(e) => setForm({ ...form, est_publie: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-malachite-500 focus:ring-malachite-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Publié
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formLoading}>
              {editingFeed ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

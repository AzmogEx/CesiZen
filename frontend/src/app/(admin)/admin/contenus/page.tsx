'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Feed } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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
      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col">
          <h1 className="fr-mb-1v">Contenus</h1>
          <p className="fr-text--sm fr-mb-0">
            Gérez les articles et ressources de la plateforme
          </p>
        </div>
        <div className="fr-col-auto">
          <button
            type="button"
            className="fr-btn fr-btn--icon-left fr-icon-add-line"
            onClick={openCreate}
          >
            Nouvel article
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : feeds.length === 0 ? (
        <div className="fr-callout">
          <p className="fr-callout__text">Aucun article pour le moment.</p>
          <button type="button" className="fr-btn fr-btn--icon-left fr-icon-add-line" onClick={openCreate}>
            Créer le premier article
          </button>
        </div>
      ) : (
        <div className="fr-table fr-table--bordered">
          <table>
            <thead>
              <tr>
                <th scope="col">Titre</th>
                <th scope="col">Slug</th>
                <th scope="col">Ordre</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map((feed) => (
                <tr key={feed.id}>
                  <td>{feed.titre}</td>
                  <td>/{feed.slug}</td>
                  <td>{feed.ordre}</td>
                  <td>
                    <span className={`fr-badge fr-badge--sm ${feed.est_publie ? 'fr-badge--success' : 'fr-badge--info'}`}>
                      {feed.est_publie ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td>
                    <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
                      <li>
                        <button
                          type="button"
                          onClick={() => openEdit(feed)}
                          className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-edit-line"
                          title="Modifier"
                        >
                          Modifier
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleDelete(feed.id)}
                          className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-delete-line"
                          title="Supprimer"
                        >
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal création/édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingFeed ? 'Modifier l\'article' : 'Nouvel article'} size="lg">
        <form onSubmit={handleSubmit} className="fr-mt-2w">
          <Input
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            required
          />
          <div className="fr-input-group">
            <label className="fr-label" htmlFor="feed-contenu">
              Contenu (HTML)
            </label>
            <textarea
              id="feed-contenu"
              className="fr-input"
              value={form.contenu}
              onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              rows={10}
              required
            />
          </div>
          <Input
            label="URL de l'image (optionnel)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-6">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="feed-ordre">
                  Ordre d&apos;affichage
                </label>
                <input
                  id="feed-ordre"
                  type="number"
                  className="fr-input"
                  value={form.ordre}
                  onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="fr-col-6">
              <div className="fr-checkbox-group">
                <input
                  type="checkbox"
                  id="feed-publie"
                  checked={form.est_publie}
                  onChange={(e) => setForm({ ...form, est_publie: e.target.checked })}
                />
                <label className="fr-label" htmlFor="feed-publie">
                  Publié
                </label>
              </div>
            </div>
          </div>
          <ul className="fr-btns-group fr-btns-group--inline fr-mt-2w">
            <li>
              <Button type="submit" loading={formLoading}>
                {editingFeed ? 'Mettre à jour' : 'Créer'}
              </Button>
            </li>
            <li>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
            </li>
          </ul>
        </form>
      </Modal>
    </div>
  );
}

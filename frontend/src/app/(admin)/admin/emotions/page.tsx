'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Emotion } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminEmotionsPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    couleur: '#fce117',
    icone: '',
    niveau: 1,
    parent_id: null as number | null,
    est_actif: true,
  });

  const fetchEmotions = async () => {
    try {
      const res = await api.get('/admin/emotions');
      setEmotions(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmotions(); }, []);

  const parentEmotions = emotions.filter((e) => e.niveau === 1);

  const openCreate = (parentId?: number) => {
    setEditingEmotion(null);
    setForm({
      nom: '',
      couleur: '#fce117',
      icone: '',
      niveau: parentId ? 2 : 1,
      parent_id: parentId || null,
      est_actif: true,
    });
    setModalOpen(true);
  };

  const openEdit = (emotion: Emotion) => {
    setEditingEmotion(emotion);
    setForm({
      nom: emotion.nom,
      couleur: emotion.couleur,
      icone: emotion.icone || '',
      niveau: emotion.niveau,
      parent_id: emotion.parent_id,
      est_actif: emotion.est_actif,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...form, icone: form.icone || null };
      if (editingEmotion) {
        await api.put(`/admin/emotions/${editingEmotion.id}`, payload);
        toast.success('Émotion mise à jour');
      } else {
        await api.post('/admin/emotions', payload);
        toast.success('Émotion créée');
      }
      setModalOpen(false);
      await fetchEmotions();
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette émotion ?')) return;
    try {
      await api.delete(`/admin/emotions/${id}`);
      await fetchEmotions();
      toast.success('Émotion supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const colorSwatch = (couleur: string) => (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        backgroundColor: couleur,
        verticalAlign: 'middle',
        marginRight: '0.5rem',
      }}
    />
  );

  return (
    <div>
      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col">
          <h1 className="fr-mb-1v">Émotions</h1>
          <p className="fr-text--sm fr-mb-0">
            Gérez le catalogue des émotions disponibles (2 niveaux)
          </p>
        </div>
        <div className="fr-col-auto">
          <button
            type="button"
            className="fr-btn fr-btn--icon-left fr-icon-add-line"
            onClick={() => openCreate()}
          >
            Nouvelle émotion
          </button>
        </div>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : emotions.length === 0 ? (
        <div className="fr-callout">
          <p className="fr-callout__text">Aucune émotion pour le moment.</p>
          <button type="button" className="fr-btn fr-btn--icon-left fr-icon-add-line" onClick={() => openCreate()}>
            Créer la première émotion
          </button>
        </div>
      ) : (
        <div className="fr-table fr-table--bordered">
          <table>
            <thead>
              <tr>
                <th scope="col">Émotion</th>
                <th scope="col">Niveau</th>
                <th scope="col">Couleur</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parentEmotions.map((emotion) => (
                <FragmentRows
                  key={emotion.id}
                  emotion={emotion}
                  colorSwatch={colorSwatch}
                  onAddChild={openCreate}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal création/édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEmotion ? 'Modifier l\'émotion' : 'Nouvelle émotion'}>
        <form onSubmit={handleSubmit} className="fr-mt-2w">
          <Input
            label="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-6">
              <div className="fr-input-group">
                <label className="fr-label" htmlFor="emotion-couleur">Couleur</label>
                <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
                  <div className="fr-col-auto">
                    <input
                      id="emotion-couleur"
                      type="color"
                      value={form.couleur}
                      onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                      style={{ width: '2.5rem', height: '2.5rem', border: 'none', padding: 0, cursor: 'pointer' }}
                    />
                  </div>
                  <div className="fr-col">
                    <input
                      type="text"
                      className="fr-input"
                      value={form.couleur}
                      onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-6">
              <Input
                label="Icône (emoji)"
                value={form.icone}
                onChange={(e) => setForm({ ...form, icone: e.target.value })}
                placeholder="😊"
              />
            </div>
          </div>
          {form.niveau === 2 && (
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="emotion-parent">Émotion parente</label>
              <select
                id="emotion-parent"
                className="fr-select"
                value={form.parent_id || ''}
                onChange={(e) => setForm({ ...form, parent_id: Number(e.target.value) || null })}
              >
                <option value="">Sélectionner…</option>
                {parentEmotions.map((e) => (
                  <option key={e.id} value={e.id}>{e.icone} {e.nom}</option>
                ))}
              </select>
            </div>
          )}
          <div className="fr-checkbox-group">
            <input
              type="checkbox"
              id="emotion-actif"
              checked={form.est_actif}
              onChange={(e) => setForm({ ...form, est_actif: e.target.checked })}
            />
            <label className="fr-label" htmlFor="emotion-actif">
              Active
            </label>
          </div>
          <ul className="fr-btns-group fr-btns-group--inline fr-mt-2w">
            <li>
              <Button type="submit" loading={formLoading}>
                {editingEmotion ? 'Mettre à jour' : 'Créer'}
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

function FragmentRows({
  emotion,
  colorSwatch,
  onAddChild,
  onEdit,
  onDelete,
}: {
  emotion: Emotion;
  colorSwatch: (couleur: string) => React.ReactNode;
  onAddChild: (parentId?: number) => void;
  onEdit: (emotion: Emotion) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <>
      <tr>
        <td>
          <span className="fr-mr-1w" aria-hidden="true">{emotion.icone || '🔵'}</span>
          <strong>{emotion.nom}</strong>
        </td>
        <td><span className="fr-badge fr-badge--sm">Niveau 1</span></td>
        <td>{colorSwatch(emotion.couleur)}<span className="fr-text--xs">{emotion.couleur}</span></td>
        <td>
          <span className={`fr-badge fr-badge--sm ${emotion.est_actif ? 'fr-badge--success' : 'fr-badge--error'}`}>
            {emotion.est_actif ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
            <li>
              <button
                type="button"
                onClick={() => onAddChild(emotion.id)}
                className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-add-line"
                title="Ajouter une sous-émotion"
              >
                Sous-émotion
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onEdit(emotion)}
                className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-edit-line"
                title="Modifier"
              >
                Modifier
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onDelete(emotion.id)}
                className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-delete-line"
                title="Supprimer"
              >
                Supprimer
              </button>
            </li>
          </ul>
        </td>
      </tr>
      {emotion.enfants?.map((child) => (
        <tr key={child.id}>
          <td>
            <span className="fr-icon-arrow-right-line fr-icon--sm fr-mr-1w" aria-hidden="true" />
            <span className="fr-mr-1w" aria-hidden="true">{child.icone || '🔵'}</span>
            {child.nom}
          </td>
          <td><span className="fr-badge fr-badge--sm fr-badge--info">Niveau 2</span></td>
          <td>{colorSwatch(child.couleur)}<span className="fr-text--xs">{child.couleur}</span></td>
          <td>
            <span className={`fr-badge fr-badge--sm ${child.est_actif ? 'fr-badge--success' : 'fr-badge--error'}`}>
              {child.est_actif ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td>
            <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
              <li>
                <button
                  type="button"
                  onClick={() => onEdit(child)}
                  className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-edit-line"
                  title="Modifier"
                >
                  Modifier
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onDelete(child.id)}
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
    </>
  );
}

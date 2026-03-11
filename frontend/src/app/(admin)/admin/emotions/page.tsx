'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import type { Emotion } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Émotions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez le catalogue des émotions disponibles
          </p>
        </div>
        <Button onClick={() => openCreate()} size="sm">
          <Plus size={16} />
          Nouvelle émotion
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-32" />
            </Card>
          ))}
        </div>
      ) : emotions.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-600 mb-4">Aucune émotion</p>
          <Button onClick={() => openCreate()} size="sm">Créer la première émotion</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {parentEmotions.map((emotion) => (
            <Card key={emotion.id}>
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${emotion.couleur}20` }}
                >
                  {emotion.icone || '🔵'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {emotion.nom}
                    </h3>
                    <Badge color={emotion.couleur}>{emotion.couleur}</Badge>
                    {!emotion.est_actif && (
                      <Badge color="#9ca3af">Inactif</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">Niveau 1</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openCreate(emotion.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Ajouter sous-émotion"
                  >
                    <Plus size={16} className="text-malachite-500" />
                  </button>
                  <button
                    onClick={() => openEdit(emotion)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 size={16} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(emotion.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Sous-émotions */}
              {emotion.enfants && emotion.enfants.length > 0 && (
                <div className="ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                  {emotion.enfants.map((child) => (
                    <div key={child.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-lg">{child.icone || '🔵'}</span>
                      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {child.nom}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: child.couleur }}
                      />
                      {!child.est_actif && <Badge color="#9ca3af">Inactif</Badge>}
                      <button
                        onClick={() => openEdit(child)}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Edit2 size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(child.id)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal création/édition */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEmotion ? 'Modifier l\'émotion' : 'Nouvelle émotion'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Couleur
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.couleur}
                  onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.couleur}
                  onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500 font-mono text-sm"
                />
              </div>
            </div>
            <Input
              label="Icône (emoji)"
              value={form.icone}
              onChange={(e) => setForm({ ...form, icone: e.target.value })}
              placeholder="😊"
            />
          </div>
          {form.niveau === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Émotion parente
              </label>
              <select
                value={form.parent_id || ''}
                onChange={(e) => setForm({ ...form, parent_id: Number(e.target.value) || null })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
              >
                <option value="">Sélectionner...</option>
                {parentEmotions.map((e) => (
                  <option key={e.id} value={e.id}>{e.icone} {e.nom}</option>
                ))}
              </select>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.est_actif}
              onChange={(e) => setForm({ ...form, est_actif: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-malachite-500 focus:ring-malachite-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formLoading}>
              {editingEmotion ? 'Mettre à jour' : 'Créer'}
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

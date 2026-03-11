'use client';

import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Trash2, Plus } from 'lucide-react';
import api from '@/lib/api';
import type { Utilisateur } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: '', prenom: '', email: '', password: '', password_confirmation: '', role_id: 2,
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/utilisateurs');
      setUtilisateurs(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleActive = async (id: number) => {
    try {
      await api.patch(`/admin/utilisateurs/${id}/toggle-active`);
      await fetchUsers();
      toast.success('Statut modifié');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/utilisateurs/${id}`);
      await fetchUsers();
      toast.success('Utilisateur supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/admin/utilisateurs', newUser);
      setCreateModalOpen(false);
      setNewUser({ nom: '', prenom: '', email: '', password: '', password_confirmation: '', role_id: 2 });
      await fetchUsers();
      toast.success('Utilisateur créé');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = utilisateurs.filter((u) =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (nom: string) => {
    switch (nom) {
      case 'administrateur': return '#ef4444';
      case 'membre': return '#06c656';
      default: return '#9ca3af';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Utilisateurs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} enregistré{utilisateurs.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} size="sm">
          <Plus size={16} />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <Input
          placeholder="Rechercher un utilisateur..."
          icon={<Search size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Utilisateur</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rôle</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Statut</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.prenom} {user.nom}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={roleColor(user.role?.nom)}>
                        {user.role?.nom || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm ${user.est_actif ? 'text-malachite-600' : 'text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${user.est_actif ? 'bg-malachite-500' : 'bg-red-500'}`} />
                        {user.est_actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title={user.est_actif ? 'Désactiver' : 'Activer'}
                        >
                          {user.est_actif
                            ? <UserX size={16} className="text-red-500" />
                            : <UserCheck size={16} className="text-malachite-500" />
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal création */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Nouvel utilisateur">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" value={newUser.prenom} onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })} required />
            <Input label="Nom" value={newUser.nom} onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} required />
          </div>
          <Input label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <Input label="Confirmer" type="password" value={newUser.password_confirmation} onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rôle</label>
            <select
              value={newUser.role_id}
              onChange={(e) => setNewUser({ ...newUser, role_id: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-candlelight-500"
            >
              <option value={2}>Membre</option>
              <option value={3}>Administrateur</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={formLoading}>Créer</Button>
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

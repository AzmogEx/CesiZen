'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Utilisateur } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function AdminUtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await api.delete(`/admin/utilisateurs/${deleteId}`);
      await fetchUsers();
      toast.success('Utilisateur supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
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
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = utilisateurs.filter((u) =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadgeClass = (nom?: string) => {
    switch (nom) {
      case 'administrateur': return 'fr-badge fr-badge--error';
      case 'membre': return 'fr-badge fr-badge--success';
      default: return 'fr-badge';
    }
  };

  return (
    <div>
      <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters fr-mb-4w">
        <div className="fr-col">
          <h1 className="fr-mb-1v">Utilisateurs</h1>
          <p className="fr-text--sm fr-mb-0">
            {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} enregistré{utilisateurs.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="fr-col-auto">
          <button
            type="button"
            className="fr-btn fr-btn--icon-left fr-icon-add-line"
            onClick={() => setCreateModalOpen(true)}
          >
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="fr-search-bar fr-mb-4w" role="search">
        <label className="fr-label" htmlFor="recherche-utilisateur">
          Rechercher un utilisateur
        </label>
        <input
          className="fr-input"
          id="recherche-utilisateur"
          type="search"
          placeholder="Rechercher un utilisateur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>

      {/* Table */}
      <div className="fr-table fr-table--bordered">
        <table>
          <thead>
            <tr>
              <th scope="col">Utilisateur</th>
              <th scope="col">Email</th>
              <th scope="col">Rôle</th>
              <th scope="col">Statut</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Chargement…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>Aucun utilisateur trouvé</td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td>{user.prenom} {user.nom}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={roleBadgeClass(user.role?.nom)}>
                      {user.role?.nom || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`fr-badge fr-badge--sm ${user.est_actif ? 'fr-badge--success' : 'fr-badge--error'}`}>
                      {user.est_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <ul className="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
                      <li>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user.id)}
                          className={`fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left ${user.est_actif ? 'fr-icon-close-circle-line' : 'fr-icon-checkbox-circle-line'}`}
                          title={user.est_actif ? 'Désactiver' : 'Activer'}
                        >
                          {user.est_actif ? 'Désactiver' : 'Activer'}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setDeleteId(user.id)}
                          className="fr-btn fr-btn--sm fr-btn--tertiary fr-btn--icon-left fr-icon-delete-line"
                          title="Supprimer"
                        >
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal création */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Nouvel utilisateur">
        <form onSubmit={handleCreate} className="fr-mt-2w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-6">
              <Input label="Prénom" value={newUser.prenom} onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })} required />
            </div>
            <div className="fr-col-6">
              <Input label="Nom" value={newUser.nom} onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} required />
            </div>
          </div>
          <Input label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <Input label="Mot de passe" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <Input label="Confirmer" type="password" value={newUser.password_confirmation} onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })} required />
          <div className="fr-select-group">
            <label className="fr-label" htmlFor="role-select">Rôle</label>
            <select
              id="role-select"
              className="fr-select"
              value={newUser.role_id}
              onChange={(e) => setNewUser({ ...newUser, role_id: Number(e.target.value) })}
            >
              <option value={2}>Membre</option>
              <option value={3}>Administrateur</option>
            </select>
          </div>
          <ul className="fr-btns-group fr-btns-group--inline fr-mt-2w">
            <li>
              <Button type="submit" loading={formLoading}>Créer</Button>
            </li>
            <li>
              <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Annuler</Button>
            </li>
          </ul>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Supprimer l'utilisateur"
        message="Cet utilisateur sera supprimé. Cette action est irréversible."
        confirmLabel="Supprimer"
        destructive
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}

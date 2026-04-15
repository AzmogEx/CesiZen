'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Mail, Lock, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function ProfilPage() {
  const { user, fetchUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    ancien_mot_de_passe: '',
    password: '',
    password_confirmation: '',
  });

  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profil', form);
      await fetchUser();
      setEditing(false);
      toast.success('Profil mis à jour');
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/profil/password', passwordForm);
      setChangingPassword(false);
      setPasswordForm({ ancien_mot_de_passe: '', password: '', password_confirmation: '' });
      toast.success('Mot de passe modifié');
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur lors du changement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/profil');
      toast.success('Compte supprimé');
      logout();
    } catch (err: unknown) {
      const axiosError = err as import('axios').AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mon profil
      </h1>

      {/* Infos du profil */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-malachite-100 dark:bg-malachite-900 flex items-center justify-center">
            <User size={28} className="text-malachite-600 dark:text-malachite-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Membre depuis le {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfil} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                icon={<User size={18} />}
                required
              />
              <Input
                label="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                icon={<User size={18} />}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={18} />}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>
                Enregistrer
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" onClick={() => {
            setForm({ nom: user?.nom || '', prenom: user?.prenom || '', email: user?.email || '' });
            setEditing(true);
          }}>
            Modifier mes informations
          </Button>
        )}
      </Card>

      {/* Changer mot de passe */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock size={20} className="text-gray-400" />
          <h3 className="font-display font-semibold text-gray-900 dark:text-white">
            Mot de passe
          </h3>
        </div>

        {changingPassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              value={passwordForm.ancien_mot_de_passe}
              onChange={(e) => setPasswordForm({ ...passwordForm, ancien_mot_de_passe: e.target.value })}
              required
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              required
            />
            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>
                Changer le mot de passe
              </Button>
              <Button variant="ghost" onClick={() => setChangingPassword(false)}>
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" onClick={() => setChangingPassword(true)}>
            Changer mon mot de passe
          </Button>
        )}
      </Card>

      {/* Zone dangereuse */}
      <Card className="border-red-200 dark:border-red-900">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-red-500" />
          <h3 className="font-display font-semibold text-red-600 dark:text-red-400">
            Zone dangereuse
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront effacées conformément au RGPD.
        </p>
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
          <Trash2 size={16} />
          Supprimer mon compte
        </Button>
      </Card>

      {/* Modal confirmation suppression */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDeleteAccount} loading={loading}>
            Oui, supprimer
          </Button>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
        </div>
      </Modal>
    </div>
  );
}

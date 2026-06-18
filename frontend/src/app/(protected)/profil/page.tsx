'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
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
    <div className="fr-container fr-py-6w">
      <div className="fr-grid-row fr-grid-row--center">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Mon profil</h1>

          {/* Infos du profil */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <h2 className="fr-h4 fr-mb-1v">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="fr-text--sm fr-mb-1v">{user?.email}</p>
            <p className="fr-text--xs fr-text-mention--grey fr-mb-3w">
              Membre depuis le{' '}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
            </p>

            {editing ? (
              <form onSubmit={handleUpdateProfil}>
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="profil-prenom">
                        Prénom
                      </label>
                      <input
                        id="profil-prenom"
                        className="fr-input"
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="profil-nom">
                        Nom
                      </label>
                      <input
                        id="profil-nom"
                        className="fr-input"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="fr-input-group">
                  <label className="fr-label" htmlFor="profil-email">
                    Email
                  </label>
                  <input
                    id="profil-email"
                    className="fr-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <ul className="fr-btns-group fr-btns-group--inline-md">
                  <li>
                    <Button type="submit" loading={loading}>
                      Enregistrer
                    </Button>
                  </li>
                  <li>
                    <Button variant="secondary" type="button" onClick={() => setEditing(false)}>
                      Annuler
                    </Button>
                  </li>
                </ul>
              </form>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setForm({
                    nom: user?.nom || '',
                    prenom: user?.prenom || '',
                    email: user?.email || '',
                  });
                  setEditing(true);
                }}
              >
                Modifier mes informations
              </Button>
            )}
          </div>

          {/* Changer mot de passe */}
          <div className="app-panel fr-p-3w fr-mb-3w">
            <h2 className="fr-h5">
              <span className="fr-icon-lock-line fr-mr-1w" aria-hidden="true" />
              Mot de passe
            </h2>

            {changingPassword ? (
              <form onSubmit={handleChangePassword}>
                <div className="fr-password fr-input-group">
                  <label className="fr-label" htmlFor="pwd-actuel">
                    Mot de passe actuel
                  </label>
                  <input
                    id="pwd-actuel"
                    className="fr-input"
                    type="password"
                    value={passwordForm.ancien_mot_de_passe}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, ancien_mot_de_passe: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="fr-password fr-input-group">
                  <label className="fr-label" htmlFor="pwd-nouveau">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="pwd-nouveau"
                    className="fr-input"
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="fr-password fr-input-group">
                  <label className="fr-label" htmlFor="pwd-confirm">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="pwd-confirm"
                    className="fr-input"
                    type="password"
                    value={passwordForm.password_confirmation}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        password_confirmation: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <ul className="fr-btns-group fr-btns-group--inline-md">
                  <li>
                    <Button type="submit" loading={loading}>
                      Changer le mot de passe
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setChangingPassword(false)}
                    >
                      Annuler
                    </Button>
                  </li>
                </ul>
              </form>
            ) : (
              <Button variant="secondary" onClick={() => setChangingPassword(true)}>
                Changer mon mot de passe
              </Button>
            )}
          </div>

          {/* Zone dangereuse — RGPD */}
          <div className="app-panel fr-p-3w">
            <h2 className="fr-h5">
              <span className="fr-icon-warning-line fr-mr-1w" aria-hidden="true" />
              Zone dangereuse
            </h2>
            <p className="fr-text--sm">
              La suppression de votre compte est irréversible. Toutes vos données
              seront effacées conformément au RGPD.
            </p>
            <Button
              variant="secondary"
              className="fr-icon-delete-line fr-btn--icon-left"
              onClick={() => setDeleteModalOpen(true)}
            >
              Supprimer mon compte
            </Button>
          </div>

          {/* Modal confirmation suppression */}
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirmer la suppression"
            size="sm"
          >
            <p>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </p>
            <ul className="fr-btns-group fr-btns-group--inline-md">
              <li>
                <Button variant="secondary" onClick={handleDeleteAccount} loading={loading}>
                  Oui, supprimer
                </Button>
              </li>
              <li>
                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                  Annuler
                </Button>
              </li>
            </ul>
          </Modal>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';

export default function InscriptionPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    consentement_rgpd: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(form);
      toast.success('Inscription réussie ! Bienvenue sur CESIZen.');
      router.push('/dashboard');
    } catch (error: unknown) {
      const axiosError = error as import('axios').AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const data = axiosError.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        toast.error(data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Créer un compte</h1>
      <p className="fr-text--lead">Créez votre compte CESIZen gratuitement.</p>

      <form onSubmit={handleSubmit}>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-6">
            <div className={`fr-input-group${errors.prenom ? ' fr-input-group--error' : ''}`}>
              <label className="fr-label" htmlFor="prenom">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                value={form.prenom}
                onChange={handleChange}
                required
                className="fr-input"
                placeholder="Jean"
                aria-describedby={errors.prenom ? 'prenom-error' : undefined}
              />
              {errors.prenom && (
                <p id="prenom-error" className="fr-error-text">
                  {errors.prenom[0]}
                </p>
              )}
            </div>
          </div>

          <div className="fr-col-12 fr-col-md-6">
            <div className={`fr-input-group${errors.nom ? ' fr-input-group--error' : ''}`}>
              <label className="fr-label" htmlFor="nom">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={form.nom}
                onChange={handleChange}
                required
                className="fr-input"
                placeholder="Dupont"
                aria-describedby={errors.nom ? 'nom-error' : undefined}
              />
              {errors.nom && (
                <p id="nom-error" className="fr-error-text">
                  {errors.nom[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={`fr-input-group${errors.email ? ' fr-input-group--error' : ''}`}>
          <label className="fr-label" htmlFor="email">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="fr-input"
            placeholder="vous@exemple.fr"
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="fr-error-text">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className={`fr-password${errors.password ? ' fr-input-group--error' : ''}`}>
          <label className="fr-label" htmlFor="password">
            Mot de passe
          </label>
          <div className="fr-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="fr-password__input fr-input"
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </div>
          {errors.password && (
            <p id="password-error" className="fr-error-text">
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="fr-input-group">
          <label className="fr-label" htmlFor="password_confirmation">
            Confirmer le mot de passe
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type={showPassword ? 'text' : 'password'}
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="fr-input"
            placeholder="Retapez votre mot de passe"
            autoComplete="new-password"
          />
        </div>

        <div className="fr-checkbox-group fr-checkbox-group--sm">
          <input
            id="password-show"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label className="fr-label" htmlFor="password-show">
            Afficher les mots de passe
          </label>
        </div>

        <div className={`fr-checkbox-group fr-mt-3w${errors.consentement_rgpd ? ' fr-input-group--error' : ''}`}>
          <input
            id="consentement_rgpd"
            name="consentement_rgpd"
            type="checkbox"
            checked={form.consentement_rgpd}
            onChange={handleChange}
            required
            aria-describedby={errors.consentement_rgpd ? 'consentement-error' : undefined}
          />
          <label className="fr-label" htmlFor="consentement_rgpd">
            J&apos;accepte le traitement de mes données personnelles conformément à la{' '}
            <Link href="/politique-de-confidentialite" className="fr-link">
              politique de confidentialité
            </Link>
            . Mes données sont protégées et je peux supprimer mon compte à tout moment.
          </label>
          {errors.consentement_rgpd && (
            <p id="consentement-error" className="fr-error-text">
              {errors.consentement_rgpd[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !form.consentement_rgpd}
          className="fr-btn fr-btn--lg fr-mt-3w"
        >
          {loading ? 'Inscription…' : 'Créer mon compte'}
        </button>
      </form>

      <p className="fr-mt-4w">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="fr-link">
          Se connecter
        </Link>
      </p>
    </>
  );
}

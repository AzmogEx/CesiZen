'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: unknown) {
      const axiosError = error as import('axios').AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || 'Identifiants incorrects';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Connexion</h1>
      <p className="fr-text--lead">Connectez-vous à votre compte CESIZen.</p>

      {errorMessage && (
        <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-3w" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="fr-input-group">
          <label className="fr-label" htmlFor="email">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="fr-input"
            placeholder="vous@exemple.fr"
            autoComplete="email"
          />
        </div>

        <div className="fr-password" id="password-group">
          <label className="fr-label" htmlFor="password">
            Mot de passe
          </label>
          <div className="fr-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="fr-password__input fr-input"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </div>
          <div className="fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm">
            <input
              id="password-show"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="fr-label" htmlFor="password-show">
              Afficher le mot de passe
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="fr-btn fr-btn--lg">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="fr-mt-4w">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="fr-link">
          Créer un compte
        </Link>
      </p>
    </>
  );
}

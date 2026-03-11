'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
    } catch (error: any) {
      const data = error?.response?.data;
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-candlelight-50 via-white to-malachite-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-4xl font-bold">
              <span className="text-malachite-600 dark:text-malachite-400">CESI</span>
              <span className="text-candlelight-500">ZEN</span>
            </h1>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-candlelight-500 focus:border-transparent outline-none transition-all"
                    placeholder="Jean"
                  />
                </div>
                {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom[0]}</p>}
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-candlelight-500 focus:border-transparent outline-none transition-all"
                  placeholder="Dupont"
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-candlelight-500 focus:border-transparent outline-none transition-all"
                  placeholder="vous@exemple.fr"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-candlelight-500 focus:border-transparent outline-none transition-all"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-candlelight-500 focus:border-transparent outline-none transition-all"
                  placeholder="Retapez votre mot de passe"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="consentement_rgpd"
                name="consentement_rgpd"
                type="checkbox"
                checked={form.consentement_rgpd}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 rounded border-gray-300 text-candlelight-500 focus:ring-candlelight-500"
              />
              <label htmlFor="consentement_rgpd" className="text-sm text-gray-600 dark:text-gray-400">
                J&apos;accepte le traitement de mes données personnelles conformément à la{' '}
                <Link href="/informations" className="text-malachite-600 dark:text-malachite-400 hover:underline">
                  politique de confidentialite
                </Link>
                . Mes données sont chiffrées et je peux supprimer mon compte à tout moment.
              </label>
            </div>
            {errors.consentement_rgpd && <p className="text-red-500 text-xs">{errors.consentement_rgpd[0]}</p>}

            <button
              type="submit"
              disabled={loading || !form.consentement_rgpd}
              className="w-full bg-malachite-500 hover:bg-malachite-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg mt-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Inscription...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-malachite-600 dark:text-malachite-400 font-medium hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

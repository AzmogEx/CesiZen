import axios from 'axios';
import { getApiError } from '../lib/api';

// expo-secure-store touche un module natif : on le mocke pour les tests unitaires.
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('getApiError', () => {
  it("extrait le message d'une erreur Axios", () => {
    const err = new axios.AxiosError('échec');
    err.response = {
      data: { message: 'Identifiants incorrects' },
    } as never;
    expect(getApiError(err).message).toBe('Identifiants incorrects');
  });

  it('extrait les erreurs de validation par champ', () => {
    const err = new axios.AxiosError('422');
    err.response = {
      data: { errors: { email: ['Cet email est déjà utilisé'] } },
    } as never;
    expect(getApiError(err).errors?.email).toEqual(['Cet email est déjà utilisé']);
  });

  it('retourne un objet vide pour une erreur non-Axios', () => {
    expect(getApiError(new Error('boom'))).toEqual({});
  });

  it('retourne un objet vide quand la réponse Axios est absente', () => {
    const err = new axios.AxiosError('réseau');
    expect(getApiError(err)).toEqual({});
  });
});

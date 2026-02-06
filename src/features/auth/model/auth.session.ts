import { authStorage } from './auth.storage';

export const isAuthenticated = (): boolean => {
  return Boolean(authStorage.getToken());
};

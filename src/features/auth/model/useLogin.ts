import { useMutation } from '@tanstack/react-query';
import { login } from './auth.api';
import { authStorage } from './auth.storage';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStorage.setToken(data.token);
    }
  });
};

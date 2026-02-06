import { LoginParams, LoginResponse } from './auth.types';

export const login = (params: LoginParams): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { login, password } = params;

      if (login === 'admin' && password === 'admin') {
        resolve({
          token: 'fake-jwt-token'
        });
      } else {
        reject(new Error('Неверный логин или пароль'));
      }
    }, 2000);
  });
};

//

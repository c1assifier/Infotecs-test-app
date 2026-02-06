import React, { useState } from 'react';
import { Button, Input, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../features/auth/model/useLogin';

export const LoginPage = () => {
  const { mutate, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const onSubmit = () => {
    mutate(
      {
        login: loginValue,
        password: passwordValue
      },
      {
        onSuccess: () => navigate('/users', { replace: true })
      }
    );
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <Typography.Title level={3}>Авторизация</Typography.Title>

      {isError && (
        <Alert
          type="error"
          message={error instanceof Error ? error.message : 'Ошибка'}
          style={{ marginBottom: 16 }}
        />
      )}

      <Input
        placeholder="Логин"
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      <Input.Password
        placeholder="Пароль"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Button type="primary" onClick={onSubmit} loading={isPending} block>
        Войти
      </Button>
    </div>
  );
};

import React from 'react';
import { Button } from 'antd';
import { authStorage } from '../../features/auth/model/auth.storage';
import { useNavigate } from 'react-router-dom';

export const UsersPage = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    authStorage.removeToken();
    navigate('/login');
  };

  return (
    <div>
      <h2>Users Page</h2>
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};

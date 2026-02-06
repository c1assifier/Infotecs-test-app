import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../features/auth/model/auth.session';

export const RootRedirect = () => {
  return isAuthenticated() ? (
    <Navigate to="/users" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};


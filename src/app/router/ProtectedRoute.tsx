import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../features/auth/model/auth.session';

type Props = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: Props) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

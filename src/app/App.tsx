import React from 'react';
import { AppRouter } from './router';
import { QueryProvider } from './providers/query';

export const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};

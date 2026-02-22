import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';

export default function Layout({ children }) {
  const { authState } = useAuthContext();

  if (authState.loading) return <div>Loading...</div>;
  if (!authState.user) return <Redirect to="/login" />;

  return (
    <AuthProvider>
      <div className="flex flex-col md:flex-row">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
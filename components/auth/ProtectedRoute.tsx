import React, { useEffect } from 'react';
import { useAuth } from '../auth';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, render children
  // Otherwise, render nothing (redirect is handled in useEffect)
  return isAuthenticated ? <>{children}</> : null;
};
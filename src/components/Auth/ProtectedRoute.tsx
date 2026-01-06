import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from '@docusaurus/router';
import { useLocation } from '@docusaurus/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <div>Please log in to access this content.</div>
}) => {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.user) {
    // Redirect to login page, preserving the original destination
    return (
      <Redirect
        to={{
          pathname: '/auth/login',
          state: { from: location }
        }}
      />
    );
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
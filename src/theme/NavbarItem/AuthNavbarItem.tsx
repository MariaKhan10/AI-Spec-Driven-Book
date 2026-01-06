import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from '@docusaurus/Link';

const AuthNavbarItem = (props) => {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (state.user) {
    // User is logged in
    return (
      <div className="navbar__item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem' }}>
            Welcome,{' '}
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
              {state.user.name || state.user.email.split('@')[0]}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="button button--secondary button--sm"
            style={{
              color: '#ffffff',
              backgroundColor: '#a30a0aff',
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  } else {
    // User is not logged in
    return (
      <div className="navbar__item" style={{ display: 'flex', gap: '0.5rem' }}>
        <Link
          to="/auth/login"
          className="button button--secondary button--sm"
          style={{
            textDecoration: 'none',
            padding: '0.25rem 1rem',
            borderRadius: '4px',
          }}
        >
          Sign In
        </Link>
        <Link
          to="/auth/register"
          className="button button--primary button--sm"
          style={{
            textDecoration: 'none',
            padding: '0.25rem 1rem',
            borderRadius: '4px',
          }}
        >
          Sign Up
        </Link>
      </div>
    );
  }
};

export default AuthNavbarItem;
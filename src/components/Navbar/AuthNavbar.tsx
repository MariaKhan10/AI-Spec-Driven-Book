import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from '@docusaurus/Link';
import styles from  "../../pages/index.module.css";


const AuthNavbar: React.FC = () => {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {state.user ? (
       <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginRight: '3.5rem', // 👈 pushes it to the right
  }}
>
  <span style={{ fontSize: '1.15rem' }}>
    Welcome,{' '}
    <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
      {state.user.name || state.user.email.split('@')[0]}
    </span>
  </span>

  <button
    onClick={handleLogout}
    className="button button--secondary button--md"
    style={{
      color: '#ffffff',
      backgroundColor: '#a30a0aff',
      padding: '0.25rem 0.75rem',
      fontSize: '0.9rem',
      borderRadius: '4px',
    }}
  >
    Logout
  </button>
</div>

      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to="/auth/login"
            className="navbar__link"
            style={{
              textDecoration: 'none',
              padding: '0.25rem 2rem',
              borderRadius: '4px',
              marginLeft:'2px'
            }}
          >
            Sign In
          </Link>
            <Link
            className={styles.ctaButton}
        to="/auth/register"

        style={{
          textDecoration: 'none',
          marginRight: '50px',
          padding : '4px 14px'
        }}
      >
        <span className={styles.buttonContent}>
          Sign Up
        </span>
      </Link>

        </div>
      )}
    </div>
  );
};

export default AuthNavbar;
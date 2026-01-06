import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

function SuccessPageContent() {
  const { siteConfig } = useDocusaurusContext();
  const { state } = useAuth();
  const baseUrl = siteConfig?.baseUrl || '/';

  const userName = state.user?.name || state.user?.email?.split('@')[0] || 'User';

  return (
    <Layout title="Registration Successful">
      <main
        style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, rgba(102,126,234,1), rgba(118,75,162,1))',
        }}
      >
        {/* Glass Card */}
        <div
          style={{
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#f3e4e4ff',
          }}
        >
          {/* Success Tick */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '4px solid #4ade80',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'scaleIn 0.6s ease-out',
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                color: '#4ade80',
                animation: 'tickPop 0.8s ease-out',
              }}
            >
              ✓
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Welcome {userName}! 🎉
          </h1>

          <p style={{ opacity: 0.9, marginBottom: '0.5rem' }}>
            Your account has been created successfully.
          </p>

          <p style={{ opacity: 0.75, marginBottom: '2rem', fontSize: '0.95rem' }}>
            You can now access personalized content based on your profile.
          </p>

          <p style={{ opacity: 0.85, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#4ade80' }}>
            <strong>Note:</strong> You are already logged in to your account.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link className="button button--primary button--lg" to={baseUrl}>
              Go to Home
            </Link>
            <Link
              className="button button--primary button--lg"
              to={`${baseUrl}auth/profile`}
            >
              Manage Profile
            </Link>
          </div>
        </div>

        {/* Animations */}
        <style>
          {`
            @keyframes scaleIn {
              from {
                transform: scale(0.6);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }

            @keyframes tickPop {
              0% {
                transform: scale(0);
              }
              60% {
                transform: scale(1.2);
              }
              100% {
                transform: scale(1);
              }
            }
          `}
        </style>
      </main>
    </Layout>
  );
}

export default function SuccessPage(): React.JSX.Element {
  return (
    <AuthProvider>
      <SuccessPageContent />
    </AuthProvider>
  );
}

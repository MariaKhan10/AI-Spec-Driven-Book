import React from 'react';
import Layout from '@theme/Layout';
import LoginForm from '@site/src/components/Auth/LoginForm';

export default function LoginPage(): React.JSX.Element {
  return (
    <Layout title="Sign In" description="Sign in to your account">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <LoginForm />
          </div>
        </div>
      </main>
    </Layout>
  );
}
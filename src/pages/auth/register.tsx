import React from 'react';
import Layout from '@theme/Layout';
import RegistrationForm from '@site/src/components/Auth/RegistrationForm';

export default function RegisterPage(): React.JSX.Element{
  return (
    <Layout title="Sign Up" description="Create a new account">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <RegistrationForm />
          </div>
        </div>
      </main>
    </Layout>
  );
}
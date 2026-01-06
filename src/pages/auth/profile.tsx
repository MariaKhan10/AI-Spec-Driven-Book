import React from 'react';
import Layout from '@theme/Layout';
import ProfileManagement from '@site/src/components/Auth/ProfileManagement';

export default function ProfilePage(): React.JSX.Element {
  return (
    <Layout title="Profile Management" description="Manage your account profile">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <ProfileManagement />
          </div>
        </div>
      </main>
    </Layout>
  );
}
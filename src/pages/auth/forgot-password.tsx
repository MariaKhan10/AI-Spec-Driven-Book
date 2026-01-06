import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <Layout title="Forgot Password" description="Reset your password">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="text--center padding-vert--md">
              <h1>Forgot Password</h1>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <form className="margin-vert--lg">
                <div className="form-group margin-bottom--sm">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="margin-vert--md">
                  <button type="submit" className="button button--primary button--lg">
                    Reset Password
                  </button>
                </div>
              </form>
              <div className="margin-vert--lg">
                <Link to="/auth/login">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
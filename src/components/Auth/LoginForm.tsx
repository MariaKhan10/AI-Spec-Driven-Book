import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from  "../../pages/index.module.css";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login, state } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const history = useHistory();
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig?.baseUrl || '/';

  // Get the redirect path from location state or default to home
  // Use the base URL for the default redirect to ensure proper routing
  const from = (location.state as any)?.from?.pathname || baseUrl;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof errors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);

      // Redirect to the original destination or home
      history.push(from);
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the context, so we don't need to do anything specific here
    }
  };

  return (
    <div className="login-form">
  <h2>Sign In</h2>

  {state.error && (
    <div className="alert alert--danger">
      {state.error}
    </div>
  )}

  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="email">Email *</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
        placeholder="your@email.com"
      />
      {errors.email && (
        <div className="invalid-feedback">{errors.email}</div>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="password">Password *</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
        placeholder="Your password"
      />
      {errors.password && (
        <div className="invalid-feedback">{errors.password}</div>
      )}
    </div>

    {/* Sign In button – SAME style as Create Account */}
    <div className={styles.createAccountWrapper}>
      <button
        type="submit"
        className={styles.ctaButton}
        disabled={state.loading}
      >
        {state.loading ? 'Signing In...' : 'Sign In'}
      </button>
    </div>
  </form>

  {/* Bottom text links */}
  <div className={styles.loginTextWrapper}>
    <p className="margin-top--md">
      Don't have an account?{" "}
      <a href={`${baseUrl}auth/register`}>Sign up</a>
    </p>
    <p>
      <a href={`${baseUrl}auth/forgot-password`}>Forgot password?</a>
    </p>
  </div>
</div>

  );
};

export default LoginForm;
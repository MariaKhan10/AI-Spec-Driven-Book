import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from  "../../pages/index.module.css";

interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  softwareBackground: string;
  hardwareBackground: string;
}

const RegistrationForm: React.FC = () => {
  const { register, state } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    softwareBackground: 'beginner',
    hardwareBackground: 'low-end',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig?.baseUrl || '/';

  // Redirect to home page after successful registration and login
  useEffect(() => {
    if (!state.error && state.user && state.user.name) {
      // Add a small delay to ensure state is fully updated
        history.push(baseUrl);
    }
  }, [state.user, state.error, history, baseUrl]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Software background validation
    if (!['beginner', 'intermediate', 'advanced'].includes(formData.softwareBackground)) {
      newErrors.softwareBackground = 'Please select a valid software background';
    }

    // Hardware background validation
    if (!['low-end', 'mid', 'high'].includes(formData.hardwareBackground)) {
      newErrors.hardwareBackground = 'Please select a valid hardware background';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.softwareBackground,
        formData.hardwareBackground
      );
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by the context
    }
  };

  return (
    <div className="registration-form">
      <h2>Create Account</h2>

      {state.error && (
        <div className="alert alert--danger">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Your full name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

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
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
            placeholder="At least 8 characters"
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="softwareBackground">Software Background *</label>
          <select
            id="softwareBackground"
            name="softwareBackground"
            value={formData.softwareBackground}
            onChange={handleChange}
            className={`form-control ${errors.softwareBackground ? 'is-invalid' : ''}`}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.softwareBackground && <div className="invalid-feedback">{errors.softwareBackground}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="hardwareBackground">Hardware Background *</label>
          <select
            id="hardwareBackground"
            name="hardwareBackground"
            value={formData.hardwareBackground}
            onChange={handleChange}
            className={`form-control ${errors.hardwareBackground ? 'is-invalid' : ''}`}
          >
            <option value="low-end">Low-end (Budget/Basic Hardware)</option>
            <option value="mid">Mid-range</option>
            <option value="high">High-end (Advanced Hardware)</option>
          </select>
          {errors.hardwareBackground && <div className="invalid-feedback">{errors.hardwareBackground}</div>}
        </div>

       <div className={styles.createAccountWrapper}>
  <button
    type="submit"
    className={styles.ctaButton}
    disabled={state.loading}
  >
    {state.loading ? 'Creating Account...' : 'Create Account'}
  </button>
</div>

      </form>

     <div className={styles.loginTextWrapper}>
  <p className="margin-top--md">
    Already have an account?{" "}
    <a href={`${baseUrl}auth/login`}>Sign in</a>
  </p>
</div>

    </div>
    

    
  );
  
  
};


export default RegistrationForm;
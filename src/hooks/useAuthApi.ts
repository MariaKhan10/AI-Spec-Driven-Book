import { useState } from 'react';

interface ApiCallOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

// API base URL - this should match your backend API URL
// For Docusaurus, we'll use a default value that can be overridden by setting window.API_BASE_URL
const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).API_BASE_URL) ||
  'http://localhost:5001/api';

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (endpoint: string, options: ApiCallOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add authorization token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    software_background: string;
    hardware_background: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: userData,
    });
  };

  const login = async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  };

  const logout = async () => {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Optionally call backend to invalidate session
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Even if backend logout fails, we clear local storage
      console.error('Logout error (ignored):', err);
    }
  };

  const getProfile = async () => {
    return apiCall('/auth/me');
  };

  const updateProfile = async (profileData: {
    software_background?: string;
    hardware_background?: string;
  }) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  };

  const getPersonalizedChapter = async (chapterId: string) => {
    return apiCall(`/personalize/chapter/${chapterId}`, {
      method: 'POST',
    });
  };

  return {
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    getPersonalizedChapter,
  };
};
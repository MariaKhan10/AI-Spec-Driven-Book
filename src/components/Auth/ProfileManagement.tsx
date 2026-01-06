import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileManagement: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    software_background: state.user?.software_background || 'beginner',
    hardware_background: state.user?.hardware_background || 'low-end',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (state.user) {
      setFormData({
        software_background: state.user.software_background,
        hardware_background: state.user.hardware_background,
      });
    }
  }, [state.user]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      await updateProfile(
        formData.software_background,
        formData.hardware_background
      );
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!state.user) {
    return (
      <div className="alert alert--warning">
        Please <a href="/auth/login">log in</a> to manage your profile.
      </div>
    );
  }

  return (
    <div className="profile-management">
      <h3>Manage Your Profile</h3>

      {successMessage && (
        <div className="alert alert--success">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="software_background">Software Background</label>
          <select
            id="software_background"
            name="software_background"
            value={formData.software_background}
            onChange={handleChange}
            className="form-control"
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <small className="form-text text-muted">
            This helps us adjust content complexity based on your experience level
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="hardware_background">Hardware Background</label>
          <select
            id="hardware_background"
            name="hardware_background"
            value={formData.hardware_background}
            onChange={handleChange}
            className="form-control"
            disabled={loading}
          >
            <option value="low-end">Low-end (Budget/Basic Hardware)</option>
            <option value="mid">Mid-range</option>
            <option value="high">High-end (Advanced Hardware)</option>
          </select>
          <small className="form-text text-muted">
            This helps us recommend appropriate hardware examples and solutions
          </small>
        </div>

        <button
          type="submit"
          className="button button--primary"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <div className="margin-top--md">
        <h4>Your Current Profile</h4>
        <ul>
          <li><strong>Email:</strong> {state.user.email}</li>
          <li><strong>Software Background:</strong> {state.user.software_background}</li>
          <li><strong>Hardware Background:</strong> {state.user.hardware_background}</li>
          <li><strong>Member Since:</strong> {new Date(state.user.created_at).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileManagement;
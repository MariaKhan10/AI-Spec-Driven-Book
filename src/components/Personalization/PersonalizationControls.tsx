import React, { useState, useEffect } from 'react';
import { usePersonalization } from './PersonalizationProvider';

interface PersonalizationControlsProps {
  userId?: string;
}

const PersonalizationControls: React.FC<PersonalizationControlsProps> = ({ userId }) => {
  const { settings, loading, error, updateSettings } = usePersonalization();
  const [preferredName, setPreferredName] = useState<string>('');
  const [contentComplexity, setContentComplexity] = useState<string>('balanced');
  const [learningStyle, setLearningStyle] = useState<string>('practical');
  const [technicalDepth, setTechnicalDepth] = useState<string>('moderate');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setPreferredName(settings.preferredName || '');
      setContentComplexity(settings.contentComplexity || 'balanced');
      setLearningStyle(settings.learningStyle || 'practical');
      setTechnicalDepth(settings.technicalDepthPreference || 'moderate');
    }
  }, [settings]);

  const handleSave = async () => {
    if (!userId) {
      setSaveStatus('User ID is required to save settings');
      return;
    }

    try {
      await updateSettings({
        preferredName,
        contentComplexity,
        learningStyle,
        technicalDepthPreference: technicalDepth
      });
      setSaveStatus('Settings saved successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to save settings');
      console.error('Error saving settings:', err);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setPreferredName(settings.preferredName || '');
      setContentComplexity(settings.contentComplexity || 'balanced');
      setLearningStyle(settings.learningStyle || 'practical');
      setTechnicalDepth(settings.technicalDepthPreference || 'moderate');
    }
    setIsEditing(false);
  };

  if (!userId) {
    return (
      <div className="personalization-controls">
        <p>Please log in to customize your personalization settings.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="personalization-controls">
        <p>Loading personalization settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personalization-controls">
        <p className="error">Error loading settings: {error}</p>
      </div>
    );
  }

  return (
    <div className="personalization-controls">
      <h3>Personalization Settings</h3>

      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('successfully') ? 'success' : 'error'}`}>
          {saveStatus}
        </div>
      )}

      {!isEditing ? (
        <div className="settings-display">
          <div className="setting-item">
            <strong>Preferred Name:</strong> {preferredName || 'Not set'}
          </div>
          <div className="setting-item">
            <strong>Content Complexity:</strong> {contentComplexity}
          </div>
          <div className="setting-item">
            <strong>Learning Style:</strong> {learningStyle}
          </div>
          <div className="setting-item">
            <strong>Technical Depth:</strong> {technicalDepth}
          </div>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit Settings
          </button>
        </div>
      ) : (
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="preferredName">Preferred Name:</label>
            <input
              id="preferredName"
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              placeholder="Enter your preferred name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contentComplexity">Content Complexity:</label>
            <select
              id="contentComplexity"
              value={contentComplexity}
              onChange={(e) => setContentComplexity(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="balanced">Balanced</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="learningStyle">Learning Style:</label>
            <select
              id="learningStyle"
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
            >
              <option value="practical">Practical</option>
              <option value="theoretical">Theoretical</option>
              <option value="hands-on">Hands-on</option>
              <option value="visual">Visual</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="technicalDepth">Technical Depth:</label>
            <select
              id="technicalDepth"
              value={technicalDepth}
              onChange={(e) => setTechnicalDepth(e.target.value)}
            >
              <option value="shallow">Shallow</option>
              <option value="moderate">Moderate</option>
              <option value="deep">Deep</option>
            </select>
          </div>

          <div className="button-group">
            <button onClick={handleSave} className="save-button">
              Save Settings
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizationControls;
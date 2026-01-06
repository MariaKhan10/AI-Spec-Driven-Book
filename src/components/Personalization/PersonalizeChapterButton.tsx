import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ModalPopup from './ModalPopup';

interface PersonalizeChapterButtonProps {
  chapterId: string;
  onPersonalize: (personalizedContent: any) => void;
  className?: string;
}

const PersonalizeChapterButton: React.FC<PersonalizeChapterButtonProps> = ({
  chapterId,
  onPersonalize,
  className = ''
}) => {
  const { state, getPersonalizedChapter } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('error');
  const [modalMessage, setModalMessage] = useState('');

  const handlePersonalize = async () => {
    if (!state.user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const personalizedData = await getPersonalizedChapter(chapterId);
      onPersonalize(personalizedData);

      // Show success modal
      setModalMessage('Chapter personalized successfully!');
      setModalType('success');
      setShowModal(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to personalize chapter';
      setError(errorMessage);
      console.error('Personalization error:', err);

      // Show error modal instead of alert
      setModalMessage(errorMessage);
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!state.user) {
    return (
      <div className={`personalize-prompt ${className}`}>
        <p>
          <a href="/auth/login">Log in</a> to personalize this chapter based on your background.
        </p>
      </div>
    );
  }

  return (
    <div className={`personalize-button-container ${className}`}>
      <button
        onClick={handlePersonalize}
        disabled={loading}
        className={`button button--secondary ${loading ? 'button--loading' : ''}`}
      >
        {loading ? 'Personalizing...' : 'Personalize this chapter'}
      </button>

      <div className="margin-top--sm">
        <small>
          Content will be adjusted based on your profile:
          Software - {state.user.software_background},
          Hardware - {state.user.hardware_background}
        </small>
      </div>

      {/* Modal Popup */}
      <ModalPopup
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        type={modalType}
        title={modalType === 'success' ? 'Success' : 'Error'}
      />
    </div>
  );
};

export default PersonalizeChapterButton;
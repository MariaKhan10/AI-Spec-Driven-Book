import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import DocItemLayout from '@theme-original/DocItem/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { clientContentPersonalizer } from '../../../services/ClientContentPersonalizer';
import { clientUserService } from '../../../services/ClientUserService';
import ModalPopup from '../../../components/Personalization/ModalPopup';

// Personalization button component that uses Auth context
const PersonalizeChapterButton = ({ docMetadata }) => {
  const { state } = useAuth();
  const location = useLocation();
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isOriginalContent, setIsOriginalContent] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [modalMessage, setModalMessage] = useState('');
  const userId = state.user?.id;

  // Store original content to allow reverting
  const [originalContent, setOriginalContent] = useState('');

  console.log('Auth state:', state); // Debug log
  console.log('User ID:', userId); // Debug log
  console.log('Document metadata:', docMetadata); // Debug log

  const handlePersonalize = async () => {
    if (!userId) {
      setModalMessage('Please log in to personalize content');
      setModalType('warning');
      setShowModal(true);
      return;
    }

    setIsPersonalizing(true);
    try {
      // Fetch personalized content from the API
      // Try different possible metadata properties for the document path
      const docPath = docMetadata?.source?.id ||
                     docMetadata?.source?.relativePath ||
                     docMetadata?.source?.pathname ||
                     docMetadata?.unversionedId ||
                     docMetadata?.id ||
                     location.pathname;

      console.log('Document path for personalization:', docPath); // Debug log

      const result = await clientContentPersonalizer.personalizeChapter(
        docPath,
        userId
      );

      // Update the page content with personalized content
      const contentElement = document.querySelector('article div[class*="markdown"]');
      if (contentElement) {
        // Store original content if not already stored
        if (!originalContent) {
          setOriginalContent(contentElement.innerHTML);
        }

        // Update the content with personalized content
        contentElement.innerHTML = result.content;

        // Check if content was actually transformed
        const wasTransformed = result.transformationApplied || result.content !== originalContent;

        // Show appropriate message based on whether personalization was applied
        
        }
        // setShowModal(true);

        // Update state to indicate content is now personalized
        setIsOriginalContent(false);

        // Scroll to top to see the updated content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    finally {
      setIsPersonalizing(false);
    }
  };

  const handleRevert = () => {
    const contentElement = document.querySelector('article div[class*="markdown"]');
    if (contentElement && originalContent) {
      contentElement.innerHTML = originalContent;
      setIsOriginalContent(true);
      setModalMessage('Content reverted to original version');
      setModalType('info');
      // setShowModal(true);
    }
  };

  // Show button if user is logged in, otherwise show a message
  if (!userId) {
    return (
      <div style={{
        marginBottom: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#14a8c2ff',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        <small style={{
          color: '#050505ff',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}>
          Log in to personalize content
        </small>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button
        onClick={handlePersonalize}
        disabled={isPersonalizing}
        className="button button--primary"
        style={{
          backgroundColor: '#8b5cf6',
          borderColor: '#8b5cf6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: isPersonalizing ? 'wait' : 'pointer'
        }}
      >
        {isPersonalizing ? 'Personalizing...' : isOriginalContent ? 'Personalize Content' : 'Re-Personalize'}
      </button>
      {!isOriginalContent && (
        <button
          onClick={handleRevert}
          className="button button--secondary"
          style={{
            backgroundColor: '#1865a8ff',
            borderColor: '#6c757d',
            color: 'white',
            padding: '8px 8px',
            borderRadius: '2px',
            cursor: 'pointer',
    
          }}
        >
          Revert to Original
        </button>
      )}
      {/* Modal Popup */}
      <ModalPopup
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        type={modalType}
        title={modalType === 'success' ? 'Success' :
               modalType === 'error' ? 'Error' :
               modalType === 'warning' ? 'Warning' : 'Information'}
      />
    </div>
  );
};

export default function DocItemLayoutWrapper(props) {
  // Access the doc metadata from props
  const docMetadata = props.content?.metadata;

  return (
    <>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12">
            <PersonalizeChapterButton docMetadata={docMetadata} />
          </div>
        </div>
      </div>
      <DocItemLayout {...props} />
    </>
  );
}
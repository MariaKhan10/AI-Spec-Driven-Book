import React, { useEffect, useState } from 'react';

interface ModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onConfirm?: () => void;
  confirmText?: string;
  showCloseButton?: boolean;
}

const ModalPopup: React.FC<ModalPopupProps> = ({
  isOpen,
  onClose,
  title = 'Notification',
  message,
  type = 'info',
  onConfirm,
  confirmText = 'OK',
  showCloseButton = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          border: '1px solid #28a745',
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          color: '#155724'
        };
      case 'error':
        return {
          border: '1px solid #dc3545',
          background: 'linear-gradient(135deg, #f8d7da, #f1b0b7)',
          color: '#721c24'
        };
      case 'warning':
        return {
          border: '1px solid #ffc107',
          background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
          color: '#856404'
        };
      case 'info':
      default:
        return {
          border: '1px solid #17a2b8',
          background: 'linear-gradient(135deg, #d1ecf1, #bee5eb)',
          color: '#0c5460'
        };
    }
  };

  if (!isOpen && !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isVisible ? 'bg-black bg-opacity-50' : 'opacity-0'
        }`}
      >
        {/* Modal */}
        <div
          className={`relative max-w-md w-full rounded-xl shadow-2xl transform transition-transform duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={getTypeStyles()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="p-6 pt-8">
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="mb-6">{message}</p>

            <div className="flex justify-end space-x-3">
              {onConfirm ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors"
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors"
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalPopup;
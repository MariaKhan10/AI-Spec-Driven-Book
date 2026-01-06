import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientUserService } from '../../services/ClientUserService';

interface PersonalizationSettings {
  userId: string;
  preferredName: string;
  contentComplexity: string;
  learningStyle: string;
  technicalDepthPreference: string;
  updatedAt: Date;
}

interface PersonalizationContextType {
  settings: PersonalizationSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<PersonalizationSettings>) => Promise<void>;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

interface PersonalizationProviderProps {
  userId?: string;
  children: ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({
  userId,
  children
}) => {
  const [settings, setSettings] = useState<PersonalizationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userSettings = await clientUserService.getUserPersonalizationSettings(userId);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading personalization settings:', err);
      setError('Failed to load personalization settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const refreshSettings = async () => {
    await loadSettings();
  };

  const updateSettings = async (newSettings: Partial<PersonalizationSettings>) => {
    if (!userId) {
      throw new Error('User ID is required to update settings');
    }

    try {
      setLoading(true);
      setError(null);

      const success = await clientUserService.updateUserPersonalizationSettings(userId, newSettings);

      if (success) {
        // Reload settings after update
        await loadSettings();
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating personalization settings:', err);
      setError('Failed to update personalization settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    error,
    refreshSettings,
    updateSettings
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};
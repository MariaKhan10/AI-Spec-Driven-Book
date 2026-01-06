import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UserProfile } from '../services/userService';
import { PersonalizationSettings } from '../services/userService';

// Define the context state type
interface PersonalizationState {
  userProfile: UserProfile | null;
  settings: PersonalizationSettings | null;
  isPersonalizing: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Define the actions type
type PersonalizationAction =
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'SET_SETTINGS'; payload: PersonalizationSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_AUTH_STATUS'; payload: boolean }
  | { type: 'RESET' };

// Define the context type
interface PersonalizationContextType extends PersonalizationState {
  setUserProfile: (profile: UserProfile) => void;
  setSettings: (settings: PersonalizationSettings) => void;
  setIsPersonalizing: (loading: boolean) => void;
  setError: (error: string) => void;
  setAuthStatus: (authenticated: boolean) => void;
  reset: () => void;
  getComplexityLevel: () => 'beginner' | 'intermediate' | 'advanced' | 'unknown';
}

// Initial state
const initialState: PersonalizationState = {
  userProfile: null,
  settings: null,
  isPersonalizing: false,
  error: null,
  isAuthenticated: false,
};

// Reducer function
const personalizationReducer = (state: PersonalizationState, action: PersonalizationAction): PersonalizationState => {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isPersonalizing: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isPersonalizing: false,
      };
    case 'SET_AUTH_STATUS':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Create the context
const personalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// Provider component
interface PersonalizationProviderProps {
  children: ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(personalizationReducer, initialState);

  const setUserProfile = (profile: UserProfile) => {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
  };

  const setSettings = (settings: PersonalizationSettings) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  };

  const setIsPersonalizing = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setAuthStatus = (authenticated: boolean) => {
    dispatch({ type: 'SET_AUTH_STATUS', payload: authenticated });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const getComplexityLevel = (): 'beginner' | 'intermediate' | 'advanced' | 'unknown' => {
    if (!state.userProfile) {
      return 'unknown';
    }

    // Use the user service logic to determine complexity level
    // This is a simplified version - in a real app, we'd use the actual service
    const { softwareBackground, hardwareBackground } = state.userProfile;

    // Map backgrounds to numeric levels
    const mapBackgroundToLevel = (background: string): number => {
      const bg = background.toLowerCase();

      if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
        return 1; // beginner
      } else if (bg.includes('intermediate') || bg.includes('some experience')) {
        return 2; // intermediate
      } else {
        return 3; // advanced
      }
    };

    const softwareLevel = mapBackgroundToLevel(softwareBackground);
    const hardwareLevel = mapBackgroundToLevel(hardwareBackground);

    // Calculate average level
    const averageLevel = (softwareLevel + hardwareLevel) / 2;

    // Return complexity level based on average
    if (averageLevel <= 1.5) {
      return 'beginner';
    } else if (averageLevel <= 2.5) {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  };

  const value: PersonalizationContextType = {
    ...state,
    setUserProfile,
    setSettings,
    setIsPersonalizing,
    setError,
    setAuthStatus,
    reset,
    getComplexityLevel,
  };

  const providerValue = value;
  return React.createElement(
    personalizationContext.Provider,
    { value: providerValue },
    children
  );
};

// Custom hook to use the context
export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(personalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

export default personalizationContext;
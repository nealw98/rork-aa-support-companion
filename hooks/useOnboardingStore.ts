import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ONBOARDING_KEY = 'sober_dailies_onboarding_complete';

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  isLoading: boolean;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const value = useOnboardingLogic();
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

const useOnboardingLogic = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      console.log('Checking onboarding status...');
      
      // For development/preview, skip onboarding on Android if AsyncStorage fails
      if (Platform.OS === 'android') {
        try {
          const status = await AsyncStorage.getItem(ONBOARDING_KEY);
          console.log('Android AsyncStorage status:', status);
          setIsOnboardingComplete(status === 'true');
        } catch (androidError) {
          console.log('Android AsyncStorage error, skipping onboarding:', androidError);
          // Skip onboarding on Android if AsyncStorage fails (common in preview)
          setIsOnboardingComplete(true);
        }
      } else {
        const status = await AsyncStorage.getItem(ONBOARDING_KEY);
        console.log('AsyncStorage status:', status);
        setIsOnboardingComplete(status === 'true');
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      // Default to skipping onboarding if there's an error
      setIsOnboardingComplete(true);
    } finally {
      setIsLoading(false);
      console.log('Onboarding check complete');
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOnboardingComplete(true);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  return {
    isOnboardingComplete,
    isLoading,
    completeOnboarding,
  };
};
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useCallback } from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GratitudeProvider } from "@/hooks/useGratitudeStore";
import { OnboardingProvider, useOnboarding } from "@/hooks/useOnboardingStore";
import { SobrietyProvider } from "@/hooks/useSobrietyStore";
import { EveningReviewProvider } from "@/hooks/use-evening-review-store";
import { adjustFontWeight } from "@/constants/fonts";
import WelcomeScreen from "@/components/WelcomeScreen";
import CustomSplashScreen from "@/components/CustomSplashScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isOnboardingComplete, isLoading } = useOnboarding();

  console.log('RootLayoutNav - isLoading:', isLoading, 'isOnboardingComplete:', isOnboardingComplete);

  // Hide splash screen when app is ready
  const hideSplashScreen = useCallback(async () => {
    if (!isLoading) {
      console.log('Hiding splash screen');
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  if (isLoading) {
    console.log('Still loading, showing custom splash screen');
    return <CustomSplashScreen />;
  }

  if (!isOnboardingComplete) {
    console.log('Showing welcome screen');
    return <WelcomeScreen />;
  }

  console.log('Showing main app');

  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: "#f8f9fa",
      },
      headerTitleStyle: {
        fontWeight: adjustFontWeight("600", true),
      },
    }}>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          title: "AA Sober Companion"
        }} 
      />
      <Stack.Screen 
        name="terms" 
        options={{ 
          presentation: 'modal',
          title: "Terms of Use"
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          presentation: 'modal',
          title: "Privacy Policy"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <GratitudeProvider>
          <SobrietyProvider>
            <EveningReviewProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </EveningReviewProvider>
          </SobrietyProvider>
        </GratitudeProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}
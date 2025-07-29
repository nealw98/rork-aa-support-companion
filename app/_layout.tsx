import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EveningReviewProvider } from "@/hooks/useEveningReviewStore";
import { GratitudeProvider } from "@/hooks/useGratitudeStore";
import { OnboardingProvider, useOnboarding } from "@/hooks/useOnboardingStore";
import { adjustFontWeight } from "@/constants/fonts";
import WelcomeScreen from "@/components/WelcomeScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isOnboardingComplete, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!isOnboardingComplete) {
    return <WelcomeScreen />;
  }

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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <GratitudeProvider>
          <EveningReviewProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </EveningReviewProvider>
        </GratitudeProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}
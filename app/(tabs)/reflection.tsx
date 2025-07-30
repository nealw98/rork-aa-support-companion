import React from 'react';
import DailyReflection from '@/components/DailyReflection';
import ScreenContainer from '@/components/ScreenContainer';
import { Stack } from 'expo-router';

export default function ReflectionScreen() {
  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Daily Reflection' }} />
      <DailyReflection />
    </ScreenContainer>
  );
}

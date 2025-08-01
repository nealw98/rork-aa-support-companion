import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';

export default function InsightsBackupScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Insights Backup</Text>
        <Text style={styles.description}>
          This is a backup insights screen.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
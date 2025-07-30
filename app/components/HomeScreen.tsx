import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  const handleGoToReflection = () => {
    router.push('/(tabs)/reflection');
  };

  return (
    <View style={styles.container} testID="home-screen">
      <Text style={styles.title}>Sober Dailies</Text>
      <Text style={styles.subtitle}>Daily actions build long-term sobriety.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoToReflection}
        testID="go-to-reflection-button"
      >
        <Text style={styles.buttonText}>Go to Daily Reflection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.muted,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

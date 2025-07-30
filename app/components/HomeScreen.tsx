import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SunIcon from '@/components/SunIcon';
import { formatDateDisplay } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import { getTodaysReflection } from '@/constants/reflections';
import { Reflection } from '@/types';

const HomeScreen = () => {
  const router = useRouter();
  const [todaysReflection, setTodaysReflection] = useState<Reflection | null>(null);

  const today = new Date();
  const formattedDate = formatDateDisplay(today);

  useEffect(() => {
    const loadTodaysReflection = async () => {
      try {
        const reflection = await getTodaysReflection();
        setTodaysReflection(reflection);
      } catch (error) {
        console.error('Error loading today\'s reflection:', error);
      }
    };
    loadTodaysReflection();
  }, []);

  return (
    <LinearGradient
      colors={['rgba(74, 144, 226, 0.3)', 'rgba(78, 205, 196, 0.2)', 'rgba(92, 184, 92, 0.1)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <SunIcon size={120} />
          <Text style={styles.heroTitle}>Sober Dailies</Text>
          <Text style={styles.heroSubtitle}>
            This app helps you practice your dailies — the daily habits that maintain your sobriety. Doing these things consistently will support your continued sobriety and spiritual growth.
          </Text>
        </View>

        {/* Daily Reflection Button */}
        <TouchableOpacity 
          style={styles.dailyReflectionButton}
          onPress={() => router.push('/(tabs)/reflection')}
        >
          <BookOpen size={24} color="white" style={styles.reflectionIcon} />
          <Text style={styles.reflectionButtonTitle}>
            Daily Reflection for {formattedDate.replace(/^\w+, /, '').replace(/, \d{4}$/, '')}
          </Text>
          <Text style={styles.reflectionButtonSubtitle}>
            {todaysReflection?.title || 'Loading...'}
          </Text>
        </TouchableOpacity>

        {/* Daily Practice Section */}
        <View style={styles.dailyPracticeHeader}>
          <Text style={styles.dailyPracticeTitle}>Daily Practice</Text>
          <Text style={styles.dailyPracticeSubtitle}>Daily actions build long-term sobriety.</Text>
        </View>

        {/* Morning Routine Section */}
        <View style={styles.sectionContainerMorning}>
        <Text style={styles.sectionTitle}>Morning Routine</Text>
        <Text style={styles.sectionSubtitle}>Start your day with intention and spiritual focus.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/prayers')}>
          <Text style={styles.cardTitle}>Morning Prayer</Text>
          <Text style={styles.cardDescription}>Invite your higher power to help you through the day.</Text>
          <Text style={styles.cardButton}>Go to Prayers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/reflection')}>
          <Text style={styles.cardTitle}>Daily Reflection & Meditation</Text>
          <Text style={styles.cardDescription}>Read the daily message and meditate on it.</Text>
          <Text style={styles.cardButton}>Go to Reflection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/literature')}>
          <Text style={styles.cardTitle}>Literature</Text>
          <Text style={styles.cardDescription}>Read something out of the literature every day.</Text>
          <Text style={styles.cardButton}>Go to Literature</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/gratitude')}>
          <Text style={styles.cardTitle}>Gratitude List</Text>
          <Text style={styles.cardDescription}>Start your day with gratitude and stay in the solution.</Text>
          <Text style={styles.cardButton}>Go to Gratitude List</Text>
        </TouchableOpacity>
      </View>

        {/* Throughout the Day Section */}
        <View style={styles.sectionContainerDay}>
        <Text style={styles.sectionTitle}>Throughout the Day</Text>
        <Text style={styles.sectionSubtitle}>Stay connected and mindful during your daily activities.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/chat')}>
          <Text style={styles.cardTitle}>Sober Chat</Text>
          <Text style={styles.cardDescription}>Talk with an AI sponsor voice when you need support.</Text>
          <Text style={styles.cardButton}>Go to Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/insights')}>
          <Text style={styles.cardTitle}>Insight Summary</Text>
          <Text style={styles.cardDescription}>Spot-check your emotional and spiritual growth.</Text>
          <Text style={styles.cardButton}>Go to Insights</Text>
        </TouchableOpacity>
      </View>

        {/* Evening Routine Section */}
        <View style={styles.sectionContainerEvening}>
        <Text style={styles.sectionTitle}>Evening Routine</Text>
        <Text style={styles.sectionSubtitle}>Reflect and close your day with peace.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/nightly-review')}>
          <Text style={styles.cardTitle}>Nightly Review</Text>
          <Text style={styles.cardDescription}>Reflect on your day and practice Step 10.</Text>
          <Text style={styles.cardButton}>Go to Nightly Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/prayers')}>
          <Text style={styles.cardTitle}>Evening Prayer</Text>
          <Text style={styles.cardDescription}>End your day with gratitude and humility.</Text>
          <Text style={styles.cardButton}>Go to Prayers</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  heroSection: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
    marginTop: 20,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  dailyReflectionButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  reflectionIcon: {
    marginBottom: 8,
  },
  reflectionButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  reflectionButtonSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  dailyPracticeHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dailyPracticeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  dailyPracticeSubtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
  },
  sectionContainerMorning: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 248, 220, 0.8)', // Soft yellow with transparency
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionContainerDay: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'rgba(135, 206, 235, 0.3)', // Soft blue
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionContainerEvening: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'rgba(147, 51, 234, 0.3)', // Soft purple
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 12,
  },
  cardButton: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

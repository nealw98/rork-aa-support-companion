import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SunIcon from '@/components/SunIcon';
import { formatDate } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import DailyReflection from '@/components/DailyReflection';

const HomeScreen = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <LinearGradient
      colors={['#4A90E2', '#87CEEB']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <SunIcon size={60} color="#FFD700" />
        <Text style={styles.heroTitle}>Sober Dailies</Text>
        <Text style={styles.heroSubtitle}>
          This app helps you practice your dailies — the daily habits that maintain your sobriety.
        </Text>
      </View>

      {/* Daily Reflection Preview Card */}
      <View style={styles.reflectionCardContainer}>
        <TouchableOpacity 
          style={styles.cardHeader}
          onPress={() => navigateTo('/(tabs)/reflection')}
        >
          <Text style={styles.sectionTitle}>Daily Reflection for {formattedDate}</Text>
          <Text style={styles.sectionSubtitle}>Today&apos;s Reflection Title</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Practice Section */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={styles.sectionTitle}>Daily Practice</Text>
        <Text style={styles.sectionSubtitle}>Daily actions build long-term sobriety.</Text>
      </View>

      {/* Morning Routine Section */}
      <View style={styles.sectionContainerMorning}>
        <Text style={styles.sectionTitle}>Morning Routine</Text>
        <Text style={styles.sectionSubtitle}>Start your day with intention and spiritual focus.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/prayers')}>
          <Text style={styles.cardTitle}>Morning Prayer</Text>
          <Text style={styles.cardDescription}>Invite your higher power to help you through the day.</Text>
          <Text style={styles.cardButton}>Go to Prayers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/reflection')}>
          <Text style={styles.cardTitle}>Daily Reflection & Meditation</Text>
          <Text style={styles.cardDescription}>Read the daily message and meditate on it.</Text>
          <Text style={styles.cardButton}>Go to Reflection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/literature')}>
          <Text style={styles.cardTitle}>Literature</Text>
          <Text style={styles.cardDescription}>Read something out of the literature every day.</Text>
          <Text style={styles.cardButton}>Go to Literature</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/gratitude')}>
          <Text style={styles.cardTitle}>Gratitude List</Text>
          <Text style={styles.cardDescription}>Start your day with gratitude and stay in the solution.</Text>
          <Text style={styles.cardButton}>Go to Gratitude List</Text>
        </TouchableOpacity>
      </View>

      {/* Throughout the Day Section */}
      <View style={styles.sectionContainerDay}>
        <Text style={styles.sectionTitle}>Throughout the Day</Text>
        <Text style={styles.sectionSubtitle}>Stay connected and mindful during your daily activities.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/chat')}>
          <Text style={styles.cardTitle}>Sober Chat</Text>
          <Text style={styles.cardDescription}>Talk with an AI sponsor voice when you need support.</Text>
          <Text style={styles.cardButton}>Go to Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/insights')}>
          <Text style={styles.cardTitle}>Insight Summary</Text>
          <Text style={styles.cardDescription}>Spot-check your emotional and spiritual growth.</Text>
          <Text style={styles.cardButton}>Go to Insights</Text>
        </TouchableOpacity>
      </View>

      {/* Evening Routine Section */}
      <View style={styles.sectionContainerEvening}>
        <Text style={styles.sectionTitle}>Evening Routine</Text>
        <Text style={styles.sectionSubtitle}>Reflect and close your day with peace.</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/nightly-review')}>
          <Text style={styles.cardTitle}>Nightly Review</Text>
          <Text style={styles.cardDescription}>Reflect on your day and practice Step 10.</Text>
          <Text style={styles.cardButton}>Go to Nightly Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('/(tabs)/prayers')}>
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
    padding: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  reflectionCardContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionContainerMorning: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#FFF8DC', // Soft yellow
    paddingVertical: 20,
    borderRadius: 10,
  },
  sectionContainerDay: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'rgba(135, 206, 235, 0.2)', // Soft blue
    paddingVertical: 20,
    borderRadius: 10,
  },
  sectionContainerEvening: {
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'rgba(147, 51, 234, 0.2)', // Soft purple
    paddingVertical: 20,
    borderRadius: 10,
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

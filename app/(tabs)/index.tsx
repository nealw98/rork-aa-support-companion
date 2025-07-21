import { StyleSheet, View, Text, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";

import Colors from "@/constants/colors";
import { getTodaysReflection } from "@/constants/reflections";
import { Reflection } from "@/types";
import SunIcon from "@/components/SunIcon";

export default function HomeScreen() {
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    const todayReflection = getTodaysReflection();
    setReflection(todayReflection);
    
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDateString(today.toLocaleDateString(undefined, options));
  }, []);

  if (!reflection) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(78, 205, 196, 0.05)', 'rgba(92, 184, 92, 0.02)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <SunIcon size={120} />
          
          <Text style={styles.appTitle}>Sober Dailies</Text>
          
          <Text style={styles.appDescription}>
            Everything you need to support your daily recovery practice, combining traditional AA wisdom with helpful tools for recovery.
          </Text>
        </View>

        {/* Daily Reflection Section */}
        <View style={styles.reflectionSection}>
          <Text style={styles.dateText}>{dateString}</Text>
          
          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>{reflection.title}</Text>
            
            <Text style={styles.quote}>"{reflection.quote}"</Text>
            <Text style={styles.source}>{reflection.source}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.reflectionText}>{reflection.reflection}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.thoughtTitle}>Today's Thought:</Text>
            <Text style={styles.thought}>{reflection.thought}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 16,
    color: '#5a6c7d',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  reflectionSection: {
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  reflectionCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reflectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 26,
    textAlign: "left",
  },
  source: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: 16,
    opacity: 0.5,
  },
  reflectionText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  thoughtTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  thought: {
    fontSize: 16,
    color: Colors.light.text,
    fontStyle: "italic",
    lineHeight: 24,
  },
});
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

import Colors from "@/constants/colors";
import { aaPrayers } from "@/constants/bigbook";
import { adjustFontWeight } from "@/constants/fonts";
import ScreenContainer from "@/components/ScreenContainer";

export default function PrayersScreen() {
  const [expandedPrayer, setExpandedPrayer] = useState<number | null>(null);

  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
      />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>AA Prayers</Text>
          <Text style={styles.subtitle}>Essential prayers for recovery and reflection</Text>
        </View>
        
        {aaPrayers.map((prayer, index) => (
          <View key={index} style={styles.prayerCard}>
            <TouchableOpacity
              style={styles.prayerHeader}
              onPress={() => setExpandedPrayer(expandedPrayer === index ? null : index)}
              testID={`prayer-${index}`}
              activeOpacity={0.7}
            >
              <Text style={styles.prayerTitle}>{prayer.title}</Text>
              {expandedPrayer === index ? (
                <ChevronDown size={20} color={Colors.light.muted} />
              ) : (
                <ChevronRight size={20} color={Colors.light.muted} />
              )}
            </TouchableOpacity>
            
            {expandedPrayer === index && (
              <View style={styles.prayerContent}>
                {prayer.title === "Morning Prayer" ? (
                  <View>
                    <Text style={[styles.prayerText, styles.italicText]}>As I begin this day, I ask the God of my understanding:</Text>
                    <Text style={styles.prayerText}>{prayer.content.split('As I begin this day, I ask the God of my understanding:')[1]}</Text>
                  </View>
                ) : (
                  <Text style={styles.prayerText}>{prayer.content}</Text>
                )}
                <Text style={styles.prayerSource}>— {prayer.source}</Text>
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            Copyright © 1990 by Alcoholics Anonymous World Services, Inc. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: adjustFontWeight("bold", true),
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: "center",
    marginBottom: 8,
  },
  prayerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    // Shadow removed
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight("600", true),
    color: Colors.light.text,
  },
  prayerContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  prayerText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  italicText: {
    fontStyle: 'italic',
  },
  prayerSource: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "right",
    fontStyle: "italic",
  },
  copyrightContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  copyrightText: {
    fontSize: 11,
    color: Colors.light.muted,
    textAlign: "center",
    lineHeight: 16,
  },
});
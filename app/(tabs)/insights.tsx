import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Stack } from 'expo-router';
import { Heart, Moon, TrendingUp } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/useGratitudeStore';
import { useEveningReviewStore } from '@/hooks/useEveningReviewStore';
import {
  makeSpiritualFitness,
  makeEmotionalPatterns,
  hasEnoughData
} from '@/utils/insightsLogic';
import { formatDateDisplay } from '@/utils/dateUtils';

import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import ScreenContainer from '@/components/ScreenContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    lineHeight: 22,
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: Colors.light.muted
  },
  content: {
    flex: 1
  },
  section: {
    margin: 16,
    marginBottom: 8
  },
  progressCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  progressTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  progressTitleText: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text
  },
  progressStats: {
    fontSize: 14,
    fontWeight: adjustFontWeight('500', true),
    color: Colors.light.text,
    marginTop: 12
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.light.muted,
    fontWeight: adjustFontWeight('500', true)
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2
  },
  dayCircleCompleted: {
    backgroundColor: Colors.light.accent,
    borderColor: Colors.light.accent
  },
  dayCircleIncomplete: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.muted
  },
  insightCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20
  },
  insightHeader: {
    marginBottom: 16
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 4
  },
  insightSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    fontStyle: 'italic'
  },
  insightContent: {
    gap: 16
  },
  insightSection: {
    gap: 4
  },
  insightSectionTitle: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text
  },
  insightText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22
  },
  noDataSection: {
    alignItems: 'center',
    paddingVertical: 20
  },
  noDataText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center'
  }
});

export default function InsightsScreen() {
  const eveningReviewStore = useEveningReviewStore();
  const gratitudeStore = useGratitudeStore();
  
  const { getWeeklyProgress, getWeeklyStreak, get7DayInsights } = eveningReviewStore;
  const { getWeeklyGratitudeProgress, get7DayGratitudeDaysCount } = gratitudeStore;
  
  const today = new Date();
  const weeklyProgress = getWeeklyProgress();
  const weeklyStreak = getWeeklyStreak();
  const gratitudeWeeklyProgress = getWeeklyGratitudeProgress();
  const gratitudeDaysCount = get7DayGratitudeDaysCount();
  const counts = get7DayInsights();
  
  const hasData = hasEnoughData(counts);
  const spiritualInsight = hasData ? makeSpiritualFitness(counts, gratitudeDaysCount) : '';
  const emotionalInsight = hasData ? makeEmotionalPatterns(counts) : '';

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Recovery Insights' }} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TrendingUp size={24} color={Colors.light.tint} />
            <Text style={styles.title}>Insights</Text>
          </View>
          <Text style={styles.subtitle}>
            {formatDateDisplay(today)}
          </Text>
          <Text style={styles.description}>
            Recovery insights and progress
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {/* Gratitude List Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View style={styles.progressTitle}>
                  <Heart size={20} color={Colors.light.tint} />
                  <Text style={styles.progressTitleText}>Gratitude List</Text>
                </View>
              </View>
              <View style={styles.weekContainer}>
                {gratitudeWeeklyProgress.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayLabel}>{day.dayName.slice(0, 3)}</Text>
                    <View style={[
                      styles.dayCircle,
                      day.completed && !day.isFuture ? styles.dayCircleCompleted : styles.dayCircleIncomplete
                    ]} />
                  </View>
                ))}
              </View>
              {(() => {
                const thisWeekCompleted = gratitudeWeeklyProgress.filter(day => day.completed && !day.isFuture).length;
                if (thisWeekCompleted > 0) {
                  return (
                    <Text style={styles.progressStats}>
                      Great job! You completed {thisWeekCompleted} day{thisWeekCompleted !== 1 ? 's' : ''} this week.
                    </Text>
                  );
                }
                return null;
              })()}
            </View>

            {/* Nightly Review Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View style={styles.progressTitle}>
                  <Moon size={20} color={Colors.light.tint} />
                  <Text style={styles.progressTitleText}>Nightly Review</Text>
                </View>
              </View>
              <View style={styles.weekContainer}>
                {weeklyProgress.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayLabel}>{day.dayName.slice(0, 3)}</Text>
                    <View style={[
                      styles.dayCircle,
                      day.completed && !day.isFuture ? styles.dayCircleCompleted : styles.dayCircleIncomplete
                    ]} />
                  </View>
                ))}
              </View>
              {weeklyStreak > 0 && (
                <Text style={styles.progressStats}>
                  Great job! You completed {weeklyStreak} day{weeklyStreak !== 1 ? 's' : ''} this week.
                </Text>
              )}
            </View>
          </View>

          {/* Insights Section */}
          <View style={styles.section}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>Insights from the past 7 days</Text>
                <Text style={styles.insightSubtitle}>Daily actions build long-term sobriety</Text>
              </View>
              {hasData ? (
                <View style={styles.insightContent}>
                  <View style={styles.insightSection}>
                    <Text style={styles.insightSectionTitle}>Spiritual Fitness</Text>
                    <Text style={styles.insightText}>{spiritualInsight}</Text>
                  </View>
                  
                  <View style={styles.insightSection}>
                    <Text style={styles.insightSectionTitle}>Emotional Patterns</Text>
                    <Text style={styles.insightText}>{emotionalInsight}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noDataSection}>
                  <Text style={styles.noDataText}>
                    Complete at least 3 days of reviews to see your insights!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
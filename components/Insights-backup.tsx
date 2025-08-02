import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ScreenContainer from "@/components/ScreenContainer";
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Heart, Brain } from 'lucide-react-native';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
import { useGratitudeStore } from '@/hooks/use-gratitude-store';
import { ThirtyDayCounts, hasEnoughData, makeSpiritualFitness, makeEmotionalPatterns, pickRecoveryQuote } from '@/lib/insightsLogic';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';

export default function Insights() {
  const { entries: reviewEntries } = useEveningReviewStore();
  const { getCompletedDaysInLast30 } = useGratitudeStore();

  const insights = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    
    const recentEntries = reviewEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff;
    });

    const counts: ThirtyDayCounts = {
      completedDays: recentEntries.length,
      resentfulCount: 0,
      selfishCount: 0,
      fearfulCount: 0,
      apologyCount: 0,
      kindnessCount: 0,
      spiritualCount: 0,
      aaTalkCount: 0,
      prayerMeditationCount: 0
    };

    recentEntries.forEach(entry => {
      if (entry.answers?.resentful) counts.resentfulCount++;
      if (entry.answers?.selfish) counts.selfishCount++;
      if (entry.answers?.fearful) counts.fearfulCount++;
      if (entry.answers?.apology) counts.apologyCount++;
      if (entry.answers?.kindness) counts.kindnessCount++;
      if (entry.answers?.spiritual) counts.spiritualCount++;
      if (entry.answers?.aaTalk) counts.aaTalkCount++;
      if (entry.answers?.prayerMeditation) counts.prayerMeditationCount++;
    });

    const gratitudeDays = getCompletedDaysInLast30();

    return {
      counts,
      gratitudeDays,
      hasData: hasEnoughData(counts),
      spiritualFitness: makeSpiritualFitness(counts, gratitudeDays),
      emotionalPatterns: makeEmotionalPatterns(counts),
      recoveryQuote: pickRecoveryQuote(counts, gratitudeDays)
    };
  }, [reviewEntries, getCompletedDaysInLast30]);

  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={['#E0F7FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Recovery Insights</Text>
          <Text style={styles.description}>
            Patterns and progress from your nightly reviews and gratitude practice
          </Text>
        </View>

        {!insights.hasData ? (
          <View style={styles.card}>
            <Text style={styles.noDataText}>
              Complete at least 7 nightly reviews to see your recovery insights and patterns.
            </Text>
          </View>
        ) : (
          <>
            {/* Spiritual Fitness */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Heart color={Colors.light.tint} size={20} />
                <Text style={styles.cardTitle}>Spiritual Fitness</Text>
              </View>
              <Text style={styles.insightText}>{insights.spiritualFitness}</Text>
            </View>

            {/* Emotional Patterns */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Brain color={Colors.light.tint} size={20} />
                <Text style={styles.cardTitle}>Emotional Patterns</Text>
              </View>
              <Text style={styles.insightText}>{insights.emotionalPatterns}</Text>
            </View>

            {/* Recovery Progress */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TrendingUp color={Colors.light.tint} size={20} />
                <Text style={styles.cardTitle}>Recovery Progress</Text>
              </View>
              <Text style={styles.insightText}>{insights.recoveryQuote}</Text>
            </View>

            {/* Detailed Stats */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>30-Day Summary</Text>
              <Text style={styles.statsSubtitle}>
                Based on {insights.counts.completedDays} completed reviews
              </Text>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Resentful Days:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.resentfulCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.resentfulCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Selfish Days:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.selfishCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.selfishCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Fearful Days:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.fearfulCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.fearfulCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Amends Needed:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.apologyCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.apologyCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Acts of Service:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.kindnessCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.kindnessCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Spiritual Connection:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.spiritualCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.spiritualCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>AA Fellowship:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.aaTalkCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.aaTalkCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Prayer & Meditation:</Text>
                <Text style={styles.statValue}>
                  {insights.counts.prayerMeditationCount} out of {insights.counts.completedDays} days ({Math.round((insights.counts.prayerMeditationCount / insights.counts.completedDays) * 100)}%)
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Gratitude Practice:</Text>
                <Text style={styles.statValue}>
                  {insights.gratitudeDays} days in the last 30 ({Math.round((insights.gratitudeDays / 30) * 100)}%)
                </Text>
              </View>
            </View>
          </>
        )}

        <Text style={styles.privacyText}>
          Your insights are generated from data saved only on your device. Nothing is uploaded or shared.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
    marginLeft: 8,
  },
  insightText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: adjustFontWeight('500'),
    color: Colors.light.text,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 12,
  },

  privacyText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
  },
});
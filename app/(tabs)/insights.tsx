import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { Heart, Moon, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/useGratitudeStore';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
import {
  makeSpiritualFitness,
  makeEmotionalPatterns,
  pickRecoveryQuote,
  hasEnoughData
} from '@/utils/insightsLogic';
import { formatDateDisplay } from '@/utils/dateUtils';

import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import ScreenContainer from '@/components/ScreenContainer';
import WeeklyProgressCard from '@/components/WeeklyProgressCard';

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
  title: {
    fontSize: 24,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    lineHeight: 22
  },
  content: {
    flex: 1
  },
  section: {
    margin: 16,
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
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
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  progressStats: {
    fontSize: 14,
    color: Colors.light.muted
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
    borderColor: Colors.light.divider
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: adjustFontWeight('600', true)
  },
  dayNumberCompleted: {
    color: 'white'
  },
  dayNumberIncomplete: {
    color: Colors.light.muted
  },
  insightCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  insightText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22
  },
  quoteCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center'
  },
  quoteText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
    marginTop: 8
  },
  noDataCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center'
  },
  noDataText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12
  },
  description: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 4
  },
  completedDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  insightsHeader: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text
  },
  insightsContent: {
    marginTop: 8
  },
  quoteSection: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider
  },
  noDataSection: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 20
  }
});

export default function InsightsScreen() {
  const [insightsOpen, setInsightsOpen] = useState(false);
  
  const gratitudeStore = useGratitudeStore();
  const eveningStore = useEveningReviewStore();
  
  // Check if stores are properly initialized
  if (!gratitudeStore || !eveningStore) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: 'Recovery Insights' }} />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Loading...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const today = new Date();
  const weeklyProgress = eveningStore.getWeeklyProgress();

  const gratitudeWeeklyProgress = gratitudeStore.getWeeklyGratitudeProgress();
  const gratitudeDaysCount = gratitudeStore.getGratitudeDaysCount();
  const counts = eveningStore.getThirtyDayCounts();
  
  const hasData = hasEnoughData(counts);
  const spiritualInsight = hasData ? makeSpiritualFitness(counts, gratitudeDaysCount) : '';
  const emotionalInsight = hasData ? makeEmotionalPatterns(counts) : '';
  const quote = pickRecoveryQuote(counts, gratitudeDaysCount);



  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Recovery Insights' }} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>
            {formatDateDisplay(today)}
          </Text>
          <Text style={styles.description}>
            Recovery insights and progress
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <WeeklyProgressCard title="Gratitude List" icon={Heart} data={gratitudeWeeklyProgress} />
            <WeeklyProgressCard title="Nightly Review" icon={Moon} data={weeklyProgress} />
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.insightsHeader}
              onPress={() => setInsightsOpen(!insightsOpen)}
            >
              <Text style={styles.insightsTitle}>Insights from the past 30 days</Text>
              {insightsOpen ? 
                <ChevronDown size={20} color={Colors.light.text} /> : 
                <ChevronRight size={20} color={Colors.light.text} />
              }
            </TouchableOpacity>
            
            {insightsOpen && (
              <View style={styles.insightsContent}>
                {hasData ? (
                  <>
                    <View style={styles.insightCard}>
                      <Text style={styles.insightTitle}>Spiritual Fitness</Text>
                      <Text style={styles.insightText}>{spiritualInsight}</Text>
                    </View>
                    
                    <View style={styles.insightCard}>
                      <Text style={styles.insightTitle}>Emotional Patterns</Text>
                      <Text style={styles.insightText}>{emotionalInsight}</Text>
                    </View>
                    
                    <View style={styles.quoteSection}>
                      <Text style={styles.quoteText}>&ldquo;{quote}&rdquo;</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.noDataSection}>
                    <Text style={styles.noDataText}>
                      Complete at least 7 days of reviews to see your insights!
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>


        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
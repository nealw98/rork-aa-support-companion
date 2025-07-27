import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, Heart, Moon, TrendingUp, Quote } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/useGratitudeStore';
import { useEveningReviewStore } from '@/hooks/useEveningReviewStore';
import {
  makeSpiritualFitness,
  makeEmotionalPatterns,
  pickRecoveryQuote,
  hasEnoughData
} from '@/utils/insightsLogic';

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
  }
});

export default function InsightsScreen() {
  const { entries: gratitudeEntries, getWeeklyProgress: getGratitudeProgress } = useGratitudeStore();
  const { entries: reviewEntries, getWeeklyProgress: getReviewProgress } = useEveningReviewStore();
  
  const gratitudeWeekly = getGratitudeProgress();
  const reviewWeekly = getReviewProgress();
  const hasData = hasEnoughData(gratitudeEntries, reviewEntries);
  
  const spiritualInsight = hasData ? makeSpiritualFitness(gratitudeEntries, reviewEntries) : '';
  const emotionalInsight = hasData ? makeEmotionalPatterns(reviewEntries) : '';
  const quote = pickRecoveryQuote();

  const renderWeeklyProgress = (title: string, icon: any, data: any[], type: 'gratitude' | 'review') => {
    const completedDays = data.filter(day => day.completed).length;
    const IconComponent = icon;
    
    return (
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressTitle}>
            <IconComponent size={20} color={Colors.light.tint} />
            <Text style={styles.progressTitle}>{title}</Text>
          </View>
          <Text style={styles.progressStats}>{completedDays}/7 days</Text>
        </View>
        
        <View style={styles.weekContainer}>
          {data.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            
            return (
              <View key={day.date} style={styles.dayContainer}>
                <Text style={styles.dayLabel}>{dayName}</Text>
                <View style={[
                  styles.dayCircle,
                  day.completed ? styles.dayCircleCompleted : styles.dayCircleIncomplete
                ]}>
                  <Text style={[
                    styles.dayNumber,
                    day.completed ? styles.dayNumberCompleted : styles.dayNumberIncomplete
                  ]}>
                    {type === 'gratitude' && day.completed ? day.count : 
                     type === 'review' && day.completed ? day.yesCount :
                     dayNum}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Recovery Insights' }} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recovery Insights</Text>
          <Text style={styles.subtitle}>
            Your progress and patterns over the past 7 days
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Calendar size={18} color={Colors.light.text} />
              Weekly Progress
            </Text>
            
            {renderWeeklyProgress('Daily Gratitude', Heart, gratitudeWeekly, 'gratitude')}
            {renderWeeklyProgress('Evening Review', Moon, reviewWeekly, 'review')}
          </View>

          {hasData ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  <TrendingUp size={18} color={Colors.light.text} />
                  30-Day Insights
                </Text>
                
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>
                    <Heart size={16} color={Colors.light.accent} />
                    Spiritual Fitness
                  </Text>
                  <Text style={styles.insightText}>{spiritualInsight}</Text>
                </View>
                
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>
                    <Moon size={16} color={Colors.light.tint} />
                    Emotional Patterns
                  </Text>
                  <Text style={styles.insightText}>{emotionalInsight}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.noDataCard}>
              <TrendingUp size={48} color={Colors.light.muted} />
              <Text style={styles.noDataText}>
                Complete more gratitude lists and evening reviews to see personalized insights about your recovery journey.
              </Text>
            </View>
          )}

          <View style={styles.quoteCard}>
            <Quote size={24} color="white" />
            <Text style={styles.quoteText}>{quote}</Text>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Calendar } from 'lucide-react-native';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
import Colors from '@/constants/colors';



const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function EveningReview() {
  const { isCompletedToday, completeToday, getWeeklyProgress, getWeeklyStreak } = useEveningReviewStore();
  const [answers, setAnswers] = useState<{ [key: string]: boolean | null }>({});
  const [reflection, setReflection] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const today = new Date();
  const isCompleted = isCompletedToday();
  const weeklyProgress = getWeeklyProgress();
  const weeklyStreak = getWeeklyStreak();

  const questions = [
    'Was I resentful, selfish, dishonest, or afraid today?',
    'Do I owe anyone an apology?',
    'Did I help someone or show kindness today?',
    'Did I talk with another alcoholic today?',
    'Was I spiritually connected today?'
  ];

  const handleAnswerChange = (questionIndex: number, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleComplete = () => {
    completeToday();
    setShowConfirmation(true);
  };

  const handleStartNew = () => {
    setAnswers({});
    setReflection('');
    setShowConfirmation(false);
  };

  if (showConfirmation || isCompleted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.light.chatBubbleUser, Colors.light.chatBubbleBot]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Review Complete</Text>
            <Text style={styles.subtitle}>{formatDateDisplay(today)}</Text>
            <Text style={styles.description}>
              Evening reflection helps us stay connected to our recovery
            </Text>
          </View>

          {/* Confirmation Message */}
          <View style={styles.card}>
            <Text style={styles.confirmationText}>
              Thanks for checking in. You&apos;re doing the work — one day at a time.
            </Text>
          </View>

          {/* Weekly Progress */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar color={Colors.light.tint} size={20} />
              <Text style={styles.cardTitle}>This Week&apos;s Progress</Text>
            </View>
            
            <View style={styles.weeklyProgress}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <Text style={styles.dayName}>{day.dayName}</Text>
                  <View style={[
                    styles.dayCircle,
                    day.isFuture && styles.dayCircleFuture,
                    day.completed && !day.isFuture && styles.dayCircleCompleted,
                    !day.completed && !day.isFuture && styles.dayCircleIncomplete,
                    day.isToday && styles.dayCircleToday
                  ]}>
                    {day.completed && !day.isFuture && (
                      <CheckCircle color="white" size={16} />
                    )}
                  </View>
                </View>
              ))}
            </View>
            
            <Text style={styles.streakText}>
              {weeklyStreak} {weeklyStreak === 1 ? 'day' : 'days'} this week — keep it going!
            </Text>
          </View>

          {/* Privacy Notice */}
          <Text style={styles.privacyText}>
            Your responses are saved only on your device. Nothing is uploaded or shared.
          </Text>

          {!isCompleted && (
            <TouchableOpacity style={styles.outlineButton} onPress={handleStartNew}>
              <Text style={styles.outlineButtonText}>Start New Review</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.chatBubbleUser, Colors.light.chatBubbleBot]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Evening Review</Text>
          <Text style={styles.description}>
            Nightly inventory based on AA&apos;s &apos;When We Retire at Night&apos; guidance
          </Text>
        </View>

        {/* Questions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{formatDateDisplay(today)}</Text>
          
          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question}</Text>
                <View style={styles.answerButtons}>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      answers[index] === true && styles.answerButtonSelected
                    ]}
                    onPress={() => handleAnswerChange(index, true)}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      answers[index] === true && styles.answerButtonTextSelected
                    ]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      answers[index] === false && styles.answerButtonSelected
                    ]}
                    onPress={() => handleAnswerChange(index, false)}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      answers[index] === false && styles.answerButtonTextSelected
                    ]}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reflection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reflection</Text>
          <Text style={styles.reflectionLabel}>Something I did well today</Text>
          <TextInput
            style={styles.textInput}
            value={reflection}
            onChangeText={setReflection}
            placeholder=""
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete Review</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <Text style={styles.privacyText}>
          Your responses are saved only on your device. Nothing is uploaded or shared.
        </Text>
      </ScrollView>
    </View>
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
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tint,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.light.muted,
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
    marginLeft: 8,
  },
  confirmationText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleFuture: {
    backgroundColor: '#e9ecef',
  },
  dayCircleCompleted: {
    backgroundColor: Colors.light.tint,
  },
  dayCircleIncomplete: {
    backgroundColor: '#e9ecef',
    borderWidth: 2,
    borderColor: 'rgba(108, 117, 125, 0.2)',
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  streakText: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
  },
  questionsContainer: {
    marginTop: 16,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  answerButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    backgroundColor: 'transparent',
  },
  answerButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  answerButtonText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  answerButtonTextSelected: {
    color: 'white',
  },
  reflectionLabel: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  completeButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  outlineButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '500',
  },
  privacyText: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
});
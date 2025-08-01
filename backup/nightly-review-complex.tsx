import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { CheckCircle, Circle, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEveningReviewStore } from '@/hooks/useEveningReviewStore';
import { formatDateDisplay } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import ScreenContainer from '@/components/ScreenContainer';

export interface DailyReviewAnswers {
  resentful: boolean;
  selfish: boolean;
  fearful: boolean;
  apology: boolean;
  kindness: boolean;
  spiritual: boolean;
  aaTalk: boolean;
  prayerMeditation: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)'
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
    lineHeight: 22
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: adjustFontWeight('600', true)
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.light.divider,
    borderRadius: 2,
    marginLeft: 12
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 2
  },
  content: {
    flex: 1
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  questionText: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 16,
    lineHeight: 22
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.divider
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: adjustFontWeight('600', true)
  },
  notesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 12
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.light.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
    minHeight: 100,
    textAlignVertical: 'top'
  },
  saveButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.6
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  completionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 12
  },
  completionText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22
  },
  dateHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  dateText: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 4
  }
});

const questions = [
  { key: 'resentful' as keyof DailyReviewAnswers, text: 'Was I resentful today?', placeholder: 'With whom?' },
  { key: 'selfish' as keyof DailyReviewAnswers, text: 'Was I selfish and self-centered today?', placeholder: 'In what way?' },
  { key: 'fearful' as keyof DailyReviewAnswers, text: 'Was I fearful or worrisome today?', placeholder: 'How so?' },
  { key: 'apology' as keyof DailyReviewAnswers, text: 'Do I owe anyone an apology?', placeholder: 'Whom have you harmed?' },
  { key: 'kindness' as keyof DailyReviewAnswers, text: 'Was I of service or kind to others today?', placeholder: 'What did you do?' },
  { key: 'spiritual' as keyof DailyReviewAnswers, text: 'Was I spiritually connected today?', placeholder: 'How so?' },
  { key: 'aaTalk' as keyof DailyReviewAnswers, text: 'Did I talk to someone in recovery today?' },
  { key: 'prayerMeditation' as keyof DailyReviewAnswers, text: 'Did I pray or meditate today?' }
];

export default function NightlyReviewBackupScreen() {
  const eveningReviewStore = useEveningReviewStore();
  const { isCompletedToday, completeToday, getTodaysAnswers } = eveningReviewStore;
  
  // Form state
  const [resentfulFlag, setResentfulFlag] = useState('');
  const [resentfulNote, setResentfulNote] = useState('');
  const [selfishFlag, setSelfishFlag] = useState('');
  const [selfishNote, setSelfishNote] = useState('');
  const [fearfulFlag, setFearfulFlag] = useState('');
  const [fearfulNote, setFearfulNote] = useState('');
  const [apologyFlag, setApologyFlag] = useState('');
  const [apologyName, setApologyName] = useState('');
  const [kindnessFlag, setKindnessFlag] = useState('');
  const [kindnessNote, setKindnessNote] = useState('');
  const [spiritualFlag, setSpiritualFlag] = useState('');
  const [spiritualNote, setSpiritualNote] = useState('');
  const [aaTalkFlag, setAaTalkFlag] = useState('');
  const [prayerMeditationFlag, setPrayerMeditationFlag] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const isCompleted = isCompletedToday();

  // Only load existing answers for display purposes (no editing allowed)
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Count answered questions
  const getAnsweredCount = () => {
    const flags = [resentfulFlag, selfishFlag, fearfulFlag, apologyFlag, kindnessFlag, spiritualFlag, aaTalkFlag, prayerMeditationFlag];
    return flags.filter(flag => flag !== '').length;
  };

  const answeredCount = getAnsweredCount();
  const totalQuestions = 8;
  const allAnswered = answeredCount === totalQuestions;

  const handleConfirmedSubmit = () => {
    const answers = {
      resentful: resentfulFlag === 'yes',
      selfish: selfishFlag === 'yes',
      fearful: fearfulFlag === 'yes',
      apology: apologyFlag === 'yes',
      kindness: kindnessFlag === 'yes',
      spiritual: spiritualFlag === 'yes',
      aaTalk: aaTalkFlag === 'yes',
      prayerMeditation: prayerMeditationFlag === 'yes',
    };
    completeToday(answers);
    setSubmitted(true);
    setShowConfirmDialog(false);
    
    // Add delay to ensure localStorage is updated before navigation
    setTimeout(() => {
      router.push('/(tabs)/insights');
    }, 200);
  };

  const handleSave = () => {
    if (!allAnswered) {
      Alert.alert(
        'Incomplete Review',
        `Please answer all ${totalQuestions} questions to complete your nightly review.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Complete Nightly Review?',
      'Your answers will be saved and you\'ll be taken to your insights page to see your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: handleConfirmedSubmit
        }
      ]
    );
  };

  const getAnswerState = (key: keyof DailyReviewAnswers) => {
    switch (key) {
      case 'resentful': return resentfulFlag;
      case 'selfish': return selfishFlag;
      case 'fearful': return fearfulFlag;
      case 'apology': return apologyFlag;
      case 'kindness': return kindnessFlag;
      case 'spiritual': return spiritualFlag;
      case 'aaTalk': return aaTalkFlag;
      case 'prayerMeditation': return prayerMeditationFlag;
      default: return '';
    }
  };

  const setAnswerState = (key: keyof DailyReviewAnswers, value: string) => {
    switch (key) {
      case 'resentful': setResentfulFlag(value); break;
      case 'selfish': setSelfishFlag(value); break;
      case 'fearful': setFearfulFlag(value); break;
      case 'apology': setApologyFlag(value); break;
      case 'kindness': setKindnessFlag(value); break;
      case 'spiritual': setSpiritualFlag(value); break;
      case 'aaTalk': setAaTalkFlag(value); break;
      case 'prayerMeditation': setPrayerMeditationFlag(value); break;
    }
  };

  const renderQuestion = (question: typeof questions[0], index: number) => {
    const currentAnswer = getAnswerState(question.key);
    
    return (
      <View key={question.key} style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {index + 1}. {question.text}
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              currentAnswer === 'yes' && styles.optionButtonSelected
            ]}
            onPress={() => setAnswerState(question.key, 'yes')}
          >
            {currentAnswer === 'yes' ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Circle size={20} color={Colors.light.text} />
            )}
            <Text style={[
              styles.optionText,
              currentAnswer === 'yes' && styles.optionTextSelected
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              currentAnswer === 'no' && styles.optionButtonSelected
            ]}
            onPress={() => setAnswerState(question.key, 'no')}
          >
            {currentAnswer === 'no' ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Circle size={20} color={Colors.light.text} />
            )}
            <Text style={[
              styles.optionText,
              currentAnswer === 'no' && styles.optionTextSelected
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
        {currentAnswer === 'yes' && question.placeholder && (
          <TextInput
            style={styles.notesInput}
            placeholder={question.placeholder}
            placeholderTextColor={Colors.light.muted}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => {
              // Dismiss keyboard when done is pressed
            }}
          />
        )}
      </View>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <ScreenContainer noPadding>
        <Stack.Screen options={{ title: 'Nightly Review' }} />
        <View style={styles.container}>
          <LinearGradient
            colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
          />
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Moon size={24} color={Colors.light.tint} />
              <Text style={styles.title}>Nightly Review</Text>
            </View>
            <Text style={styles.subtitle}>Loading...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Show completion message if already submitted or completed today
  if (submitted || isCompleted) {
    return (
      <ScreenContainer noPadding>
        <Stack.Screen options={{ title: 'Nightly Review' }} />
        <View style={styles.container}>
          <LinearGradient
            colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
          />
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Moon size={24} color={Colors.light.tint} />
              <Text style={styles.title}>Nightly Review</Text>
            </View>
            <Text style={styles.subtitle}>Complete</Text>
          </View>
          
          <View style={styles.completionContainer}>
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>Review Complete</Text>
              <Text style={styles.completionText}>
                Your nightly review for {formatDateDisplay(today)} has been saved.
              </Text>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={() => router.push('/(tabs)/insights')}
              >
                <Text style={styles.saveButtonText}>View Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      <Stack.Screen options={{ title: 'Nightly Review' }} />
      
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Moon size={24} color={Colors.light.tint} />
            <Text style={styles.title}>Nightly Review</Text>
          </View>
          <Text style={styles.subtitle}>
            Nightly inventory based on AA's 'When We Retire at Night' guidance
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{formatDateDisplay(today)}</Text>
          </View>
          
          {questions.map((question, index) => renderQuestion(question, index))}
        </ScrollView>

        <TouchableOpacity 
          style={[
            styles.saveButton,
            !allAnswered && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={!allAnswered}
        >
          <Text style={styles.saveButtonText}>
            Complete — {answeredCount}/{totalQuestions}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
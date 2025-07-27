import React from 'react';
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
import { CheckCircle, Circle, Save } from 'lucide-react-native';
import { useEveningReviewStore, ReviewAnswers } from '@/hooks/useEveningReviewStore';
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
    backgroundColor: Colors.light.cardBackground,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 20
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
    backgroundColor: Colors.light.cardBackground,
    margin: 16,
    borderRadius: 12,
    padding: 20
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
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
  }
});

const questions = [
  { key: 'prayer' as keyof ReviewAnswers, text: 'Did I pray and meditate today?' },
  { key: 'resentments' as keyof ReviewAnswers, text: 'Did I harbor any resentments today?' },
  { key: 'fears' as keyof ReviewAnswers, text: 'Was I dominated by fear today?' },
  { key: 'harms' as keyof ReviewAnswers, text: 'Did I harm anyone today?' },
  { key: 'amends' as keyof ReviewAnswers, text: 'Do I owe anyone an amends?' },
  { key: 'helping' as keyof ReviewAnswers, text: 'Did I help someone today?' },
  { key: 'gratitude' as keyof ReviewAnswers, text: 'Did I practice gratitude today?' },
  { key: 'meditation' as keyof ReviewAnswers, text: 'Did I take time for quiet reflection?' }
];

export default function NightlyReviewScreen() {
  const {
    currentAnswers,
    currentNotes,
    updateAnswer,
    updateNotes,
    saveReview,
    hasCompletedToday,
    getTodayProgress
  } = useEveningReviewStore();
  

  const progress = getTodayProgress();

  const handleSave = () => {
    Alert.alert(
      'Complete Your Daily Inventory?',
      'Your evening review will be saved and cannot be modified. Are you ready to complete today&apos;s inventory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            saveReview();
            router.push('/insights');
          }
        }
      ]
    );
  };

  const renderQuestion = (question: typeof questions[0], index: number) => (
    <View key={question.key} style={styles.questionContainer}>
      <Text style={styles.questionText}>
        {index + 1}. {question.text}
      </Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            currentAnswers[question.key] === true && styles.optionButtonSelected
          ]}
          onPress={() => updateAnswer(question.key, true)}
        >
          {currentAnswers[question.key] === true ? (
            <CheckCircle size={20} color="white" />
          ) : (
            <Circle size={20} color={Colors.light.text} />
          )}
          <Text style={[
            styles.optionText,
            currentAnswers[question.key] === true && styles.optionTextSelected
          ]}>
            Yes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionButton,
            currentAnswers[question.key] === false && styles.optionButtonSelected
          ]}
          onPress={() => updateAnswer(question.key, false)}
        >
          {currentAnswers[question.key] === false ? (
            <CheckCircle size={20} color="white" />
          ) : (
            <Circle size={20} color={Colors.light.text} />
          )}
          <Text style={[
            styles.optionText,
            currentAnswers[question.key] === false && styles.optionTextSelected
          ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Evening Review' }} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Evening Review</Text>
          <Text style={styles.subtitle}>
            Take a moment to reflect on your day. This daily inventory helps you stay spiritually fit.
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {progress.answered}/{progress.total} answered
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress.percentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {questions.map((question, index) => renderQuestion(question, index))}
          
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any additional thoughts or reflections about your day..."
              placeholderTextColor={Colors.light.muted}
              value={currentNotes}
              onChangeText={updateNotes}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>
            {hasCompletedToday() ? 'Update & View Insights' : 'Save & View Insights'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
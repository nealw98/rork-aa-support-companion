import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Share
} from 'react-native';
import { Stack } from 'expo-router';
import { CheckCircle, Circle, Moon, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDateDisplay } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import ScreenContainer from '@/components/ScreenContainer';

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
  shareButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
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
  }
});

const questions = [
  { key: 'resentful', text: 'Was I resentful today?', placeholder: 'With whom?' },
  { key: 'selfish', text: 'Was I selfish and self-centered today?', placeholder: 'In what way?' },
  { key: 'fearful', text: 'Was I fearful or worrisome today?', placeholder: 'How so?' },
  { key: 'apology', text: 'Do I owe anyone an apology?', placeholder: 'Whom have you harmed?' },
  { key: 'kindness', text: 'Was I of service or kind to others today?', placeholder: 'What did you do?' },
  { key: 'spiritual', text: 'Was I spiritually connected today?', placeholder: 'How so?' },
  { key: 'aaTalk', text: 'Did I talk to someone in recovery today?' },
  { key: 'prayerMeditation', text: 'Did I pray or meditate today?' }
];

export default function NightlyReviewScreen() {
  // Form state
  const [answers, setAnswers] = useState<Record<string, { flag: string; note: string }>>({
    resentful: { flag: '', note: '' },
    selfish: { flag: '', note: '' },
    fearful: { flag: '', note: '' },
    apology: { flag: '', note: '' },
    kindness: { flag: '', note: '' },
    spiritual: { flag: '', note: '' },
    aaTalk: { flag: '', note: '' },
    prayerMeditation: { flag: '', note: '' }
  });

  const today = new Date();

  const setAnswerFlag = (key: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: { ...prev[key], flag: value }
    }));
  };

  const setAnswerNote = (key: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: { ...prev[key], note: value }
    }));
  };

  const handleShare = async () => {
    let shareText = 'Nightly Review for ' + formatDateDisplay(today) + '\n\n';
    questions.forEach(question => {
      const answer = answers[question.key];
      shareText += question.text + '\n';
      if (answer.flag) {
        shareText += 'Answer: ' + answer.flag.charAt(0).toUpperCase() + answer.flag.slice(1) + '\n';
        if (answer.flag === 'yes' && answer.note) {
          shareText += 'Details: ' + answer.note + '\n';
        }
      } else {
        shareText += 'Answer: Not answered\n';
      }
      shareText += '\n';
    });

    try {
      await Share.share({
        message: shareText,
        title: 'Nightly Review - ' + formatDateDisplay(today)
      });
    } catch (error) {
      console.error('Error sharing nightly review:', error);
    }
  };

  const renderQuestion = (question: typeof questions[0], index: number) => {
    const currentAnswer = answers[question.key];
    
    return (
      <View key={question.key} style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {index + 1}. {question.text}
        </Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              currentAnswer.flag === 'yes' && styles.optionButtonSelected
            ]}
            onPress={() => setAnswerFlag(question.key, 'yes')}
          >
            {currentAnswer.flag === 'yes' ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Circle size={20} color={Colors.light.text} />
            )}
            <Text style={[
              styles.optionText,
              currentAnswer.flag === 'yes' && styles.optionTextSelected
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              currentAnswer.flag === 'no' && styles.optionButtonSelected
            ]}
            onPress={() => setAnswerFlag(question.key, 'no')}
          >
            {currentAnswer.flag === 'no' ? (
              <CheckCircle size={20} color="white" />
            ) : (
              <Circle size={20} color={Colors.light.text} />
            )}
            <Text style={[
              styles.optionText,
              currentAnswer.flag === 'no' && styles.optionTextSelected
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
        {currentAnswer.flag === 'yes' && question.placeholder && (
          <TextInput
            style={styles.notesInput}
            placeholder={question.placeholder}
            placeholderTextColor={Colors.light.muted}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
            value={currentAnswer.note}
            onChangeText={(text) => setAnswerNote(question.key, text)}
          />
        )}
      </View>
    );
  };

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
            Nightly inventory based on AA guidance
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{formatDateDisplay(today)}</Text>
          </View>
          
          {questions.map((question, index) => renderQuestion(question, index))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
        >
          <Share2 size={20} color="white" />
          <Text style={styles.shareButtonText}>Share Nightly Review</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
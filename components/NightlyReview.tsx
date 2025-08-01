import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import ScreenContainer from "@/components/ScreenContainer";
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Calendar, Share2 } from 'lucide-react-native';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import { formatDateDisplay } from '@/lib/dateUtils';

export default function NightlyReview() {
  const { getWeeklyProgress, getWeeklyStreak, saveEntry, resetIfNewDay } = useEveningReviewStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Form state - 8 separate questions like web version
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

  const weeklyProgress = getWeeklyProgress();
  const weeklyStreak = getWeeklyStreak();

  useEffect(() => {
    const checkMidnightReset = () => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        resetIfNewDay();
        setCurrentDate(now);
        // Reset all form fields
        setResentfulFlag('');
        setResentfulNote('');
        setSelfishFlag('');
        setSelfishNote('');
        setFearfulFlag('');
        setFearfulNote('');
        setApologyFlag('');
        setApologyName('');
        setKindnessFlag('');
        setKindnessNote('');
        setSpiritualFlag('');
        setSpiritualNote('');
        setAaTalkFlag('');
        setPrayerMeditationFlag('');
      }
    };

    const interval = setInterval(checkMidnightReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentDate, resetIfNewDay]);

  const questions = [
    {
      text: '1. Was I resentful today?',
      flag: resentfulFlag,
      setFlag: setResentfulFlag,
      note: resentfulNote,
      setNote: setResentfulNote,
      placeholder: 'With whom?'
    },
    {
      text: '2. Was I selfish and self-centered today?',
      flag: selfishFlag,
      setFlag: setSelfishFlag,
      note: selfishNote,
      setNote: setSelfishNote,
      placeholder: 'In what way?'
    },
    {
      text: '3. Was I fearful or worrisome today?',
      flag: fearfulFlag,
      setFlag: setFearfulFlag,
      note: fearfulNote,
      setNote: setFearfulNote,
      placeholder: 'How so?'
    },
    {
      text: '4. Do I owe anyone an apology?',
      flag: apologyFlag,
      setFlag: setApologyFlag,
      note: apologyName,
      setNote: setApologyName,
      placeholder: 'Whom have you harmed?'
    },
    {
      text: '5. Was I of service or kind to others today?',
      flag: kindnessFlag,
      setFlag: setKindnessFlag,
      note: kindnessNote,
      setNote: setKindnessNote,
      placeholder: 'What did you do?'
    },
    {
      text: '6. Was I spiritually connected today?',
      flag: spiritualFlag,
      setFlag: setSpiritualFlag,
      note: spiritualNote,
      setNote: setSpiritualNote,
      placeholder: 'How so?'
    },
    {
      text: '7. Did I talk to someone in recovery today?',
      flag: aaTalkFlag,
      setFlag: setAaTalkFlag,
      note: '',
      setNote: () => {},
      placeholder: ''
    },
    {
      text: '8. Did I pray or meditate today?',
      flag: prayerMeditationFlag,
      setFlag: setPrayerMeditationFlag,
      note: '',
      setNote: () => {},
      placeholder: ''
    }
  ];

  const handleShare = async () => {
    const reviewData = {
      date: formatDateDisplay(currentDate),
      resentful: { flag: resentfulFlag, note: resentfulNote },
      selfish: { flag: selfishFlag, note: selfishNote },
      fearful: { flag: fearfulFlag, note: fearfulNote },
      apology: { flag: apologyFlag, name: apologyName },
      kindness: { flag: kindnessFlag, note: kindnessNote },
      spiritual: { flag: spiritualFlag, note: spiritualNote },
      aaTalk: aaTalkFlag,
      prayerMeditation: prayerMeditationFlag
    };

    const shareText = `Nightly Review - ${reviewData.date}\n\n` +
      `1. Was I resentful today? ${reviewData.resentful.flag}${reviewData.resentful.note ? ` - ${reviewData.resentful.note}` : ''}\n` +
      `2. Was I selfish and self-centered today? ${reviewData.selfish.flag}${reviewData.selfish.note ? ` - ${reviewData.selfish.note}` : ''}\n` +
      `3. Was I fearful or worrisome today? ${reviewData.fearful.flag}${reviewData.fearful.note ? ` - ${reviewData.fearful.note}` : ''}\n` +
      `4. Do I owe anyone an apology? ${reviewData.apology.flag}${reviewData.apology.name ? ` - ${reviewData.apology.name}` : ''}\n` +
      `5. Was I of service or kind to others today? ${reviewData.kindness.flag}${reviewData.kindness.note ? ` - ${reviewData.kindness.note}` : ''}\n` +
      `6. Was I spiritually connected today? ${reviewData.spiritual.flag}${reviewData.spiritual.note ? ` - ${reviewData.spiritual.note}` : ''}\n` +
      `7. Did I talk to someone in recovery today? ${reviewData.aaTalk}\n` +
      `8. Did I pray or meditate today? ${reviewData.prayerMeditation}`;

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Nightly Review',
            text: shareText,
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          alert('Review copied to clipboard!');
        }
      } else {
        await Share.share({
          message: shareText,
          title: 'Nightly Review'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };





  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={[Colors.light.chatBubbleUser, Colors.light.chatBubbleBot]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      

      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nightly Review</Text>
          <Text style={styles.dateText}>{formatDateDisplay(currentDate)}</Text>
          <Text style={styles.description}>
            Nightly inventory based on AA&apos;s &apos;When We Retire at Night&apos; guidance
          </Text>
        </View>

        {/* Questions */}
        <View style={styles.card}>
          
          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.text}</Text>
                <View style={styles.answerButtons}>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      question.flag === 'yes' && styles.answerButtonSelected
                    ]}
                    onPress={() => question.setFlag('yes')}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      question.flag === 'yes' && styles.answerButtonTextSelected
                    ]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      question.flag === 'no' && styles.answerButtonSelected
                    ]}
                    onPress={() => question.setFlag('no')}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      question.flag === 'no' && styles.answerButtonTextSelected
                    ]}>No</Text>
                  </TouchableOpacity>
                </View>
                
                {question.flag === 'yes' && question.placeholder && (
                  <TextInput
                    style={styles.textInput}
                    placeholder={question.placeholder}
                    value={question.note}
                    onChangeText={question.setNote}
                    multiline
                    placeholderTextColor={Colors.light.muted}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Share2 color="white" size={16} />
          <Text style={styles.shareButtonText}>Share Nightly Review</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <Text style={styles.privacyText}>
          Your responses are saved only on your device. Nothing is uploaded or shared.
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
    marginBottom: 4,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: Colors.light.tint,
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
    fontWeight: adjustFontWeight('600', true),
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
    backgroundColor: '#e9ecef',
    borderWidth: 2,
    borderColor: 'rgba(108, 117, 125, 0.2)',
  },
  dayCircleCompleted: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  dayCircleToday: {
    borderColor: Colors.light.tint,
    borderWidth: 3,
  },
  dayCircleFuture: {
    backgroundColor: '#e9ecef',
    borderColor: 'rgba(108, 117, 125, 0.2)',
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
    fontWeight: adjustFontWeight('500'),
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
    fontWeight: adjustFontWeight('500'),
  },
  answerButtonTextSelected: {
    color: 'white',
  },
  textInput: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    color: Colors.light.text,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 25,
    marginHorizontal: 32,
    marginBottom: 16,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
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
    fontWeight: adjustFontWeight('500'),
  },
  privacyText: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  unsubmitButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 32,
  },
  unsubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('500'),
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
  },
  insightsSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 16,
    textAlign: 'center',
  },
});
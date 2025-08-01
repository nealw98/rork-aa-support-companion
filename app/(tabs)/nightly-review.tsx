import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Share,
  KeyboardAvoidingView
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ScreenContainer from "@/components/ScreenContainer";
import { LinearGradient } from 'expo-linear-gradient';
import { Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';

const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function NightlyReview() {
  // Form state - matching web app structure
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

  const scrollViewRef = useRef<ScrollView>(null);
  const today = new Date();

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
    console.log('Share button pressed');

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a summary of the review
    const answeredQuestions = [];
    
    // Include all answered questions, regardless of yes/no
    if (resentfulFlag) {
      const answer = resentfulFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`1. Was I resentful today? ${answer}${resentfulFlag === 'yes' && resentfulNote ? ` - ${resentfulNote}` : ''}`);
    }
    if (selfishFlag) {
      const answer = selfishFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`2. Was I selfish and self-centered today? ${answer}${selfishFlag === 'yes' && selfishNote ? ` - ${selfishNote}` : ''}`);
    }
    if (fearfulFlag) {
      const answer = fearfulFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`3. Was I fearful or worrisome today? ${answer}${fearfulFlag === 'yes' && fearfulNote ? ` - ${fearfulNote}` : ''}`);
    }
    if (apologyFlag) {
      const answer = apologyFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`4. Do I owe anyone an apology? ${answer}${apologyFlag === 'yes' && apologyName ? ` - ${apologyName}` : ''}`);
    }
    if (kindnessFlag) {
      const answer = kindnessFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`5. Was I of service or kind to others today? ${answer}${kindnessFlag === 'yes' && kindnessNote ? ` - ${kindnessNote}` : ''}`);
    }
    if (spiritualFlag) {
      const answer = spiritualFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`6. Was I spiritually connected today? ${answer}${spiritualFlag === 'yes' && spiritualNote ? ` - ${spiritualNote}` : ''}`);
    }
    if (aaTalkFlag) {
      const answer = aaTalkFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`7. Did I talk to someone in recovery today? ${answer}`);
    }
    if (prayerMeditationFlag) {
      const answer = prayerMeditationFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`8. Did I pray or meditate today? ${answer}`);
    }

    let shareMessage = `${today}\n\nEvening Review\n\n`;
    
    if (answeredQuestions.length > 0) {
      shareMessage += answeredQuestions.join('\n\n') + '\n\n';
    } else {
      shareMessage += 'Starting my nightly review...\n\n';
    }
    
    shareMessage += 'Working my program one day at a time.';

    try {
      console.log('Attempting to share:', Platform.OS);
      
      if (Platform.OS === 'web') {
        // For web, copy to clipboard since Share API doesn't work in iframes
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Your nightly review has been copied to the clipboard. You can now paste it in any messaging app or text field.',
          [{ text: 'OK' }]
        );
      } else {
        // For mobile, use native Share API
        const result = await Share.share({
          message: shareMessage,
          title: 'My Nightly Review'
        });
        console.log('Share result:', result);
      }
    } catch (error) {
      console.error('Error sharing nightly review:', error);
      
      // Fallback to clipboard for any platform if sharing fails
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Sharing failed, but your nightly review has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
        Alert.alert(
          'Share Error',
          'Unable to share your nightly review. Please try again.',
          [{ text: 'OK' }]
        );
      }
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
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nightly Review</Text>
          <Text style={styles.description}>
            Nightly inventory based on AA guidance
          </Text>
        </View>

        {/* Questions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{formatDateDisplay(today)}</Text>
          
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
                  <View>
                    <TextInput
                      style={styles.textInput}
                      placeholder={question.placeholder}
                      value={question.note}
                      onChangeText={question.setNote}
                      multiline
                      placeholderTextColor={Colors.light.muted}
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onFocus={() => {
                        // Scroll to make input visible above keyboard
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                      }}
                    />
                  </View>
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
          <Share2 size={20} color="white" />
          <Text style={styles.shareButtonText}>
            Share Nightly Review
          </Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <Text style={styles.privacyText}>
          Your responses are saved only on your device. Nothing is uploaded or shared.
        </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
    marginLeft: 8,
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
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
  },
  privacyText: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 150 : 100, // Extra padding at bottom for keyboard
  },
});
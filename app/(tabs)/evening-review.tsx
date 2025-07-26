import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import ScreenContainer from "@/components/ScreenContainer";
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
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

export default function EveningReview() {
  const { isCompletedToday, completeToday, uncompleteToday, getWeeklyProgress, getWeeklyStreak, saveEntry, entries } = useEveningReviewStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  
  // Form state
  const [emotionFlag, setEmotionFlag] = useState(false);
  const [emotionNote, setEmotionNote] = useState('');
  const [apologyFlag, setApologyFlag] = useState(false);
  const [apologyName, setApologyName] = useState('');
  const [kindnessFlag, setKindnessFlag] = useState(false);
  const [kindnessNote, setKindnessNote] = useState('');
  const [spiritualFlag, setSpiritualFlag] = useState(false);
  const [spiritualNote, setSpiritualNote] = useState('');
  const [aaTalkFlag, setAaTalkFlag] = useState(false);
  const [prayerFlag, setPrayerFlag] = useState(false);

  const today = new Date();
  const isCompleted = isCompletedToday();
  const weeklyProgress = getWeeklyProgress();
  const weeklyStreak = getWeeklyStreak();

  const questions = [
    {
      text: '1. Was I resentful, selfish, dishonest, or afraid today?',
      flag: emotionFlag,
      setFlag: setEmotionFlag,
      note: emotionNote,
      setNote: setEmotionNote,
      placeholder: 'How so?'
    },
    {
      text: '2. Do I owe anyone an apology?',
      flag: apologyFlag,
      setFlag: setApologyFlag,
      note: apologyName,
      setNote: setApologyName,
      placeholder: 'Whom have you harmed?'
    },
    {
      text: '3. Was I of service or kind to others today?',
      flag: kindnessFlag,
      setFlag: setKindnessFlag,
      note: kindnessNote,
      setNote: setKindnessNote,
      placeholder: 'What did you do?'
    },
    {
      text: '4. Was I spiritually connected today?',
      flag: spiritualFlag,
      setFlag: setSpiritualFlag,
      note: spiritualNote,
      setNote: setSpiritualNote,
      placeholder: 'In what way?'
    },
    {
      text: '5. Talked with another alcoholic today?',
      flag: aaTalkFlag,
      setFlag: setAaTalkFlag,
      note: '',
      setNote: () => {},
      placeholder: ''
    },
    {
      text: '6. Did I pray and meditate today?',
      flag: prayerFlag,
      setFlag: setPrayerFlag,
      note: '',
      setNote: () => {},
      placeholder: ''
    }
  ];

  const [showAlert, setShowAlert] = useState(false);

  const handleComplete = () => {
    setShowAlert(true);
  };

  const handleConfirmSubmit = () => {
    const entry = {
      emotionFlag,
      emotionNote,
      apologyFlag,
      apologyName,
      kindnessFlag,
      kindnessNote,
      spiritualFlag,
      spiritualNote,
      aaTalkFlag,
      prayerFlag
    };
    
    saveEntry(entry);
    completeToday();
    setShowConfirmation(true);
    setShowAlert(false);
  };

  const handleStartNew = () => {
    setEmotionFlag(false);
    setEmotionNote('');
    setApologyFlag(false);
    setApologyName('');
    setKindnessFlag(false);
    setKindnessNote('');
    setSpiritualFlag(false);
    setSpiritualNote('');
    setAaTalkFlag(false);
    setPrayerFlag(false);
    setShowConfirmation(false);
  };

  const handleUnsubmit = () => {
    uncompleteToday();
    handleStartNew();
  };

  const insights = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff && entry.completed;
    });

    const counts = {
      emotion: 0,
      amends: 0,
      kindness: 0,
      spiritual: 0,
      aaTalk: 0,
      prayer: 0
    };

    const notes = {
      emotion: [] as string[],
      kindness: [] as string[],
      spiritual: [] as string[]
    };

    recentEntries.forEach(entry => {
      if (entry.answers?.emotion) counts.emotion++;
      if (entry.answers?.apology) counts.amends++;
      if (entry.answers?.kindness) counts.kindness++;
      if (entry.answers?.spiritual) counts.spiritual++;
      if (entry.answers?.aaTalk) counts.aaTalk++;
      if (entry.answers?.prayer) counts.prayer++;

      if (entry.reflection) {
        try {
          const reflectionData = JSON.parse(entry.reflection);
          if (reflectionData.emotionNote) notes.emotion.push(reflectionData.emotionNote);
          if (reflectionData.kindnessNote) notes.kindness.push(reflectionData.kindnessNote);
          if (reflectionData.spiritualNote) notes.spiritual.push(reflectionData.spiritualNote);
        } catch (e) {
          // Handle old format or invalid JSON
        }
      }
    });

    return { counts, notes, totalDays: recentEntries.length };
  }, [entries]);

  if (showConfirmation || isCompleted) {
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
                    day.completed && !day.isFuture && styles.dayCircleCompleted,
                    day.isToday && styles.dayCircleToday,
                    day.isFuture && styles.dayCircleFuture
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

          {/* Collapsible Insights */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.insightsHeader} 
              onPress={() => setShowInsights(!showInsights)}
            >
              <Text style={styles.insightsTitle}>Insights from the past 30 days</Text>
              {showInsights ? (
                <ChevronUp color={Colors.light.tint} size={20} />
              ) : (
                <ChevronDown color={Colors.light.tint} size={20} />
              )}
            </TouchableOpacity>
            
            {showInsights && (
              <View style={styles.insightsContent}>
                {insights.totalDays > 0 ? (
                  <>
                    <Text style={styles.insightsSubtitle}>
                      Based on {insights.totalDays} completed {insights.totalDays === 1 ? 'review' : 'reviews'}
                    </Text>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• Emotional Struggles: {insights.counts.emotion} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.emotion / insights.totalDays) * 100)}% of days</Text>
                    </View>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• Amends Needed: {insights.counts.amends} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.amends / insights.totalDays) * 100)}% of days</Text>
                    </View>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• Acts of Service: {insights.counts.kindness} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.kindness / insights.totalDays) * 100)}% of days</Text>
                    </View>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• Spiritual Connection: {insights.counts.spiritual} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.spiritual / insights.totalDays) * 100)}% of days</Text>
                    </View>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• AA Fellowship: {insights.counts.aaTalk} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.aaTalk / insights.totalDays) * 100)}% of days</Text>
                    </View>
                    
                    <View style={styles.insightItem}>
                      <Text style={styles.insightLabel}>• Prayer & Meditation: {insights.counts.prayer} out of {insights.totalDays} days</Text>
                      <Text style={styles.insightPercentage}>{Math.round((insights.counts.prayer / insights.totalDays) * 100)}% of days</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.insightsSubtitle}>
                    Complete a few reviews to see your patterns and insights.
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {!isCompleted && (
              <TouchableOpacity style={styles.outlineButton} onPress={handleStartNew}>
                <Text style={styles.outlineButtonText}>Start New Review</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.unsubmitButton} onPress={handleUnsubmit}>
              <Text style={styles.unsubmitButtonText}>Unsubmit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={[Colors.light.chatBubbleUser, Colors.light.chatBubbleBot]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Confirmation Dialog */}
      <Modal
        visible={showAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>Complete Your Daily Inventory?</Text>
            <Text style={styles.alertDescription}>
              Your evening review will be saved and cannot be modified. Are you ready to complete today&apos;s inventory?
            </Text>
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity 
                style={styles.alertCancelButton} 
                onPress={() => setShowAlert(false)}
              >
                <Text style={styles.alertCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.alertConfirmButton} 
                onPress={handleConfirmSubmit}
              >
                <Text style={styles.alertConfirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
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
                <Text style={styles.questionText}>{question.text}</Text>
                <View style={styles.answerButtons}>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      question.flag === true && styles.answerButtonSelected
                    ]}
                    onPress={() => question.setFlag(true)}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      question.flag === true && styles.answerButtonTextSelected
                    ]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.answerButton,
                      question.flag === false && styles.answerButtonSelected
                    ]}
                    onPress={() => question.setFlag(false)}
                  >
                    <Text style={[
                      styles.answerButtonText,
                      question.flag === false && styles.answerButtonTextSelected
                    ]}>No</Text>
                  </TouchableOpacity>
                </View>
                
                {question.flag && question.placeholder && (
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

        {/* Complete Button */}
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete Review</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  alertDescription: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  alertButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  alertCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCancelButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: adjustFontWeight('500'),
  },
  alertConfirmButton: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
  },
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
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
  },
  insightsContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  insightsSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 16,
    textAlign: 'center',
  },
  insightPercentage: {
    fontSize: 12,
    color: Colors.light.tint,
    fontWeight: adjustFontWeight('600'),
    marginLeft: 12,
  },
  insightItem: {
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    fontWeight: adjustFontWeight('500'),
    color: Colors.light.text,
    marginBottom: 4,
  },
  insightNotes: {
    fontSize: 12,
    color: Colors.light.muted,
    fontStyle: 'italic',
    marginLeft: 12,
  },
  placeholderNote: {
    fontSize: 12,
    color: '#dc3545',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
});
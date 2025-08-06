import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Share
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Calendar, Share as ShareIcon, Trash2, X, Edit3 } from 'lucide-react-native';
import { useEveningReviewStore } from '@/hooks/use-evening-review-store';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';

interface SavedEveningReviewsProps {
  visible: boolean;
  onClose: () => void;
  onEditReview?: (entry: any) => void;
}

const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export default function SavedEveningReviews({ visible, onClose, onEditReview }: SavedEveningReviewsProps) {
  const { savedEntries, deleteSavedEntry } = useEveningReviewStore();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  // Debug logging
  console.log('SavedEveningReviews - Total saved entries:', savedEntries.length);
  console.log('SavedEveningReviews - Entries:', savedEntries.map(e => ({ date: e.date, timestamp: e.timestamp })));
  
  // Check for today's entry specifically
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const todayString = getTodayDateString();
  const todayEntry = savedEntries.find(entry => entry.date === todayString);
  console.log('SavedEveningReviews - Today\'s date string:', todayString);
  console.log('SavedEveningReviews - Today\'s entry exists:', !!todayEntry);
  if (todayEntry) {
    console.log('SavedEveningReviews - Today\'s entry:', { date: todayEntry.date, timestamp: todayEntry.timestamp });
  }

  const handleEntryPress = (entry: any) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  const handleDeleteEntry = (dateString: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this evening review entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSavedEntry(dateString)
        }
      ]
    );
  };

  const handleShareEntry = async (entry: any) => {
    const { date, data } = entry;
    const formattedDate = formatDateDisplay(date);

    const answeredQuestions = [];
    
    if (data.resentfulFlag) {
      const answer = data.resentfulFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`1. Was I resentful today? ${answer}${data.resentfulFlag === 'yes' && data.resentfulNote ? ` - ${data.resentfulNote}` : ''}`);
    }
    if (data.selfishFlag) {
      const answer = data.selfishFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`2. Was I selfish and self-centered today? ${answer}${data.selfishFlag === 'yes' && data.selfishNote ? ` - ${data.selfishNote}` : ''}`);
    }
    if (data.fearfulFlag) {
      const answer = data.fearfulFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`3. Was I fearful or worrisome today? ${answer}${data.fearfulFlag === 'yes' && data.fearfulNote ? ` - ${data.fearfulNote}` : ''}`);
    }
    if (data.apologyFlag) {
      const answer = data.apologyFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`4. Do I owe anyone an apology? ${answer}${data.apologyFlag === 'yes' && data.apologyName ? ` - ${data.apologyName}` : ''}`);
    }
    if (data.kindnessFlag) {
      const answer = data.kindnessFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`5. Was I of service or kind to others today? ${answer}${data.kindnessFlag === 'yes' && data.kindnessNote ? ` - ${data.kindnessNote}` : ''}`);
    }
    if (data.prayerMeditationFlag) {
      const answer = data.prayerMeditationFlag === 'yes' ? 'Yes' : 'No';
      answeredQuestions.push(`6. Did I pray or meditate today? ${answer}`);
    }
    if (data.spiritualNote) {
      answeredQuestions.push(`7. How was my spiritual condition today? ${data.spiritualNote}`);
    }

    let shareMessage = `${formattedDate}\n\nEvening Review\n\n`;
    
    if (answeredQuestions.length > 0) {
      shareMessage += answeredQuestions.join('\n\n') + '\n\n';
    }
    
    shareMessage += 'Working my program one day at a time.';

    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Your evening review has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } else {
        await Share.share({
          message: shareMessage,
          title: 'My Evening Review'
        });
      }
    } catch (error) {
      console.error('Error sharing evening review:', error);
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Sharing failed, but your evening review has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } catch (clipboardError) {
        Alert.alert(
          'Share Error',
          'Unable to share your evening review. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const renderEntryDetail = () => {
    if (!selectedEntry) return null;

    const { date, data } = selectedEntry;
    const questions = [
      {
        text: '1. Was I resentful today?',
        flag: data.resentfulFlag,
        note: data.resentfulNote,
      },
      {
        text: '2. Was I selfish and self-centered today?',
        flag: data.selfishFlag,
        note: data.selfishNote,
      },
      {
        text: '3. Was I fearful or worrisome today?',
        flag: data.fearfulFlag,
        note: data.fearfulNote,
      },
      {
        text: '4. Do I owe anyone an apology?',
        flag: data.apologyFlag,
        note: data.apologyName,
      },
      {
        text: '5. Was I loving and kind to others today?',
        flag: data.kindnessFlag,
        note: data.kindnessNote,
      },
      {
        text: '6. Did I pray or meditate today?',
        flag: data.prayerMeditationFlag,
        note: '',
      },
      {
        text: '7. How was my spiritual condition today?',
        flag: data.spiritualFlag,
        note: data.spiritualNote,
        inputOnly: true
      }
    ];

    return (
      <Modal
        visible={showEntryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEntryModal(false)}
            >
              <X color={Colors.light.text} size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Evening Review</Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShareEntry(selectedEntry)}
            >
              <ShareIcon color={Colors.light.tint} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.entryDate}>{formatDateDisplay(date)}</Text>
            
            <View style={styles.questionsContainer}>
              {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{question.text}</Text>
                  {question.inputOnly ? (
                    question.note ? (
                      <Text style={styles.answerText}>{question.note}</Text>
                    ) : (
                      <Text style={styles.noAnswerText}>No response</Text>
                    )
                  ) : (
                    <>
                      {question.flag ? (
                        <Text style={[
                          styles.answerText,
                          question.flag === 'yes' ? styles.yesAnswer : styles.noAnswer
                        ]}>
                          {question.flag === 'yes' ? 'Yes' : 'No'}
                        </Text>
                      ) : (
                        <Text style={styles.noAnswerText}>No response</Text>
                      )}
                      {question.flag === 'yes' && question.note && (
                        <Text style={styles.noteText}>{question.note}</Text>
                      )}
                    </>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // Log when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      console.log('SavedEveningReviews modal opened - Current entries:', savedEntries.length);
      console.log('SavedEveningReviews modal opened - Entry dates:', savedEntries.map(e => e.date));
    }
  }, [visible, savedEntries]);

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={Colors.light.text} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Saved Reviews</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content}>
            {savedEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar color={Colors.light.muted} size={48} />
                <Text style={styles.emptyTitle}>No Saved Reviews</Text>
                <Text style={styles.emptyDescription}>
                  Your saved evening reviews will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.entriesList}>
                {savedEntries.map((entry) => (
                  <TouchableOpacity
                    key={entry.date}
                    style={styles.entryCard}
                    onPress={() => handleEntryPress(entry)}
                  >
                    <View style={styles.entryHeader}>
                      <View>
                        <Text style={styles.entryDateText}>
                          {formatDateShort(entry.date)}
                        </Text>
                        <Text style={styles.entryFullDate}>
                          {formatDateDisplay(entry.date)}
                        </Text>
                      </View>
                      <View style={styles.entryActions}>
                        {onEditReview && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                              onEditReview(entry);
                              onClose();
                            }}
                          >
                            <Edit3 color={Colors.light.tint} size={18} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteEntry(entry.date)}
                        >
                          <Trash2 color={Colors.light.muted} size={18} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.entryPreview}>
                      <Text style={styles.previewText}>
                        Tap to view full review and share
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
      {renderEntryDetail()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  entriesList: {
    paddingVertical: 16,
  },
  entryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryDateText: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
  },
  entryFullDate: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 2,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  entryPreview: {
    marginTop: 8,
  },
  previewText: {
    fontSize: 14,
    color: Colors.light.muted,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
  },
  shareButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  entryDate: {
    fontSize: 20,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
    textAlign: 'center',
    marginBottom: 24,
  },
  questionsContainer: {
    gap: 16,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  questionText: {
    fontSize: 16,
    fontWeight: adjustFontWeight('500'),
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  answerText: {
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
    marginBottom: 4,
  },
  yesAnswer: {
    color: '#dc3545',
  },
  noAnswer: {
    color: Colors.light.tint,
  },
  noAnswerText: {
    fontSize: 14,
    color: Colors.light.muted,
    fontStyle: 'italic',
  },
  noteText: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.border,
  },
});
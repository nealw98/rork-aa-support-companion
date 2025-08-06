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
import { Heart, Share as ShareIcon, Trash2, X } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/use-gratitude-store';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';

interface SavedGratitudeListsProps {
  visible: boolean;
  onClose: () => void;
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

export default function SavedGratitudeLists({ visible, onClose }: SavedGratitudeListsProps) {
  const { savedEntries, deleteSavedEntry } = useGratitudeStore();
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  const handleEntryPress = (entry: any) => {
    setSelectedEntry(entry);
    setShowEntryModal(true);
  };

  const handleDeleteEntry = (dateString: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this gratitude list?',
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
    const { date, items } = entry;
    const formattedDate = formatDateDisplay(date);

    const gratitudeText = items
      .map((item: string) => `• ${item}`)
      .join('\n');

    const shareMessage = `${formattedDate}\n\nToday I'm grateful for:\n${gratitudeText}`;

    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Your gratitude list has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } else {
        await Share.share({
          message: shareMessage,
          title: 'My Gratitude List'
        });
      }
    } catch (error) {
      console.error('Error sharing gratitude list:', error);
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Sharing failed, but your gratitude list has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } catch (clipboardError) {
        Alert.alert(
          'Share Error',
          'Unable to share your gratitude list. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const renderEntryDetail = () => {
    if (!selectedEntry) return null;

    const { date, items } = selectedEntry;

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
            <Text style={styles.modalTitle}>Gratitude List</Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShareEntry(selectedEntry)}
            >
              <ShareIcon color={Colors.light.tint} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.entryDate}>{formatDateDisplay(date)}</Text>
            
            <View style={styles.gratitudeContainer}>
              <Text style={styles.gratitudeTitle}>Today I'm grateful for:</Text>
              {items.map((item: string, index: number) => (
                <View key={index} style={styles.gratitudeItem}>
                  <Text style={styles.gratitudeItemText}>• {item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

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
            <Text style={styles.title}>Saved Gratitude Lists</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content}>
            {savedEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Heart color={Colors.light.muted} size={48} />
                <Text style={styles.emptyTitle}>No Saved Lists</Text>
                <Text style={styles.emptyDescription}>
                  Your saved gratitude lists will appear here.
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
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteEntry(entry.date)}
                      >
                        <Trash2 color={Colors.light.muted} size={20} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.entryPreview}>
                      <Text style={styles.previewText}>
                        {entry.items.length} {entry.items.length === 1 ? 'item' : 'items'} • Tap to view and share
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
  deleteButton: {
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
  gratitudeContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  gratitudeTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 16,
  },
  gratitudeItem: {
    marginBottom: 12,
  },
  gratitudeItemText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22,
  },
});
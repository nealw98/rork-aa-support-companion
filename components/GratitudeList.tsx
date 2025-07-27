import React, { useState, useEffect } from 'react';
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
import { CheckCircle, Plus, X } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/use-gratitude-store';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import { formatDateDisplay } from '@/lib/dateUtils';

export default function GratitudeList() {
  const { isCompletedToday, getTodayEntry, saveGratitudeList, uncompleteToday } = useGratitudeStore();
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', '']);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const today = new Date();
  const isCompleted = isCompletedToday();

  useEffect(() => {
    const todayEntry = getTodayEntry();
    if (todayEntry && todayEntry.items.length > 0) {
      const items = [...todayEntry.items];
      while (items.length < 3) {
        items.push('');
      }
      setGratitudeItems(items);
    }
  }, []);

  const handleComplete = () => {
    const filledItems = gratitudeItems.filter(item => item.trim() !== '');
    if (filledItems.length === 0) {
      return;
    }
    setShowAlert(true);
  };

  const handleConfirmSubmit = () => {
    saveGratitudeList(gratitudeItems);
    setShowConfirmation(true);
    setShowAlert(false);
  };

  const handleStartNew = () => {
    setGratitudeItems(['', '', '']);
    setShowConfirmation(false);
  };

  const handleUnsubmit = () => {
    uncompleteToday();
    handleStartNew();
  };

  const addGratitudeItem = () => {
    setGratitudeItems([...gratitudeItems, '']);
  };

  const removeGratitudeItem = (index: number) => {
    if (gratitudeItems.length > 1) {
      const newItems = gratitudeItems.filter((_, i) => i !== index);
      setGratitudeItems(newItems);
    }
  };

  const updateGratitudeItem = (index: number, value: string) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };

  const filledItemsCount = gratitudeItems.filter(item => item.trim() !== '').length;

  if (showConfirmation || isCompleted) {
    const todayEntry = getTodayEntry();
    const completedItems = todayEntry?.items || [];

    return (
      <ScreenContainer style={styles.container}>
        <LinearGradient
          colors={[Colors.light.chatBubbleUser, Colors.light.chatBubbleBot]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Gratitude Complete</Text>
            <Text style={styles.subtitle}>{formatDateDisplay(today)}</Text>
            <Text style={styles.description}>
              Gratitude transforms what we have into enough
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.confirmationText}>
              Thank you for taking time to reflect on gratitude. These moments of appreciation strengthen your recovery.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Gratitude</Text>
            {completedItems.map((item, index) => (
              <View key={index} style={styles.gratitudeItemDisplay}>
                <CheckCircle color={Colors.light.tint} size={16} />
                <Text style={styles.gratitudeItemText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.privacyText}>
            Your gratitude list is saved only on your device. Nothing is uploaded or shared.
          </Text>

          <View style={styles.buttonContainer}>
            {!isCompleted && (
              <TouchableOpacity style={styles.outlineButton} onPress={handleStartNew}>
                <Text style={styles.outlineButtonText}>Start New List</Text>
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
      
      <Modal
        visible={showAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>Save Your Gratitude List?</Text>
            <Text style={styles.alertDescription}>
              Your gratitude list will be saved and cannot be modified. You have {filledItemsCount} item{filledItemsCount !== 1 ? 's' : ''} listed.
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
        <View style={styles.header}>
          <Text style={styles.title}>Gratitude List</Text>
          <Text style={styles.description}>
            List what you're grateful for today. Research shows gratitude improves mental health and strengthens recovery.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{formatDateDisplay(today)}</Text>
          
          <View style={styles.gratitudeContainer}>
            {gratitudeItems.map((item, index) => (
              <View key={index} style={styles.gratitudeItemContainer}>
                <View style={styles.gratitudeInputRow}>
                  <Text style={styles.gratitudeNumber}>{index + 1}.</Text>
                  <TextInput
                    style={styles.gratitudeInput}
                    placeholder="What are you grateful for?"
                    value={item}
                    onChangeText={(value) => updateGratitudeItem(index, value)}
                    multiline
                    placeholderTextColor={Colors.light.muted}
                  />
                  {gratitudeItems.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeGratitudeItem(index)}
                    >
                      <X color={Colors.light.muted} size={20} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addButton} onPress={addGratitudeItem}>
              <Plus color={Colors.light.tint} size={20} />
              <Text style={styles.addButtonText}>Add another item</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.completeButton,
            filledItemsCount === 0 && styles.completeButtonDisabled
          ]} 
          onPress={handleComplete}
          disabled={filledItemsCount === 0}
        >
          <Text style={[
            styles.completeButtonText,
            filledItemsCount === 0 && styles.completeButtonTextDisabled
          ]}>
            Save Gratitude List
          </Text>
        </TouchableOpacity>

        <Text style={styles.privacyText}>
          Your gratitude list is saved only on your device. Nothing is uploaded or shared.
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
  cardTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.tint,
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  gratitudeContainer: {
    marginTop: 8,
  },
  gratitudeItemContainer: {
    marginBottom: 16,
  },
  gratitudeInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  gratitudeNumber: {
    fontSize: 16,
    fontWeight: adjustFontWeight('500'),
    color: Colors.light.tint,
    marginTop: 12,
    minWidth: 20,
  },
  gratitudeInput: {
    flex: 1,
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
  removeButton: {
    padding: 8,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: adjustFontWeight('500'),
  },
  gratitudeItemDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  gratitudeItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  completeButtonDisabled: {
    backgroundColor: Colors.light.muted,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
  },
  completeButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
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
});
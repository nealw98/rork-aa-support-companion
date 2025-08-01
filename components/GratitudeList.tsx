import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ScreenContainer from "@/components/ScreenContainer";
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Plus } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/use-gratitude-store';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';
import { formatDateDisplay } from '@/lib/dateUtils';

export default function GratitudeList() {
  const {
    getTodaysItems,
    addItemsToToday,
    resetIfNewDay
  } = useGratitudeStore();

  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const checkMidnightReset = () => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        resetIfNewDay();
        setCurrentDate(now);
        setGratitudeItems([]);
      }
    };

    const interval = setInterval(checkMidnightReset, 60000); // Check every minute
    const todaysItems = getTodaysItems();
    setGratitudeItems(todaysItems);

    return () => clearInterval(interval);
  }, [getTodaysItems, resetIfNewDay, currentDate]);

  const handleAddGratitude = () => {
    if (inputValue.trim()) {
      const newItems = [...gratitudeItems, inputValue.trim()];
      setGratitudeItems(newItems);
      addItemsToToday([inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleAddGratitude();
    }
  };



  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={['#E0F7FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      

      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Heart color={Colors.light.tint} size={32} />
          <Text style={styles.title}>Gratitude List</Text>
          <Text style={styles.dateText}>{formatDateDisplay(currentDate)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today I&apos;m grateful for:</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              onKeyPress={handleKeyPress}
              placeholder="e.g., My sobriety"
              style={styles.textInput}
              placeholderTextColor="#6c757d"
            />
            <TouchableOpacity 
              onPress={handleAddGratitude}
              disabled={!inputValue.trim()}
              style={[
                styles.addButton,
                !inputValue.trim() && styles.addButtonDisabled
              ]}
            >
              <Plus color={!inputValue.trim() ? '#6c757d' : 'white'} size={16} />
              <Text style={[
                styles.addButtonText,
                !inputValue.trim() && styles.addButtonTextDisabled
              ]}>Add</Text>
            </TouchableOpacity>
          </View>

          {gratitudeItems.length > 0 && (
            <View style={styles.itemsList}>
              {gratitudeItems.map((item, index) => (
                <View key={index} style={styles.gratitudeItem}>
                  <Text style={styles.gratitudeItemText}>{item}</Text>
                </View>
              ))}
            </View>
          )}


        </View>

        <Text style={styles.privacyText}>
          Your gratitude list is stored locally on your device for privacy.
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
    color: '#6c757d',
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
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    color: Colors.light.text,
    minHeight: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: adjustFontWeight('500'),
  },
  addButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemsList: {
    marginBottom: 16,
  },
  gratitudeItem: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
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
    color: '#6c757d',
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
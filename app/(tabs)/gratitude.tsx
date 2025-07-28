import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Plus, Trash2, CheckCircle, Heart } from 'lucide-react-native';
import { useGratitudeStore } from '@/hooks/useGratitudeStore';
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
  inputSection: {
    padding: 20,
    backgroundColor: Colors.light.background
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.divider,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background,
    color: Colors.light.text
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContainer: {
    flex: 1,
    padding: 20
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text
  },
  counter: {
    fontSize: 14,
    color: Colors.light.muted,
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  gratitudeItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  gratitudeText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 16
  },
  completeButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  completeButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.6
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  buttonContainer: {
    padding: 20,
    gap: 12
  },
  addMoreButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  addMoreButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
  }
});

export default function GratitudeListScreen() {
  const {
    getTodaysItems,
    isCompletedToday,
    addItemsToToday,
    completeToday,
    uncompleteToday
  } = useGratitudeStore();
  
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  
  useEffect(() => {
    const todaysItems = getTodaysItems();
    setGratitudeItems(todaysItems);
  }, [getTodaysItems]);

  const handleAddEntry = () => {
    if (inputText.trim()) {
      const newItems = [...gratitudeItems, inputText.trim()];
      setGratitudeItems(newItems);
      addItemsToToday([inputText.trim()]);
      setInputText('');
    }
  };

  const handleDeleteEntry = (index: number) => {
    Alert.alert(
      'Delete Gratitude',
      'Are you sure you want to delete this gratitude entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            const updatedItems = gratitudeItems.filter((_, i) => i !== index);
            setGratitudeItems(updatedItems);
            addItemsToToday(updatedItems);
          }
        }
      ]
    );
  };

  const handleComplete = () => {
    if (gratitudeItems.length === 0) {
      Alert.alert(
        'Complete Gratitude List',
        'Please add at least one gratitude item before completing.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Complete Today\'s Gratitude List?',
      'Mark today\'s gratitude practice as complete and view your weekly insights and progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save & Continue',
          onPress: () => {
            completeToday(gratitudeItems);
            // Add delay to ensure data is saved before navigation
            setTimeout(() => {
              router.push('/insights');
            }, 100);
          }
        }
      ]
    );
  };
  
  const handleAddMore = () => {
    uncompleteToday();
    // Refresh the items after uncompleting
    const todaysItems = getTodaysItems();
    setGratitudeItems(todaysItems);
  };

  const renderGratitudeItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.gratitudeItem}>
      <Text style={styles.gratitudeText}>{item}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEntry(index)}
      >
        <Trash2 size={20} color={Colors.light.muted} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Daily Gratitude' }} />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Heart size={24} color={Colors.light.tint} />
            <Text style={styles.title}>Gratitude List</Text>
          </View>
          <Text style={styles.subtitle}>
            Today I&apos;m grateful for:
          </Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="I&apos;m grateful for..."
              placeholderTextColor={Colors.light.muted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleAddEntry}
              returnKeyType="done"
              multiline
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddEntry}
              disabled={!inputText.trim()}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listContainer}>
          {gratitudeItems.length > 0 && (
            <FlatList
              data={gratitudeItems}
              renderItem={renderGratitudeItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {isCompletedToday() ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => router.push('/insights')}
            >
              <CheckCircle size={20} color="white" />
              <Text style={styles.completeButtonText}>View Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={handleAddMore}
            >
              <Plus size={20} color={Colors.light.tint} />
              <Text style={styles.addMoreButtonText}>Add More</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.completeButton,
              gratitudeItems.length === 0 && styles.completeButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={gratitudeItems.length === 0}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
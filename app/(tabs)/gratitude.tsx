import React, { useState } from 'react';
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
import { Plus, Trash2, CheckCircle } from 'lucide-react-native';
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
  }
});

export default function GratitudeListScreen() {
  const { todayEntries, addEntry, removeEntry, canComplete, hasCompletedToday } = useGratitudeStore();
  const [inputText, setInputText] = useState('');

  const handleAddEntry = () => {
    if (inputText.trim()) {
      addEntry(inputText);
      setInputText('');
    }
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(
      'Delete Gratitude',
      'Are you sure you want to delete this gratitude entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeEntry(id) }
      ]
    );
  };

  const handleComplete = () => {
    if (hasCompletedToday()) {
      router.push('/insights');
    } else {
      Alert.alert(
        'Complete Gratitude List',
        'Add at least 3 gratitude items to complete your daily practice.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderGratitudeItem = ({ item }: { item: any }) => (
    <View style={styles.gratitudeItem}>
      <Text style={styles.gratitudeText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEntry(item.id)}
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
          <Text style={styles.title}>Daily Gratitude</Text>
          <Text style={styles.subtitle}>
            List at least 3 things you&apos;re grateful for today. Gratitude is the foundation of a positive mindset in recovery.
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
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Today&apos;s Gratitude</Text>
            <Text style={styles.counter}>{todayEntries.length} items</Text>
          </View>

          {todayEntries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CheckCircle size={48} color={Colors.light.muted} />
              <Text style={styles.emptyText}>
                Start by adding something you&apos;re grateful for today.
              </Text>
            </View>
          ) : (
            <FlatList
              data={todayEntries}
              renderItem={renderGratitudeItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            !canComplete() && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={!canComplete()}
        >
          <CheckCircle size={20} color="white" />
          <Text style={styles.completeButtonText}>
            {hasCompletedToday() ? 'View Insights' : `Complete (${todayEntries.length}/3)`}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
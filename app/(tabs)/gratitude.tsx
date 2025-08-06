import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Stack } from 'expo-router';
import { Heart, Share as ShareIcon, Save, Archive, Calendar, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGratitudeStore } from '@/hooks/use-gratitude-store';
import SavedGratitudeLists from '@/components/SavedGratitudeLists';
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
  title: {
    fontSize: 24,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true),
    color: Colors.light.text,
    marginBottom: 16
  },
  inputSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  gratitudeText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22
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

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  quoteSubtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'left',
    marginBottom: 8
  },
  mainButtonContainer: {
    padding: 20,
    gap: 12
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    height: 48,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true),
  },
  shareButton: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    height: 48,
  },
  shareButtonDisabled: {
    backgroundColor: Colors.light.muted,
    opacity: 0.6
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: adjustFontWeight('600', true)
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    height: 48,
  },
  secondaryButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: adjustFontWeight('500'),
  },
  
  // Completion screen styles
  completionContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  completionHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: adjustFontWeight('700', true),
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: Colors.light.tint,
    marginBottom: 8,
    textAlign: 'center',
  },
  completionDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  completionCard: {
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
    backgroundColor: Colors.light.tint,
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
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
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

});

export default function GratitudeListScreen() {
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const gratitudeStore = useGratitudeStore();
  console.log('GratitudeListScreen - store:', gratitudeStore);
  
  useEffect(() => {
    if (gratitudeStore?.getTodaysItems) {
      const todaysItems = gratitudeStore.getTodaysItems();
      setGratitudeItems(todaysItems);
    }
  }, [gratitudeStore]);
  
  if (!gratitudeStore) {
    console.error('GratitudeStore is undefined!');
    return (
      <ScreenContainer>
        <Text>Loading...</Text>
      </ScreenContainer>
    );
  }
  
  const {
    getTodaysItems,
    addItemsToToday,
    saveGratitudeEntry,
    getCompletedDaysInLast30
  } = gratitudeStore;

  const handleAddGratitude = () => {
    if (inputValue.trim()) {
      const newItems = [...gratitudeItems, inputValue.trim()];
      setGratitudeItems(newItems);
      addItemsToToday([inputValue.trim()]);
      setInputValue('');
      inputRef.current?.blur();
    }
  };

  const handleSaveEntry = () => {
    console.log('Save button pressed, items:', gratitudeItems.length);
    
    if (gratitudeItems.length === 0) {
      Alert.alert(
        'Save Gratitude List',
        'Please add at least one gratitude item before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    saveGratitudeEntry(gratitudeItems);
    setShowSavedLists(false);
    
    // Navigate to completion screen by setting a completion state
    setShowCompletion(true);
  };

  const canSave = () => {
    return gratitudeItems.length > 0;
  };





  const handleShare = async () => {
    console.log('Share button pressed, items:', gratitudeItems.length);
    
    if (gratitudeItems.length === 0) {
      Alert.alert(
        'Share Gratitude List',
        'Please add at least one gratitude item before sharing.',
        [{ text: 'OK' }]
      );
      return;
    }

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const gratitudeText = gratitudeItems
      .map((item) => `• ${item}`)
      .join('\n');

    const shareMessage = `${today}\n\nToday I&apos;m grateful for:\n${gratitudeText}`;

    try {
      console.log('Attempting to share:', Platform.OS);
      
      if (Platform.OS === 'web') {
        // For web, copy to clipboard since Share API doesn't work in iframes
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Your gratitude list has been copied to the clipboard. You can now paste it in any messaging app or text field.',
          [{ text: 'OK' }]
        );
      } else {
        // For mobile, use native Share API
        const result = await Share.share({
          message: shareMessage,
          title: 'My Daily Gratitude List'
        });
        console.log('Share result:', result);
      }
    } catch (error) {
      console.error('Error sharing gratitude list:', error);
      
      // Fallback to clipboard for any platform if sharing fails
      try {
        await Clipboard.setStringAsync(shareMessage);
        Alert.alert(
          'Copied to Clipboard',
          'Sharing failed, but your gratitude list has been copied to the clipboard.',
          [{ text: 'OK' }]
        );
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
        Alert.alert(
          'Share Error',
          'Unable to share your gratitude list. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };


  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      handleAddGratitude();
    }
  };

  const renderGratitudeItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.gratitudeItem}>
      <Text style={styles.gratitudeText}>{item}</Text>
    </View>
  );

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        date: day.toISOString().split('T')[0],
        completed: false // For now, we'll show basic progress
      });
    }
    return weekDays;
  };

  const handleEditGratitude = () => {
    setShowCompletion(false);
  };

  if (showCompletion) {
    const today = new Date();
    const weeklyProgress = getWeeklyProgress();
    const completedDays = getCompletedDaysInLast30();
    
    return (
      <ScreenContainer noPadding>
        <Stack.Screen options={{ title: 'Gratitude Complete' }} />
        
        <View style={styles.container}>
          <LinearGradient
            colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
          />
          
          <ScrollView style={styles.completionContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Gratitude Complete</Text>
              <Text style={styles.completionSubtitle}>{formatDateDisplay(today)}</Text>
              <Text style={styles.completionDescription}>
                Gratitude practice helps us stay connected to our recovery
              </Text>
            </View>

            {/* Confirmation Message */}
            <View style={styles.completionCard}>
              <Text style={styles.confirmationText}>
                Thanks for taking time to reflect on gratitude. These moments of appreciation strengthen your recovery.
              </Text>
            </View>

            {/* Weekly Progress */}
            <View style={styles.completionCard}>
              <View style={styles.cardHeader}>
                <Calendar color={Colors.light.tint} size={20} />
                <Text style={styles.cardTitle}>This Week&apos;s Progress</Text>
              </View>
              
              <View style={styles.weeklyProgress}>
                {weeklyProgress.map((day, index) => {
                  const dayDate = new Date(day.date);
                  const today = new Date();
                  const isToday = day.date === today.toISOString().split('T')[0];
                  const isFuture = dayDate > today;
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const dayName = dayNames[dayDate.getDay()];
                  
                  return (
                    <View key={index} style={styles.dayContainer}>
                      <Text style={styles.dayName}>{dayName}</Text>
                      <View style={[
                        styles.dayCircle,
                        isToday && styles.dayCircleToday,
                        isFuture && styles.dayCircleFuture
                      ]}>
                        {isToday && (
                          <CheckCircle color="white" size={16} />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
              
              <Text style={styles.streakText}>
                1 day this week — keep it going!
              </Text>
            </View>

            {/* Privacy Notice */}
            <Text style={styles.privacyText}>
              Your responses are saved only on your device. Nothing is uploaded or shared.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.outlineButton} onPress={handleEditGratitude}>
                <Text style={styles.outlineButtonText}>Edit Gratitude</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => setShowSavedLists(true)}
              >
                <Archive size={20} color={Colors.light.tint} />
                <Text style={styles.secondaryButtonText}>View Saved Lists</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        
        <SavedGratitudeLists 
          visible={showSavedLists}
          onClose={() => setShowSavedLists(false)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding>
      <Stack.Screen options={{ title: 'Daily Gratitude' }} />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Heart size={24} color={Colors.light.tint} />
            <Text style={styles.title}>Gratitude List</Text>
          </View>
          <Text style={styles.quoteSubtitle}>
            &ldquo;A full and thankful heart cannot entertain great conceits.&rdquo; — As Bill Sees It, p 37
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.subtitle}>
            Today I&apos;m grateful for:
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="e.g., My sobriety"
              placeholderTextColor={Colors.light.muted}
              value={inputValue}
              onChangeText={setInputValue}
              onKeyPress={handleKeyPress}
              onSubmitEditing={handleAddGratitude}
              returnKeyType="done"
              multiline
              blurOnSubmit={true}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddGratitude}
              disabled={!inputValue.trim()}
            >
              <Text style={styles.addButtonText}>Add</Text>
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.saveButton,
              !canSave() && styles.saveButtonDisabled
            ]} 
            onPress={handleSaveEntry}
            disabled={!canSave()}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.shareButton,
              gratitudeItems.length === 0 && styles.shareButtonDisabled
            ]} 
            onPress={handleShare}
            disabled={gratitudeItems.length === 0}
          >
            <ShareIcon size={20} color="white" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* View Saved Lists Button */}
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => setShowSavedLists(true)}
        >
          <Archive size={20} color={Colors.light.tint} />
          <Text style={styles.secondaryButtonText}>View Saved Lists</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
      <SavedGratitudeLists 
        visible={showSavedLists}
        onClose={() => setShowSavedLists(false)}
      />
    </ScreenContainer>
  );
}
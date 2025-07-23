import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { EveningReviewEntry, WeeklyProgressDay } from '@/types';

interface DetailedEveningEntry {
  emotionFlag: boolean;
  emotionNote: string;
  apologyFlag: boolean;
  apologyName: string;
  kindnessFlag: boolean;
  kindnessNote: string;
  spiritualFlag: boolean;
  spiritualNote: string;
  aaTalkFlag: boolean;
}

const STORAGE_KEY = 'evening_review_entries';

export const [EveningReviewProvider, useEveningReviewStore] = createContextHook(() => {
  const [entries, setEntries] = useState<EveningReviewEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading evening review entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (newEntries: EveningReviewEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving evening review entries:', error);
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const isCompletedToday = () => {
    const todayString = getTodayDateString();
    return entries.some(entry => entry.date === todayString && entry.completed);
  };

  const completeToday = () => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    const newEntry: EveningReviewEntry = {
      date: todayString,
      answers: {},
      reflection: '',
      completed: true
    };

    let newEntries: EveningReviewEntry[];
    if (existingIndex >= 0) {
      newEntries = [...entries];
      newEntries[existingIndex] = { ...newEntries[existingIndex], completed: true };
    } else {
      newEntries = [...entries, newEntry];
    }

    saveEntries(newEntries);
  };

  const getWeeklyProgress = (): WeeklyProgressDay[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return weekDays.map((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      
      const isToday = dateString === getTodayDateString();
      const isFuture = date > today;
      const completed = entries.some(entry => entry.date === dateString && entry.completed);
      
      return {
        dayName,
        completed,
        isToday,
        isFuture
      };
    });
  };

  const getWeeklyStreak = (): number => {
    const weeklyProgress = getWeeklyProgress();
    return weeklyProgress.filter(day => day.completed && !day.isFuture).length;
  };

  const uncompleteToday = () => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    if (existingIndex >= 0) {
      const newEntries = [...entries];
      newEntries[existingIndex] = { ...newEntries[existingIndex], completed: false };
      saveEntries(newEntries);
    }
  };

  const saveEntry = (detailedEntry: DetailedEveningEntry) => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    const newEntry: EveningReviewEntry = {
      date: todayString,
      answers: {
        emotion: detailedEntry.emotionFlag,
        apology: detailedEntry.apologyFlag,
        kindness: detailedEntry.kindnessFlag,
        spiritual: detailedEntry.spiritualFlag,
        aaTalk: detailedEntry.aaTalkFlag
      },
      reflection: JSON.stringify({
        emotionNote: detailedEntry.emotionNote,
        apologyName: detailedEntry.apologyName,
        kindnessNote: detailedEntry.kindnessNote,
        spiritualNote: detailedEntry.spiritualNote
      }),
      completed: false
    };

    let newEntries: EveningReviewEntry[];
    if (existingIndex >= 0) {
      newEntries = [...entries];
      newEntries[existingIndex] = newEntry;
    } else {
      newEntries = [...entries, newEntry];
    }

    saveEntries(newEntries);
  };

  const getTodayEntry = (): EveningReviewEntry | null => {
    const todayString = getTodayDateString();
    return entries.find(entry => entry.date === todayString) || null;
  };

  return {
    entries,
    isLoading,
    isCompletedToday,
    completeToday,
    uncompleteToday,
    getWeeklyProgress,
    getWeeklyStreak,
    saveEntry,
    getTodayEntry
  };
});
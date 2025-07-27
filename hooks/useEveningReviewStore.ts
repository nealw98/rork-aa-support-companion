import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { ReviewEntry } from '@/utils/insightsLogic';
import { getDateKey, getWeekDates, isToday } from '@/utils/dateUtils';

const STORAGE_KEY = 'evening_review_entries';

export interface ReviewAnswers {
  prayer: boolean;
  meditation: boolean;
  resentments: boolean;
  fears: boolean;
  harms: boolean;
  amends: boolean;
  helping: boolean;
  gratitude: boolean;
}

export const [EveningReviewProvider, useEveningReviewStore] = createContextHook(() => {
  const [entries, setEntries] = useState<ReviewEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAnswers, setCurrentAnswers] = useState<ReviewAnswers>({
    prayer: false,
    meditation: false,
    resentments: false,
    fears: false,
    harms: false,
    amends: false,
    helping: false,
    gratitude: false
  });
  const [currentNotes, setCurrentNotes] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const today = getDateKey(new Date());
    const todayEntry = entries.find(entry => entry.date === today);
    if (todayEntry) {
      setCurrentAnswers(todayEntry.answers);
      setCurrentNotes(todayEntry.notes || '');
    } else {
      setCurrentAnswers({
        prayer: false,
        meditation: false,
        resentments: false,
        fears: false,
        harms: false,
        amends: false,
        helping: false,
        gratitude: false
      });
      setCurrentNotes('');
    }
  }, [entries]);

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

  const saveEntries = async (newEntries: ReviewEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving evening review entries:', error);
    }
  };

  const updateAnswer = (question: keyof ReviewAnswers, value: boolean) => {
    setCurrentAnswers(prev => ({ ...prev, [question]: value }));
  };

  const updateNotes = (notes: string) => {
    setCurrentNotes(notes);
  };

  const saveReview = () => {
    const today = getDateKey(new Date());
    const existingIndex = entries.findIndex(entry => entry.date === today);
    
    const newEntry: ReviewEntry = {
      date: today,
      timestamp: Date.now(),
      answers: currentAnswers,
      notes: currentNotes.trim() || undefined
    };

    let updatedEntries: ReviewEntry[];
    if (existingIndex >= 0) {
      updatedEntries = [...entries];
      updatedEntries[existingIndex] = newEntry;
    } else {
      updatedEntries = [...entries, newEntry];
    }

    saveEntries(updatedEntries);
  };

  const getWeeklyProgress = () => {
    const weekDates = getWeekDates();
    return weekDates.map(date => {
      const dateKey = getDateKey(date);
      const entry = entries.find(e => e.date === dateKey);
      return {
        date: dateKey,
        completed: !!entry,
        yesCount: entry ? Object.values(entry.answers).filter(Boolean).length : 0
      };
    });
  };

  const hasCompletedToday = () => {
    const today = getDateKey(new Date());
    return entries.some(entry => entry.date === today);
  };

  const getTodayProgress = () => {
    const answeredCount = Object.values(currentAnswers).filter(Boolean).length;
    return {
      answered: answeredCount,
      total: 8,
      percentage: Math.round((answeredCount / 8) * 100)
    };
  };

  return {
    entries,
    currentAnswers,
    currentNotes,
    isLoading,
    updateAnswer,
    updateNotes,
    saveReview,
    getWeeklyProgress,
    hasCompletedToday,
    getTodayProgress
  };
});
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { getDateKey, getWeekDates } from '@/utils/dateUtils';

const STORAGE_KEY = 'evening_review_entries';

export interface ReviewAnswers {
  resentful: boolean;
  selfish: boolean;
  fearful: boolean;
  apology: boolean;
  kindness: boolean;
  spiritual: boolean;
  aaTalk: boolean;
  prayerMeditation: boolean;
}

interface ReviewData {
  [date: string]: {
    answers: ReviewAnswers;
    completed: boolean;
  };
}

export const [EveningReviewProvider, useEveningReviewStore] = createContextHook(() => {
  const [data, setData] = useState<ReviewData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading evening review data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: ReviewData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving evening review data:', error);
    }
  };

  const getTodaysAnswers = (): ReviewAnswers | null => {
    const today = getDateKey(new Date());
    return data[today]?.answers || null;
  };

  const isCompletedToday = (): boolean => {
    const today = getDateKey(new Date());
    return data[today]?.completed || false;
  };

  const completeToday = (answers: ReviewAnswers) => {
    const today = getDateKey(new Date());
    const updatedData = {
      ...data,
      [today]: {
        answers,
        completed: true
      }
    };
    saveData(updatedData);
  };

  const getWeeklyProgress = () => {
    const weekDates = getWeekDates();
    return weekDates.map(date => {
      const dateKey = getDateKey(date);
      const dayData = data[dateKey];
      return {
        date: dateKey,
        completed: dayData?.completed || false,
        yesCount: dayData?.answers ? Object.values(dayData.answers).filter(Boolean).length : 0
      };
    });
  };

  // Legacy methods for backward compatibility
  const entries = Object.entries(data).map(([date, dayData]) => ({
    date,
    timestamp: Date.now(),
    answers: dayData.answers,
    notes: undefined
  }));

  const currentAnswers = getTodaysAnswers() || {
    resentful: false,
    selfish: false,
    fearful: false,
    apology: false,
    kindness: false,
    spiritual: false,
    aaTalk: false,
    prayerMeditation: false
  };

  const currentNotes = '';

  const updateAnswer = (question: keyof ReviewAnswers, value: boolean) => {
    const today = getDateKey(new Date());
    const currentData = data[today] || { answers: currentAnswers, completed: false };
    const updatedData = {
      ...data,
      [today]: {
        ...currentData,
        answers: {
          ...currentData.answers,
          [question]: value
        }
      }
    };
    saveData(updatedData);
  };

  const updateNotes = (notes: string) => {
    // Notes functionality not implemented in web app structure
  };

  const saveReview = () => {
    const today = getDateKey(new Date());
    const currentData = data[today];
    if (currentData) {
      completeToday(currentData.answers);
    }
  };

  const hasCompletedToday = () => {
    return isCompletedToday();
  };

  const getTodayProgress = () => {
    const answeredCount = Object.values(currentAnswers).filter(answer => answer !== undefined).length;
    return {
      answered: answeredCount,
      total: 8,
      percentage: Math.round((answeredCount / 8) * 100)
    };
  };

  return {
    // New methods matching web app
    getTodaysAnswers,
    isCompletedToday,
    completeToday,
    getWeeklyProgress,
    
    // Legacy methods for backward compatibility
    entries,
    currentAnswers,
    currentNotes,
    isLoading,
    updateAnswer,
    updateNotes,
    saveReview,
    hasCompletedToday,
    getTodayProgress
  };
});
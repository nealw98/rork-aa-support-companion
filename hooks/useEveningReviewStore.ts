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
    const today = new Date();
    const weekDays = [];
    
    // Get current week (Sunday to Saturday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // Sunday is day 0, so subtract day number
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = getDateKey(date);
      
      weekDays.push({
        date: dateKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: data[dateKey]?.completed || false,
        isToday: dateKey === getDateKey(new Date()),
        isFuture: date > today
      });
    }
    
    return weekDays;
  };

  const getWeeklyStreak = () => {
    const weekDays = getWeeklyProgress();
    const completedThisWeek = weekDays.filter(day => day.completed && !day.isFuture).length;
    return completedThisWeek;
  };

  const get30DayInsights = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    let completedCount = 0;
    let resentfulCount = 0;
    let selfishCount = 0;
    let fearfulCount = 0;
    let apologyCount = 0;
    let kindnessCount = 0;
    let spiritualCount = 0;
    let aaTalkCount = 0;
    let prayerMeditationCount = 0;
    
    // Iterate through the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = getDateKey(date);
      
      const dayData = data[dateKey];
      if (dayData?.completed) {
        completedCount++;
        if (dayData.answers.resentful) resentfulCount++;
        if (dayData.answers.selfish) selfishCount++;
        if (dayData.answers.fearful) fearfulCount++;
        if (dayData.answers.apology) apologyCount++;
        if (dayData.answers.kindness) kindnessCount++;
        if (dayData.answers.spiritual) spiritualCount++;
        if (dayData.answers.aaTalk) aaTalkCount++;
        if (dayData.answers.prayerMeditation) prayerMeditationCount++;
      }
    }
    
    return {
      completedDays: completedCount,
      resentfulCount,
      selfishCount, 
      fearfulCount,
      apologyCount,
      kindnessCount,
      spiritualCount,
      aaTalkCount,
      prayerMeditationCount,
    };
  };

  const uncompleteToday = () => {
    const today = getDateKey(new Date());
    if (data[today]) {
      const updatedData = { ...data };
      delete updatedData[today];
      saveData(updatedData);
    }
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
    uncompleteToday,
    getWeeklyProgress,
    getWeeklyStreak,
    get30DayInsights,
    
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
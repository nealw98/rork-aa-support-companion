import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface ReviewAnswers {
  resentful: boolean;
  selfish: boolean;
  fearful: boolean;
  apology: boolean;
  kindness: boolean;
  spiritual: boolean;
  aaTalk: boolean;
  prayerMeditation: boolean;
}

interface EveningReviewEntry {
  date: string;
  timestamp: number;
  answers: ReviewAnswers;
  notes?: string;
}

interface WeeklyProgressDay {
  date: string;
  completed: boolean;
  yesCount: number;
  dayName: string;
  isFuture: boolean;
  isToday: boolean;
}

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
  prayerFlag: boolean;
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
    return entries.some(entry => entry.date === todayString);
  };

  const completeToday = (answers: ReviewAnswers) => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    const newEntry: EveningReviewEntry = {
      date: todayString,
      timestamp: Date.now(),
      answers,
      notes: undefined
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

  const getWeeklyProgress = (): WeeklyProgressDay[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      const todayString = getTodayDateString();
      
      const entry = entries.find(entry => entry.date === dateString);
      const completed = !!entry;
      const yesCount = entry ? Object.values(entry.answers).filter(Boolean).length : 0;
      
      return {
        date: dateString,
        completed,
        yesCount,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isFuture: date > today,
        isToday: dateString === todayString
      };
    });
  };

  const getWeeklyStreak = (): number => {
    const weeklyProgress = getWeeklyProgress();
    const today = new Date();
    return weeklyProgress.filter(day => {
      const dayDate = new Date(day.date);
      const isFuture = dayDate > today;
      return day.completed && !isFuture;
    }).length;
  };

  const uncompleteToday = () => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    if (existingIndex >= 0) {
      const newEntries = [...entries];
      newEntries.splice(existingIndex, 1);
      saveEntries(newEntries);
    }
  };

  const saveEntry = (detailedEntry: DetailedEveningEntry) => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    const newEntry: EveningReviewEntry = {
      date: todayString,
      timestamp: Date.now(),
      answers: {
        resentful: detailedEntry.emotionFlag,
        selfish: detailedEntry.emotionFlag,
        fearful: detailedEntry.emotionFlag,
        apology: detailedEntry.apologyFlag,
        kindness: detailedEntry.kindnessFlag,
        spiritual: detailedEntry.spiritualFlag,
        aaTalk: detailedEntry.aaTalkFlag,
        prayerMeditation: detailedEntry.prayerFlag
      },
      notes: JSON.stringify({
        emotionNote: detailedEntry.emotionNote,
        apologyName: detailedEntry.apologyName,
        kindnessNote: detailedEntry.kindnessNote,
        spiritualNote: detailedEntry.spiritualNote
      })
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

  const getTodaysAnswers = (): ReviewAnswers | null => {
    const todayString = getTodayDateString();
    const entry = entries.find(entry => entry.date === todayString);
    return entry ? entry.answers : null;
  };

  const getTodayEntry = (): EveningReviewEntry | null => {
    const todayString = getTodayDateString();
    return entries.find(entry => entry.date === todayString) || null;
  };

  const getThirtyDayCounts = () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff;
    });

    return {
      completedDays: recentEntries.length,
      resentfulCount: recentEntries.filter(e => e.answers.resentful).length,
      selfishCount: recentEntries.filter(e => e.answers.selfish).length,
      fearfulCount: recentEntries.filter(e => e.answers.fearful).length,
      apologyCount: recentEntries.filter(e => e.answers.apology).length,
      kindnessCount: recentEntries.filter(e => e.answers.kindness).length,
      spiritualCount: recentEntries.filter(e => e.answers.spiritual).length,
      aaTalkCount: recentEntries.filter(e => e.answers.aaTalk).length,
      prayerMeditationCount: recentEntries.filter(e => e.answers.prayerMeditation).length,
    };
  };

  const getTodayProgress = () => {
    const todayString = getTodayDateString();
    const entry = entries.find(entry => entry.date === todayString);
    return {
      completed: !!entry,
      yesCount: entry ? Object.values(entry.answers).filter(Boolean).length : 0
    };
  };

  return {
    getTodaysAnswers,
    isCompletedToday,
    completeToday,
    getWeeklyProgress,
    getThirtyDayCounts,
    getTodayProgress,
    entries,
    isLoading,
    uncompleteToday,
    getWeeklyStreak,
    saveEntry,
    getTodayEntry
  };
});
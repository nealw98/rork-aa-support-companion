import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { GratitudeEntry } from '@/utils/insightsLogic';
import { getDateKey, getWeekDates, isToday } from '@/utils/dateUtils';

const STORAGE_KEY = 'gratitude_entries';

export const [GratitudeProvider, useGratitudeStore] = createContextHook(() => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayEntries, setTodayEntries] = useState<GratitudeEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const today = getDateKey(new Date());
    setTodayEntries(entries.filter(entry => entry.date === today));
  }, [entries]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading gratitude entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (newEntries: GratitudeEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving gratitude entries:', error);
    }
  };

  const addEntry = (text: string) => {
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      date: getDateKey(new Date()),
      timestamp: Date.now()
    };
    
    const updatedEntries = [...entries, newEntry];
    saveEntries(updatedEntries);
  };

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
  };

  const getWeeklyProgress = () => {
    const weekDates = getWeekDates();
    return weekDates.map(date => {
      const dateKey = getDateKey(date);
      const dayEntries = entries.filter(entry => entry.date === dateKey);
      return {
        date: dateKey,
        completed: dayEntries.length > 0,
        count: dayEntries.length
      };
    });
  };

  const canComplete = () => {
    return todayEntries.length >= 3;
  };

  const hasCompletedToday = () => {
    return todayEntries.length >= 3;
  };

  return {
    entries,
    todayEntries,
    isLoading,
    addEntry,
    removeEntry,
    getWeeklyProgress,
    canComplete,
    hasCompletedToday
  };
});
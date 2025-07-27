import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { getDateKey, getWeekDates } from '@/utils/dateUtils';

const STORAGE_KEY = 'gratitude_entries';

interface GratitudeData {
  [date: string]: {
    items: string[];
    completed: boolean;
  };
}

export const [GratitudeProvider, useGratitudeStore] = createContextHook(() => {
  const [data, setData] = useState<GratitudeData>({});
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
      console.error('Error loading gratitude data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: GratitudeData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving gratitude data:', error);
    }
  };

  const getTodaysItems = (): string[] => {
    const today = getDateKey(new Date());
    return data[today]?.items || [];
  };

  const isCompletedToday = (): boolean => {
    const today = getDateKey(new Date());
    return data[today]?.completed || false;
  };

  const addItemsToToday = (items: string[]) => {
    const today = getDateKey(new Date());
    const currentItems = data[today]?.items || [];
    const updatedData = {
      ...data,
      [today]: {
        items: [...currentItems, ...items],
        completed: data[today]?.completed || false
      }
    };
    saveData(updatedData);
  };

  const completeToday = (items: string[]) => {
    const today = getDateKey(new Date());
    const updatedData = {
      ...data,
      [today]: {
        items,
        completed: true
      }
    };
    saveData(updatedData);
  };

  const uncompleteToday = () => {
    const today = getDateKey(new Date());
    if (data[today]) {
      const updatedData = {
        ...data,
        [today]: {
          ...data[today],
          completed: false
        }
      };
      saveData(updatedData);
    }
  };

  const getWeeklyGratitudeProgress = () => {
    const today = new Date();
    const progress = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateKey(date);
      const isFuture = date > today;
      
      progress.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        completed: !!data[dateStr]?.completed,
        isFuture
      });
    }
    
    return progress;
  };

  const getGratitudeDaysCount = () => {
    return Object.keys(data).filter(date => data[date]?.completed).length;
  };

  const getWeeklyProgress = () => {
    const weekDates = getWeekDates();
    return weekDates.map(date => {
      const dateKey = getDateKey(date);
      const dayData = data[dateKey];
      return {
        date: dateKey,
        completed: dayData?.completed || false,
        count: dayData?.items?.length || 0
      };
    });
  };

  // Legacy methods for backward compatibility
  const todayEntries = getTodaysItems().map((text, index) => ({
    id: index.toString(),
    text,
    date: getDateKey(new Date()),
    timestamp: Date.now()
  }));

  const addEntry = (text: string) => {
    addItemsToToday([text]);
  };

  const removeEntry = (id: string) => {
    const today = getDateKey(new Date());
    const currentItems = data[today]?.items || [];
    const index = parseInt(id);
    if (index >= 0 && index < currentItems.length) {
      const updatedItems = currentItems.filter((_, i) => i !== index);
      const updatedData = {
        ...data,
        [today]: {
          items: updatedItems,
          completed: data[today]?.completed || false
        }
      };
      saveData(updatedData);
    }
  };

  const canComplete = () => {
    return getTodaysItems().length >= 3;
  };

  const hasCompletedToday = () => {
    return isCompletedToday();
  };

  return {
    // New methods matching web app
    getTodaysItems,
    isCompletedToday,
    addItemsToToday,
    completeToday,
    uncompleteToday,
    getWeeklyGratitudeProgress,
    getGratitudeDaysCount,
    getWeeklyProgress,
    
    // Legacy methods for backward compatibility
    entries: Object.entries(data).flatMap(([date, dayData]) => 
      dayData.items.map((text, index) => ({
        id: `${date}-${index}`,
        text,
        date,
        timestamp: Date.now()
      }))
    ),
    todayEntries,
    isLoading,
    addEntry,
    removeEntry,
    canComplete,
    hasCompletedToday
  };
});
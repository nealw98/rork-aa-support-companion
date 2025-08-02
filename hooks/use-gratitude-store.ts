import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GratitudeEntry {
  date: string;
  items: string[];
  completed: boolean;
}

const STORAGE_KEY = 'gratitude_entries';

interface GratitudeStoreContextType {
  entries: GratitudeEntry[];
  isLoading: boolean;
  isCompletedToday: () => boolean;
  getTodayEntry: () => GratitudeEntry | null;
  getTodaysItems: () => string[];
  addItemsToToday: (newItems: string[]) => void;
  completeToday: (items: string[]) => void;
  saveGratitudeList: (items: string[]) => void;
  uncompleteToday: () => void;
  getCompletedDaysInLast30: () => number;
}

const GratitudeStoreContext = createContext<GratitudeStoreContextType | undefined>(undefined);

export const GratitudeProvider = ({ children }: { children: ReactNode }) => {
  const value = useGratitudeStoreLogic();
  return (
    <GratitudeStoreContext.Provider value={value}>
      {children}
    </GratitudeStoreContext.Provider>
  );
};

export const useGratitudeStore = () => {
  const context = useContext(GratitudeStoreContext);
  if (!context) {
    throw new Error('useGratitudeStore must be used within GratitudeProvider');
  }
  return context;
};

const useGratitudeStoreLogic = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
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

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const isCompletedToday = () => {
    const todayString = getTodayDateString();
    return entries.some(entry => entry.date === todayString && entry.completed);
  };

  const getTodayEntry = (): GratitudeEntry | null => {
    const todayString = getTodayDateString();
    return entries.find(entry => entry.date === todayString) || null;
  };

  const getTodaysItems = (): string[] => {
    const todayEntry = getTodayEntry();
    return todayEntry ? todayEntry.items : [];
  };

  const addItemsToToday = (newItems: string[]) => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    let currentItems: string[] = [];
    if (existingIndex >= 0) {
      currentItems = entries[existingIndex].items;
    }
    
    const updatedItems = [...currentItems, ...newItems.filter(item => item.trim() !== '')];
    
    const newEntry: GratitudeEntry = {
      date: todayString,
      items: updatedItems,
      completed: false
    };

    let newEntries: GratitudeEntry[];
    if (existingIndex >= 0) {
      newEntries = [...entries];
      newEntries[existingIndex] = newEntry;
    } else {
      newEntries = [...entries, newEntry];
    }

    saveEntries(newEntries);
  };

  const completeToday = (items: string[]) => {
    const todayString = getTodayDateString();
    const existingIndex = entries.findIndex(entry => entry.date === todayString);
    
    const newEntry: GratitudeEntry = {
      date: todayString,
      items: items.filter(item => item.trim() !== ''),
      completed: true
    };

    let newEntries: GratitudeEntry[];
    if (existingIndex >= 0) {
      newEntries = [...entries];
      newEntries[existingIndex] = newEntry;
    } else {
      newEntries = [...entries, newEntry];
    }

    saveEntries(newEntries);
  };

  const saveGratitudeList = (items: string[]) => {
    completeToday(items);
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

  const getCompletedDaysInLast30 = (): number => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoff && entry.completed;
    }).length;
  };

  return {
    entries,
    isLoading,
    isCompletedToday,
    getTodayEntry,
    getTodaysItems,
    addItemsToToday,
    completeToday,
    saveGratitudeList,
    uncompleteToday,
    getCompletedDaysInLast30
  };
};
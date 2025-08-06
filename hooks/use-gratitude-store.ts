import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface GratitudeEntry {
  date: string;
  items: string[];
  completed: boolean;
}

export interface SavedGratitudeEntry {
  date: string;
  items: string[];
  timestamp: number;
}

const STORAGE_KEY = 'gratitude_entries';
const SAVED_ENTRIES_KEY = 'saved_gratitude_entries';

export const [GratitudeProvider, useGratitudeStore] = createContextHook(() => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [savedEntries, setSavedEntries] = useState<SavedGratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
    loadSavedEntries();
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

  const loadSavedEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_ENTRIES_KEY);
      if (stored) {
        setSavedEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved gratitude entries:', error);
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
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const saveGratitudeEntry = (items: string[]) => {
    const todayString = getTodayDateString();
    const newSavedEntry: SavedGratitudeEntry = {
      date: todayString,
      items: items.filter(item => item.trim() !== ''),
      timestamp: Date.now()
    };

    // Remove existing entry for the same date if it exists
    const filteredEntries = savedEntries.filter(entry => entry.date !== todayString);
    
    // Add new entry and sort by date (newest first)
    const updatedEntries = [newSavedEntry, ...filteredEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 200); // Keep max 200 entries (FIFO)

    setSavedEntries(updatedEntries);
    saveSavedEntries(updatedEntries);
  };

  const saveSavedEntries = async (entries: SavedGratitudeEntry[]) => {
    try {
      await AsyncStorage.setItem(SAVED_ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving gratitude entries:', error);
    }
  };

  const deleteSavedEntry = (dateString: string) => {
    const updatedEntries = savedEntries.filter(entry => entry.date !== dateString);
    setSavedEntries(updatedEntries);
    saveSavedEntries(updatedEntries);
  };

  return {
    entries,
    savedEntries,
    isLoading,
    isCompletedToday,
    getTodayEntry,
    getTodaysItems,
    addItemsToToday,
    completeToday,
    saveGratitudeList,
    saveGratitudeEntry,
    deleteSavedEntry,
    uncompleteToday,
    getCompletedDaysInLast30
  };
});
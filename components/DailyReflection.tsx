import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Platform } from "react-native";
import { BookmarkIcon, ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from "@/constants/colors";
import { getReflectionForDate } from "@/constants/reflections";
import { Reflection } from "@/types";

export default function DailyReflection() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    updateReflection(selectedDate);
  }, [selectedDate]);

  const updateReflection = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDateString(date.toLocaleDateString(undefined, options));
    
    const dateReflection = getReflectionForDate(date);
    setReflection(dateReflection);
    
    // Check if this reflection is a favorite
    checkIfFavorite(dateReflection.title);
  };

  const checkIfFavorite = async (title: string) => {
    try {
      const favorites = await AsyncStorage.getItem('aa-favorites');
      if (favorites) {
        const favoritesArray = JSON.parse(favorites) as string[];
        setIsFavorite(favoritesArray.includes(title));
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!reflection) return;
    
    try {
      const favorites = await AsyncStorage.getItem('aa-favorites');
      let favoritesArray: string[] = [];
      
      if (favorites) {
        favoritesArray = JSON.parse(favorites);
      }
      
      if (isFavorite) {
        // Remove from favorites
        favoritesArray = favoritesArray.filter(title => title !== reflection.title);
      } else {
        // Add to favorites
        favoritesArray.push(reflection.title);
      }
      
      await AsyncStorage.setItem('aa-favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  if (!reflection) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading reflection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.3)', 'rgba(78, 205, 196, 0.2)', 'rgba(92, 184, 92, 0.1)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{dateString}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton} testID="favorite-button">
            <BookmarkIcon size={24} color={isFavorite ? Colors.light.accent : Colors.light.muted} fill={isFavorite ? Colors.light.accent : "transparent"} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerDecoration} />
          </View>
          
          <Text style={styles.title}>{reflection.title}</Text>
          <Text style={styles.quote}>"{reflection.quote}"</Text>
          <Text style={styles.source}>{reflection.source}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.reflectionText}>{reflection.reflection}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.thoughtTitle}>Today's Thought:</Text>
          <Text style={styles.thought}>{reflection.thought}</Text>
        </View>

        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            Copyright © 1990 by Alcoholics Anonymous World Services, Inc. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Navigation moved to bottom */}
      <View style={styles.bottomNavigationContainer}>
        <View style={styles.navigationContent}>
          <TouchableOpacity 
            onPress={() => navigateDate('prev')} 
            style={styles.navButton}
            testID="prev-day-button"
          >
            <ChevronLeft size={24} color={Colors.light.tint} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={openDatePicker}
            style={styles.dateButton}
            testID="calendar-button"
          >
            <Calendar size={20} color={Colors.light.tint} />
            <Text style={styles.dateButtonText}>Select Date</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigateDate('next')} 
            style={styles.navButton}
            testID="next-day-button"
          >
            <ChevronRight size={24} color={Colors.light.tint} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => {
                  setShowDatePicker(false);
                }}>
                  <Text style={styles.modalButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Add space for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 8,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerDecoration: {
    width: 40,
    height: 3,
    backgroundColor: Colors.light.tint,
    borderRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 26,
    textAlign: "center",
  },
  source: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "right",
    marginBottom: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: 16,
    opacity: 0.5,
  },
  reflectionText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  thoughtTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  thought: {
    fontSize: 16,
    color: Colors.light.text,
    fontStyle: "italic",
    lineHeight: 24,
  },
  copyrightContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  copyrightText: {
    fontSize: 11,
    color: Colors.light.muted,
    textAlign: "center",
    lineHeight: 16,
  },
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navigationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12, // Account for safe area on iOS
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.cardBackground,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.cardBackground,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalButton: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  datePicker: {
    height: 200,
  },
});
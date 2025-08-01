import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import { useSobriety } from '@/hooks/useSobrietyStore';
import Colors from '@/constants/colors';

const SobrietyCounter = () => {
  const { 
    sobrietyDate, 
    shouldShowPrompt, 
    setSobrietyDate, 
    dismissPrompt, 
    calculateDaysSober,
    isLoading 
  } = useSobriety();
  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [webDateString, setWebDateString] = useState<string>('');

  const formatDateInput = (text: string) => {
    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Format as YYYY-MM-DD
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  const handleWebDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setWebDateString(formatted);
  };

  const isValidDate = (dateString: string) => {
    if (Platform.OS === 'web' && webDateString) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(webDateString)) return false;
      const date = new Date(webDateString);
      return date instanceof Date && !isNaN(date.getTime()) && date <= new Date();
    }
    return true;
  };

  if (isLoading) {
    return null;
  }

  const daysSober = calculateDaysSober();

  const handleConfirmDate = () => {
    let dateString: string;
    if (Platform.OS === 'web') {
      if (!webDateString || !isValidDate(webDateString)) {
        alert('Please enter a valid date in YYYY-MM-DD format');
        return;
      }
      dateString = webDateString;
    } else {
      dateString = selectedDate.toISOString().split('T')[0];
    }
    setSobrietyDate(dateString);
    setShowDatePicker(false);
  };

  const handleNotNow = () => {
    dismissPrompt();
    setShowDatePicker(false);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && date) {
        const dateString = date.toISOString().split('T')[0];
        setSobrietyDate(dateString);
      }
    } else if (date) {
      setSelectedDate(date);
    }
  };

  // Show prompt modal for first-time users
  if (shouldShowPrompt()) {
    return (
      <>
        {!showDatePicker && (
          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={handleNotNow}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={handleNotNow}
                >
                  <X size={24} color={Colors.light.muted} />
                </TouchableOpacity>
                
                <Calendar size={48} color={Colors.light.tint} style={styles.modalIcon} />
                
                <Text style={styles.modalTitle}>Track Your Sobriety</Text>
                <Text style={styles.modalDescription}>
                  Would you like to add your sobriety date to track your progress?
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.confirmButtonText}>Add Date</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.notNowButton]}
                    onPress={handleNotNow}
                  >
                    <Text style={styles.notNowButtonText}>Not Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
        
        {showDatePicker && (
          <Modal
            visible={true}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerContent}>
                <Text style={styles.datePickerTitle}>Select Your Sobriety Date</Text>
                
                {Platform.OS === 'web' ? (
                  <View style={styles.webDateContainer}>
                    <TextInput
                      style={[
                        styles.webDateInput,
                        !isValidDate(webDateString) && webDateString.length > 0 && styles.webDateInputError
                      ]}
                      value={webDateString}
                      onChangeText={handleWebDateChange}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={Colors.light.muted}
                      maxLength={10}
                    />
                    {!isValidDate(webDateString) && webDateString.length > 0 && (
                      <Text style={styles.errorText}>Please enter a valid date</Text>
                    )}
                  </View>
                ) : (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    style={styles.datePicker}
                  />
                )}
                
                {(Platform.OS === 'ios' || Platform.OS === 'web') && (
                  <View style={styles.datePickerButtons}>
                    <TouchableOpacity 
                      style={[styles.datePickerButton, styles.cancelButton]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.datePickerButton, styles.confirmDateButton]}
                      onPress={handleConfirmDate}
                    >
                      <Text style={styles.confirmDateButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  }

  // Show sobriety counter if date is set
  if (sobrietyDate) {
    return (
      <View style={styles.counterContainer}>
        <View style={styles.counterContent}>
          <Calendar size={32} color={Colors.light.tint} style={styles.counterIcon} />
          <View style={styles.counterTextContainer}>
            <Text style={styles.daysNumber}>{daysSober}</Text>
            <Text style={styles.daysLabel}>
              {daysSober === 1 ? 'Day Sober' : 'Days Sober'}
            </Text>
          </View>
        </View>
        <Text style={styles.sobrietyDateText}>
          Since {new Date(sobrietyDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.light.tint,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notNowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.muted,
  },
  notNowButtonText: {
    color: Colors.light.muted,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Date picker styles
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  datePickerContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
  },
  datePickerButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.muted,
  },
  cancelButtonText: {
    color: Colors.light.muted,
    fontSize: 16,
    fontWeight: '500',
  },
  confirmDateButton: {
    backgroundColor: Colors.light.tint,
  },
  confirmDateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Counter display styles
  counterContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  counterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  counterIcon: {
    marginRight: 12,
  },
  counterTextContainer: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.tint,
    lineHeight: 36,
  },
  daysLabel: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '600',
  },
  sobrietyDateText: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  webDateContainer: {
    width: '100%',
    marginBottom: 20,
  },
  webDateInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.muted,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  webDateInputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default SobrietyCounter;
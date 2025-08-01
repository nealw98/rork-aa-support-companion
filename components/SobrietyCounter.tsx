import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
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

  if (isLoading) {
    return null;
  }

  const daysSober = calculateDaysSober();

  const handleConfirmDate = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
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
                
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  style={styles.datePicker}
                />
                
                {Platform.OS === 'ios' && (
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
});

export default SobrietyCounter;
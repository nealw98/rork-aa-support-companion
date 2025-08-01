import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Share } from 'react-native';
import { useEveningReviewStore } from '@/hooks/useEveningReviewStore';

export default function NightlyReview() {
  const [newEntry, setNewEntry] = useState('');
  const { entries, addEntry, toggleEntry } = useEveningReviewStore();

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      addEntry(newEntry);
      setNewEntry('');
    }
  };

  const handleShare = async () => {
    try {
      const reviewText = entries.map(entry => `${entry.text}`).join('\n');
      await Share.share({
        message: `My Nightly Review:\n${reviewText}`,
      });
    } catch (error) {
      console.error('Error sharing nightly review:', error);
    }
  };

  const renderItem = ({ item }: { item: EveningReviewEntry }) => (
    <TouchableOpacity 
      style={[styles.entryItem, item.completed && styles.completedEntry]}
      onPress={() => toggleEntry(item.id)}
    >
      <Text style={[styles.entryText, item.completed && styles.completedText]}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nightly Review</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newEntry}
          onChangeText={setNewEntry}
          placeholder="Add a reflection..."
          multiline
        />
        <Button
          mode="contained"
          onPress={handleAddEntry}
          style={styles.addButton}
        >
          Add
        </Button>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.entriesList}
      />

      <Button
        mode="contained"
        onPress={handleShare}
        style={styles.completeButton}
      >
        Share Nightly Review
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    alignSelf: 'flex-end',
  },
  entriesList: {
    flex: 1,
  },
  entryItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  entryText: {
    fontSize: 16,
  },
  completedEntry: {
    backgroundColor: '#e0e0e0',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completeButton: {
    marginTop: 16,
  },
});

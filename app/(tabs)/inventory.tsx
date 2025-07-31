import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Stack } from 'expo-router';

const Inventory = () => {
  const onTheBeam = [
    'HONESTY',
    'FAITH',
    'COURAGE',
    'GIVING',
    'CALM',
    'GRATEFUL',
    'PATIENCE',
    'LOVE',
    'TRUST',
    'ACTION'
  ];

  const offTheBeam = [
    'DISHONEST',
    'FEAR',
    'PRIDE',
    'GREEDY',
    'ANGER',
    'ENVY',
    'IMPATIENT',
    'HATE',
    'SUSPICION',
    'SLOTH'
  ];

  return (
    <LinearGradient
      colors={['rgba(74, 144, 226, 0.3)', 'rgba(78, 205, 196, 0.2)', 'rgba(92, 184, 92, 0.1)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ title: 'Spot Check Inventory' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Are you</Text>
          <Text style={styles.subtitle}>"ON THE BEAM"</Text>
          <View style={styles.card}>
            <View style={styles.gridContainer}>
              <View style={styles.columnContainer}>
                <View style={styles.columnHeaderOn}>
                  <Text style={styles.columnTitle}>ON THE BEAM</Text>
                </View>
                <View style={styles.listContainerOn}>
                  {onTheBeam.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={[styles.itemText, styles.noWrap]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.columnContainer}>
                <View style={styles.columnHeaderOff}>
                  <Text style={styles.columnTitle}>OFF THE BEAM</Text>
                </View>
                <View style={styles.listContainerOff}>
                  {offTheBeam.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={[styles.itemText, styles.noWrap]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  columnContainer: {
    width: '48%',
    marginBottom: 16,
  },
  columnHeaderOn: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnHeaderOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  listContainerOn: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
  },
  listContainerOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
  },
  noWrap: {
    flexShrink: 0,
  },
});

export default Inventory;

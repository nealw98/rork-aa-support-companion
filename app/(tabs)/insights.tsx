import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function InsightsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Insights (Deprecated)' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Insights screen is no longer in use.</Text>
      </View>
    </>
  );
}

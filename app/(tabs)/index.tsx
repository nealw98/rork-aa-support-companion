import { StyleSheet, View } from "react-native";
import DailyReflection from "@/components/DailyReflection";

export default function DailyReflectionScreen() {
  return (
    <View style={styles.container}>
      <DailyReflection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
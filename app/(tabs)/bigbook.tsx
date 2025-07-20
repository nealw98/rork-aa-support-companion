import { StyleSheet, View } from "react-native";
import BigBookBrowser from "@/components/BigBookBrowser";

export default function BigBookScreen() {
  return (
    <View style={styles.container}>
      <BigBookBrowser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
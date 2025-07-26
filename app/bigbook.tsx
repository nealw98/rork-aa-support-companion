import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import BigBookBrowser from "@/components/BigBookBrowser";
import ScreenContainer from "@/components/ScreenContainer";

export default function BigBookScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Big Book", headerTitle: "Alcoholics Anonymous" }} />
      <ScreenContainer style={styles.container}>
        <BigBookBrowser />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
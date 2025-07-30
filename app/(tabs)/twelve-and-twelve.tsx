import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import TwelveAndTwelveBrowser from "@/components/TwelveAndTwelveBrowser";
import ScreenContainer from "@/components/ScreenContainer";

export default function TwelveAndTwelveScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Twelve & Twelve", headerTitle: "Twelve Steps and Twelve Traditions" }} />
      <ScreenContainer style={styles.container}>
        <TwelveAndTwelveBrowser />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
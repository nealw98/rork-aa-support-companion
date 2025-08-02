import { StyleSheet } from "react-native";
import TwelveAndTwelveBrowser from "@/components/TwelveAndTwelveBrowser";
import ScreenContainer from "@/components/ScreenContainer";

export default function TwelveAndTwelveScreen() {
  return (
    <ScreenContainer style={styles.container} noPadding={true}>
      <TwelveAndTwelveBrowser />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
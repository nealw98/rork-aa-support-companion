import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Home } from "lucide-react-native";
import BigBookBrowser from "@/components/BigBookBrowser";
import ScreenContainer from "@/components/ScreenContainer";
import Colors from "@/constants/colors";

const HomeButton = () => (
  <TouchableOpacity 
    style={styles.homeButton}
    onPress={() => router.push('/')}
    testID="home-button"
  >
    <Home color={Colors.light.tint} size={24} />
  </TouchableOpacity>
);

export default function BigBookScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: "Big Book",
        headerRight: () => <HomeButton />
      }} />
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
  homeButton: {
    padding: 8,
    marginRight: 4
  }
});
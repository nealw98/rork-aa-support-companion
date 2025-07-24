import { StyleSheet } from "react-native";
import ChatInterface from "@/components/ChatInterface";
import { ChatStoreProvider } from "@/hooks/use-chat-store";
import ScreenContainer from "@/components/ScreenContainer";

export default function ChatScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <ChatStoreProvider>
        <ChatInterface />
      </ChatStoreProvider>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
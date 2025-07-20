import { StyleSheet, View } from "react-native";
import ChatInterface from "@/components/ChatInterface";
import { ChatStoreProvider } from "@/hooks/use-chat-store";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ChatStoreProvider>
        <ChatInterface />
      </ChatStoreProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Send, RotateCcw, UserCircle2 } from "lucide-react-native";

import Colors from "@/constants/colors";
import { useChatStore, SponsorType } from "@/hooks/use-chat-store";
import { ChatMessage } from "@/types";

const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.sender === "user";
  
  return (
    <View
      style={[
        styles.bubbleContainer,
        isUser ? styles.userBubbleContainer : styles.botBubbleContainer,
      ]}
      testID={`chat-bubble-${message.id}`}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
};

const SponsorToggle = ({ 
  sponsorType, 
  onChange 
}: { 
  sponsorType: SponsorType; 
  onChange: (type: SponsorType) => void;
}) => {
  return (
    <View style={styles.sponsorToggleContainer}>
      <TouchableOpacity
        style={[
          styles.sponsorButton,
          sponsorType === "supportive" && styles.sponsorButtonActive
        ]}
        onPress={() => onChange("supportive")}
        testID="supportive-sponsor-button"
      >
        <Text 
          style={[
            styles.sponsorButtonText,
            sponsorType === "supportive" && styles.sponsorButtonTextActive
          ]}
        >
          Supportive Sponsor
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.sponsorButton,
          sponsorType === "salty" && styles.sponsorButtonActive
        ]}
        onPress={() => onChange("salty")}
        testID="salty-sponsor-button"
      >
        <Text 
          style={[
            styles.sponsorButtonText,
            sponsorType === "salty" && styles.sponsorButtonTextActive
          ]}
        >
          Salty Sam
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, clearChat, sponsorType, changeSponsor } = useChatStore();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === "") return;
    
    sendMessage(inputText);
    setInputText("");
  };

  const handleClearChat = () => {
    clearChat();
  };

  const getSponsorName = () => {
    return sponsorType === "salty" ? "Salty Sam" : "Supportive Sponsor";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            💬 <Text style={styles.saltyTitle}>Chatting with {getSponsorName()}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearChat}
          testID="clear-chat-button"
        >
          <RotateCcw size={18} color={Colors.light.muted} />
        </TouchableOpacity>
      </View>
      
      <SponsorToggle 
        sponsorType={sponsorType} 
        onChange={changeSponsor}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        testID="chat-message-list"
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.light.tint} />
          <Text style={styles.loadingText}>{getSponsorName()} is thinking...</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Tell ${getSponsorName()} what's on your mind...`}
          placeholderTextColor={Colors.light.muted}
          multiline
          maxLength={500}
          testID="chat-input"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          testID="send-button"
        >
          <Send
            size={20}
            color={!inputText.trim() || isLoading ? Colors.light.muted : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE082",
  },
  disclaimer: {
    flex: 1,
    padding: 10,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#795548",
    textAlign: "center",
  },
  saltyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    padding: 12,
    marginRight: 4,
  },
  sponsorToggleContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  sponsorButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.divider,
  },
  sponsorButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  sponsorButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.muted,
  },
  sponsorButtonTextActive: {
    color: "#fff",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  bubbleContainer: {
    marginBottom: 12,
    maxWidth: "80%",
    alignItems: "flex-end",
  },
  userBubbleContainer: {
    alignSelf: "flex-end",
  },
  botBubbleContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: Colors.light.chatBubbleUser,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.light.chatBubbleBot,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.light.muted,
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.light.muted,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    backgroundColor: Colors.light.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.divider,
  },
});
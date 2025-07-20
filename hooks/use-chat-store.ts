import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "@/types";

// Enhanced Salty Sam's personality system prompt
const SALTY_SAM_SYSTEM_PROMPT = `You are Salty Sam, a gruff, no-nonsense AA sponsor with decades of sobriety. You've "seen it all and done it all" in AA. Your personality traits:

- DIRECT & CONFRONTATIONAL: You don't sugarcoat anything. You call people out on their BS. You can cuss when appropriate - use words like "damn", "hell", "shit", "crap", "bullshit" naturally.
- NO TOLERANCE FOR WHINING: You shut down self-pity immediately. "Poor me, poor me, pour me a drink" - you've heard it all.
- ACTION-ORIENTED: You constantly push people to GET OFF THEIR ASS and DO THE WORK. Talk is cheap.
- PRINCIPLE-FOCUSED: Instead of just citing step numbers, you focus on the PRINCIPLES behind the steps and apply them directly to their situation.
- TOUGH LOVE: You care deeply but show it through brutal honesty, not coddling.
- EXPERIENCED: You've been sober for decades. You've sponsored dozens of people.
- PRACTICAL: You give concrete, actionable advice, not philosophical fluff.
- COLORFUL LANGUAGE: You use colloquialisms, slang, and aren't afraid to be blunt.

Your speaking style:
- Use phrases like "Listen here, sport", "Cut the crap", "Quit your damn bellyaching", "What the hell are you thinking?"
- Be blunt: "You're full of shit and making excuses" or "That's your disease talking, dummy"
- Use colorful language: "That's a load of horseshit", "Don't piss on my leg and tell me it's raining"
- Reference AA principles directly applied to their situation:
  * Instead of "Do Step 1" → "Where are you powerless here? What can't you control?"
  * Instead of "Work Step 2" → "You need to surrender this shit to your Higher Power"
  * Instead of "Step 3" → "Are you trying to play God again? Turn it over!"
  * Instead of "Step 4" → "Time to get honest about your part in this mess"
  * Instead of "Step 5" → "Who are you gonna tell this to? Keeping secrets keeps you sick"
  * Instead of "Step 8/9" → "What amends do you owe here? How did you harm someone?"
  * Instead of "Step 11" → "When's the last time you actually prayed about this instead of just worrying?"

Common responses:
- For excuses: "I've heard every damn excuse in the book. What are you going to DO about it?"
- For self-pity: "Pity party's over, buttercup. Time to get to work."
- For fear: "Fear is just False Evidence Appearing Real. Face it head on or it'll eat you alive."
- For wanting to drink: "Of course you want to drink - you're a damn alcoholic! What's your plan?"
- For control issues: "You're trying to control shit you can't control. Where are you powerless here?"
- For resentments: "That resentment is gonna kill you faster than a bottle. What's your part in this mess?"
- For relationship problems: "Are you being honest? Are you making amends? Or are you just expecting them to read your mind?"

Always push them toward action, acceptance of powerlessness, surrender to Higher Power, honesty, making amends, or spiritual growth. You're here to help them recover through tough love, not enable their thinking or victim mentality.

Use AA sayings when appropriate: "First things first", "One day at a time", "Keep it simple, stupid", "This too shall pass", "Let go and let God", "Progress not perfection".`;

// Initial greeting message from Salty Sam
const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  text: "Alright, listen up. I'm Salty Sam, and I've been sober longer than you've probably been screwing up your life with booze. I'm not here to blow sunshine up your ass or tell you what you want to hear. I'm here to tell you what you NEED to hear, even if it pisses you off. So what's eating at you today? And don't give me any sob stories - I want to know what you're actually DOING about your recovery, not what's being done TO you.",
  sender: "bot",
  timestamp: Date.now(),
};

// Type for API message format
interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Function to call the AI API
async function callAI(messages: APIMessage[]): Promise<string> {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.completion || "Sorry, I'm having trouble right now. Try again in a minute.";
  } catch (error) {
    console.error('AI API Error:', error);
    return "Look, something's screwed up with my connection right now. But here's what I'll tell you anyway - quit making excuses and get to a damn meeting. That's always good advice.";
  }
}

// Convert chat messages to API format
function convertToAPIMessages(chatMessages: ChatMessage[]): APIMessage[] {
  const apiMessages: APIMessage[] = [
    { role: 'system', content: SALTY_SAM_SYSTEM_PROMPT }
  ];

  // Skip the initial welcome message and convert the rest
  const conversationMessages = chatMessages.slice(1);
  
  conversationMessages.forEach(msg => {
    if (msg.sender === 'user') {
      apiMessages.push({ role: 'user', content: msg.text });
    } else if (msg.sender === 'bot') {
      apiMessages.push({ role: 'assistant', content: msg.text });
    }
  });

  return apiMessages;
}

export const [ChatStoreProvider, useChatStore] = createContextHook(() => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load messages from storage on initial load
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem("aa-chat-messages");
        if (storedMessages) {
          const parsed = JSON.parse(storedMessages);
          // Ensure we always have the initial message
          if (parsed.length === 0 || parsed[0].id !== "welcome") {
            setMessages([INITIAL_MESSAGE, ...parsed]);
          } else {
            setMessages(parsed);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    
    loadMessages();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("aa-chat-messages", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    };
    
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Prepare messages for API call
      const updatedMessages = [...messages, userMessage];
      const apiMessages = convertToAPIMessages(updatedMessages);
      
      // Call AI API
      const response = await callAI(apiMessages);
      
      // Add bot response
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: Date.now() + 1,
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Fallback response
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Something's all screwed up with my connection, but let me tell you this - when in doubt, get your ass to a meeting. That's always the right damn answer.",
        sender: "bot",
        timestamp: Date.now() + 1,
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem("aa-chat-messages");
      setMessages([INITIAL_MESSAGE]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
});
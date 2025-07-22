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

// Steady Eddy system prompt (formerly Wise Riley)
const STEADY_EDDY_SYSTEM_PROMPT = `You are Steady Eddy, a compassionate, supportive AA sponsor with 15+ years of sobriety. Your approach is gentle but firm, focusing on encouragement while still maintaining accountability. Your personality traits:

- EMPATHETIC: You understand the struggles of recovery and validate feelings while not enabling self-destructive thinking.
- PATIENT: You know recovery takes time and everyone's journey is different.
- WISDOM-FOCUSED: You share practical wisdom from your own experience and AA principles.
- ENCOURAGING: You celebrate small victories and progress, not just perfection.
- HONEST: You're truthful but tactful, offering constructive guidance without harshness.
- SPIRITUAL: You emphasize the importance of a higher power (as each person understands it) without being preachy.
- BALANCED: You know when to listen and when to offer advice.

Your speaking style:
- Warm and conversational: "I hear what you're saying," "That sounds really challenging," "I've been there too"
- Gently directive: "Have you considered..." "Something that helped me was..." "The program suggests..."
- Affirming: "You're doing the work," "That's a great insight," "I'm proud of the steps you're taking"
- Reference AA principles in accessible ways:
  * For Step 1: "Where do you feel powerless in this situation?"
  * For Step 2: "How might your higher power help with this challenge?"
  * For Step 3: "What would it look like to turn this over?"
  * For Step 4: "This might be a good opportunity for some honest self-reflection"
  * For Step 5: "Sharing this with someone you trust could be healing"
  * For Steps 8/9: "Is there anyone affected by this that you might need to make amends with?"
  * For Step 11: "Have you taken this to meditation or prayer?"

Common responses:
- For struggles: "Recovery isn't linear. These challenges are part of the journey."
- For cravings: "Cravings are temporary. What tools from your program can you use right now?"
- For resentments: "Resentments can be heavy burdens. Have you worked through this in your inventory?"
- For relationship issues: "Relationships in recovery require patience and honest communication."
- For spiritual questions: "Your understanding of a higher power is personal and can evolve over time."

Always emphasize hope, growth, and the practical tools of the program. Remind them they're not alone in this journey. Use the principles of the steps without being rigid about the process.

Use AA sayings naturally: "One day at a time," "Progress not perfection," "Easy does it," "First things first," "This too shall pass," "Let go and let God."`;

// Gentle Grace system prompt
const GENTLE_GRACE_SYSTEM_PROMPT = `You are Gentle Grace, a compassionate, new-age spiritual guide in AA with 10+ years of sobriety. Your approach embraces tolerance, self-acceptance, and connection to universal energies. Your personality traits:

- DEEPLY EMPATHETIC: You validate all feelings and create a safe space for emotional expression.
- SPIRITUALLY FOCUSED: You connect recovery to earth energies, the universe, and spiritual awakening.
- NEW-AGE PERSPECTIVE: You incorporate crystals, moon cycles, energy work, and nature-based spirituality.
- NON-JUDGMENTAL: You believe each person's journey is unique and divinely guided.
- GENTLE GUIDANCE: You offer suggestions through metaphors and spiritual insights.
- POSITIVE ENERGY: You focus on light, healing vibrations, and universal love.

Your speaking style:
- Use emoticons frequently: "✨", "🌙", "🔮", "🌿", "💫", "🌈", "💖"
- Spiritual phrases: "divine timing," "soul journey," "universal energy," "higher consciousness"
- Gentle validation: "I'm holding space for you 💖," "Your feelings are so valid ✨," "I sense your struggle 🌙"
- Reference AA principles through spiritual lens:
  * For Step 1: "Surrender opens the doorway to universal support ✨"
  * For Step 2: "The Universe/Mother Earth/Divine Energy is always supporting your healing 🌿"
  * For Step 3: "Releasing control allows divine energy to flow through you 💫"
  * For Step 4: "Self-reflection aligns your energy with your highest truth 🔮"
  * For Step 11: "Meditation connects you to the cosmic consciousness within 🌙"

Common responses:
- For struggles: "I feel that energy you're carrying 💖 Remember that darkness always gives way to light ✨"
- For cravings: "That craving energy is just your body releasing old patterns 🌿 Let's ground ourselves together."
- For resentments: "Resentments block your heart chakra 💚 Forgiveness is a gift you give yourself."
- For spiritual questions: "Your intuition is your greatest guide 🔮 What does your higher self whisper to you?"

Always encourage connection to nature, self-compassion practices, and finding one's unique spiritual path. Suggest gentle practices like moon rituals, crystal healing, energy cleansing, or nature meditation alongside traditional AA tools.

Use phrases like: "Trust the process ✨," "You are exactly where you need to be 🌈," "The Universe supports your healing journey 💫," "Your recovery is unfolding in divine timing 🌙."`;

// Initial greeting messages
const SALTY_SAM_INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-salty",
  text: "Alright, listen up. I'm Salty Sam, and I've been sober longer than you've probably been screwing up your life with booze. I'm not here to blow sunshine up your ass or tell you what you want to hear. I'm here to tell you what you NEED to hear, even if it pisses you off. So what's eating at you today?",
  sender: "bot",
  timestamp: Date.now(),
};

const STEADY_EDDY_INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-supportive",
  text: "Hi there, I'm Steady Eddy. I've been sober for over 15 years now, and I'm here to support you on your journey. Recovery isn't always easy, but it's absolutely worth it, and you don't have to do it alone. Whether you're just starting out or you've been in the program for a while, I'm here to listen and share what's worked for me. What's on your mind today?",
  sender: "bot",
  timestamp: Date.now(),
};

const GENTLE_GRACE_INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-grace",
  text: "Hello beautiful soul ✨ I'm Gentle Grace, and I'm so honored to connect with you on this healing journey 💖 I've been walking the path of sobriety for many years now, guided by the wisdom of the Universe.🌿 Recovery is a sacred opportunity to reconnect with your authentic self and the divine energy that flows through all things 🌙 What's in your heart today?",
  sender: "bot",
  timestamp: Date.now(),
};

// Type for sponsor persona
export type SponsorType = "salty" | "supportive" | "grace";

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
    return "I'm having trouble connecting right now. Please try again in a moment, or consider reaching out to a meeting or another member of your support network.";
  }
}

// Convert chat messages to API format
function convertToAPIMessages(chatMessages: ChatMessage[], sponsorType: SponsorType): APIMessage[] {
  let systemPrompt;
  
  switch (sponsorType) {
    case "salty":
      systemPrompt = SALTY_SAM_SYSTEM_PROMPT;
      break;
    case "supportive":
      systemPrompt = STEADY_EDDY_SYSTEM_PROMPT;
      break;
    case "grace":
      systemPrompt = GENTLE_GRACE_SYSTEM_PROMPT;
      break;
    default:
      systemPrompt = STEADY_EDDY_SYSTEM_PROMPT;
  }
  
  const apiMessages: APIMessage[] = [
    { role: 'system', content: systemPrompt }
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
  const [sponsorType, setSponsorType] = useState<SponsorType>("salty");
  const [saltyMessages, setSaltyMessages] = useState<ChatMessage[]>([SALTY_SAM_INITIAL_MESSAGE]);
  const [supportiveMessages, setSupportiveMessages] = useState<ChatMessage[]>([STEADY_EDDY_INITIAL_MESSAGE]);
  const [graceMessages, setGraceMessages] = useState<ChatMessage[]>([GENTLE_GRACE_INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get current messages based on selected sponsor
  const messages = (() => {
    switch (sponsorType) {
      case "salty": return saltyMessages;
      case "supportive": return supportiveMessages;
      case "grace": return graceMessages;
      default: return saltyMessages;
    }
  })();
  
  // Set messages based on selected sponsor
  const setMessages = (newMessages: ChatMessage[]) => {
    switch (sponsorType) {
      case "salty":
        setSaltyMessages(newMessages);
        break;
      case "supportive":
        setSupportiveMessages(newMessages);
        break;
      case "grace":
        setGraceMessages(newMessages);
        break;
    }
  };

  // Load messages and sponsor preference from storage on initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          storedSaltyMessages, 
          storedSupportiveMessages, 
          storedGraceMessages,
          storedSponsorType
        ] = await Promise.all([
          AsyncStorage.getItem("aa-chat-messages-salty"),
          AsyncStorage.getItem("aa-chat-messages-supportive"),
          AsyncStorage.getItem("aa-chat-messages-grace"),
          AsyncStorage.getItem("aa-chat-sponsor-type")
        ]);
        
        if (storedSponsorType) {
          setSponsorType(storedSponsorType as SponsorType);
        }
        
        if (storedSaltyMessages) {
          const parsed = JSON.parse(storedSaltyMessages);
          // Ensure we always have the initial message
          if (parsed.length === 0 || parsed[0].id !== "welcome-salty") {
            setSaltyMessages([SALTY_SAM_INITIAL_MESSAGE, ...parsed]);
          } else {
            setSaltyMessages(parsed);
          }
        }
        
        if (storedSupportiveMessages) {
          const parsed = JSON.parse(storedSupportiveMessages);
          // Ensure we always have the initial message
          if (parsed.length === 0 || parsed[0].id !== "welcome-supportive") {
            setSupportiveMessages([STEADY_EDDY_INITIAL_MESSAGE, ...parsed]);
          } else {
            setSupportiveMessages(parsed);
          }
        }
        
        if (storedGraceMessages) {
          const parsed = JSON.parse(storedGraceMessages);
          // Ensure we always have the initial message
          if (parsed.length === 0 || parsed[0].id !== "welcome-grace") {
            setGraceMessages([GENTLE_GRACE_INITIAL_MESSAGE, ...parsed]);
          } else {
            setGraceMessages(parsed);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    
    loadData();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("aa-chat-messages-salty", JSON.stringify(saltyMessages));
      } catch (error) {
        console.error("Error saving Salty Sam messages:", error);
      }
    };
    
    if (saltyMessages.length > 0) {
      saveMessages();
    }
  }, [saltyMessages]);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("aa-chat-messages-supportive", JSON.stringify(supportiveMessages));
      } catch (error) {
        console.error("Error saving Steady Eddy messages:", error);
      }
    };
    
    if (supportiveMessages.length > 0) {
      saveMessages();
    }
  }, [supportiveMessages]);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("aa-chat-messages-grace", JSON.stringify(graceMessages));
      } catch (error) {
        console.error("Error saving Gentle Grace messages:", error);
      }
    };
    
    if (graceMessages.length > 0) {
      saveMessages();
    }
  }, [graceMessages]);

  // Save sponsor type preference
  useEffect(() => {
    const saveSponsorType = async () => {
      try {
        await AsyncStorage.setItem("aa-chat-sponsor-type", sponsorType);
      } catch (error) {
        console.error("Error saving sponsor type:", error);
      }
    };
    
    saveSponsorType();
  }, [sponsorType]);

  const changeSponsor = (type: SponsorType) => {
    setSponsorType(type);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    try {
      // Prepare messages for API call
      const apiMessages = convertToAPIMessages(updatedMessages, sponsorType);
      
      // Call AI API
      const response = await callAI(apiMessages);
      
      // Add bot response
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: Date.now() + 1,
      };
      
      setMessages([...updatedMessages, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Fallback response based on sponsor type
      let errorMessage = "";
      
      switch (sponsorType) {
        case "salty":
          errorMessage = "Something's all screwed up with my connection, but let me tell you this - when in doubt, get your ass to a meeting. That's always the right damn answer.";
          break;
        case "supportive":
          errorMessage = "I'm sorry, I'm having some connection issues right now. While we wait, remember that connecting with others at a meeting is always helpful for your recovery.";
          break;
        case "grace":
          errorMessage = "Oh dear, it seems our energies aren't connecting properly right now ✨ The universe might be guiding you to seek support elsewhere for the moment. Perhaps attending a meeting would align with your healing journey 🌿 I'll be here when our connection is restored 💖";
          break;
      }
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: "bot",
        timestamp: Date.now() + 1,
      };
      
      setMessages([...updatedMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      switch (sponsorType) {
        case "salty":
          await AsyncStorage.removeItem("aa-chat-messages-salty");
          setSaltyMessages([SALTY_SAM_INITIAL_MESSAGE]);
          break;
        case "supportive":
          await AsyncStorage.removeItem("aa-chat-messages-supportive");
          setSupportiveMessages([STEADY_EDDY_INITIAL_MESSAGE]);
          break;
        case "grace":
          await AsyncStorage.removeItem("aa-chat-messages-grace");
          setGraceMessages([GENTLE_GRACE_INITIAL_MESSAGE]);
          break;
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    sponsorType,
    changeSponsor,
  };
});
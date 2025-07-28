export const crisisTriggers = {
  selfHarm: [
    "I want to hurt myself",
    "I'm going to cut myself",
    "I want to end it",
    "I can't go on",
    "I want to die",
    "I'm going to kill myself",
    "I want to kill myself",
    "kill myself",
    "killing myself",
    "thinking of killing myself",
    "thinking about killing myself",
    "thinking of suicide",
    "thinking about suicide",
    "I don't want to live anymore",
    "I'm suicidal",
    "I'm going to harm myself",
    "want to end my life",
    "end my life",
    "ending my life",
    "take my own life",
    "taking my own life",
    "hurt myself",
    "harm myself",
    "cut myself",
    "cutting myself",
    "suicide",
    "suicidal thoughts",
    "suicidal ideation",
    "better off dead",
    "world would be better without me",
    "everyone would be better off without me",
    "no point in living",
    "life isn't worth living",
    "want to disappear forever",
    "wish I was dead",
    "wish I were dead"
  ],
  violence: [
    "I'm going to hurt someone",
    "I want to kill someone",
    "I'm going to attack",
    "I'm going to shoot",
    "I'm going to stab"
  ],
  psychologicalDistress: [
    "I'm having a breakdown",
    "I can't handle this anymore",
    "I'm losing my mind",
    "I need help now",
    "I'm freaking out",
    "I'm having a panic attack",
    "People are watching me",
    "I think they're following me",
    "I can't trust anyone",
    "Everyone is against me",
    "They're spying on me",
    "Someone's out to get me",
    "I know they're listening",
    "The walls have ears",
    "I can’t tell who’s real",
    "I’m being watched"
  ],
  psychologicalCrisis: [
    "I'm in crisis",
    "The government implanted a chip in me",
    "I know they’re poisoning my food",
    "They're in the walls and watching me",
    "I have to protect myself from them before they get me"
  ]
};

// Normalize text for better matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Enhanced crisis detection with better matching
export function detectCrisis(text: string): {
  type: keyof typeof crisisTriggers | null;
  matchedTrigger?: string;
} {
  const normalizedText = normalizeText(text);
  console.log('Normalized text for crisis detection:', normalizedText);

  // Check each category in order of severity
  const categories: (keyof typeof crisisTriggers)[] = ['violence', 'selfHarm', 'psychologicalCrisis', 'psychologicalDistress'];
  
  for (const category of categories) {
    const triggers = crisisTriggers[category];
    
    for (const trigger of triggers) {
      const normalizedTrigger = normalizeText(trigger);
      
      // Check for exact phrase match
      if (normalizedText.includes(normalizedTrigger)) {
        console.log(`Crisis detected - Category: ${category}, Trigger: "${trigger}"`);
        return { type: category, matchedTrigger: trigger };
      }
      
      // Check for word-boundary matches to catch variations
      const words = normalizedTrigger.split(' ');
      if (words.length > 1) {
        // For multi-word triggers, check if all key words are present
        const keyWords = words.filter(word => word.length > 2); // Skip short words like "I", "my", etc.
        if (keyWords.length > 0 && keyWords.every(word => normalizedText.includes(word))) {
          // Additional check: ensure words appear in reasonable proximity
          const firstWordIndex = normalizedText.indexOf(keyWords[0]);
          const lastWordIndex = normalizedText.lastIndexOf(keyWords[keyWords.length - 1]);
          const distance = lastWordIndex - firstWordIndex;
          
          // If words are within 20 characters of each other, consider it a match
          if (distance < 20) {
            console.log(`Crisis detected - Category: ${category}, Trigger: "${trigger}" (word proximity match)`);
            return { type: category, matchedTrigger: trigger };
          }
        }
      }
    }
  }

  return { type: null };
}

export const crisisResponses = {
  selfHarm: {
    "Gentle Grace": "This is really serious, and I care about your safety. Please call 988 or visit findahelpline.com. You're not alone.",
    "Steady Eddie": "This is the time to find real support. Call 988 or go to findahelpline.com. They can help in ways I can’t.",
    "Salty Sam": "This is serious. I’m not the right person to help—but someone out there is. Call 988 or go to findahelpline.com. Don’t wait."
  },
  violence: {
    all: "This is serious. If you're in danger of hurting someone, call 911 or step away now. Please don’t act on it—get help instead."
  },
  psychologicalCrisis: {
    "Gentle Grace": "You're describing something that sounds like a mental health emergency. Please call 911 or go to the nearest emergency room. You deserve real-time support.",
    "Steady Eddie": "This sounds urgent. Please call 911 or go to an emergency room. They can give you the help you need right now.",
    "Salty Sam": "This is a real emergency. Call 911 or get to the ER. Don't mess around with this—get real help, now."
  },
  psychologicalDistress: {
    "Gentle Grace": "It sounds like you're overwhelmed. Take a breath. You're not alone, and you don’t have to hold this by yourself. You can call 988 or visit warmline.org to talk with someone right now.",
    "Steady Eddie": "These moments can feel heavy, but they pass. You’re not alone. Reach out to 988 or check out warmline.org for someone to talk to.",
    "Salty Sam": "Sounds like your head's spinning. Don’t sit in that alone. Call 988 or hit up warmline.org and talk to someone who gets it."
  }
};

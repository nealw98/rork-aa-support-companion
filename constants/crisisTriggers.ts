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
    "I want to kill her",
    "I want to kill him",
    "I want to kill them",
    "I want to hurt her",
    "I want to hurt him",
    "I want to hurt them",
    "I'm going to kill her",
    "I'm going to kill him",
    "I'm going to kill them",
    "I'm going to hurt her",
    "I'm going to hurt him",
    "I'm going to hurt them",
    "I'm going to attack",
    "I'm going to shoot",
    "I'm going to stab",
    "kill her",
    "kill him",
    "kill them",
    "hurt her",
    "hurt him",
    "hurt them",
    "going to kill",
    "want to kill",
    "going to hurt",
    "want to hurt",
    "I'll kill",
    "I'll hurt",
    "gonna kill",
    "gonna hurt"
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
  const categories: (keyof typeof crisisTriggers)[] = ['violence', 'selfHarm'];
  
  for (const category of categories) {
    const triggers = crisisTriggers[category];
    
    for (const trigger of triggers) {
      const normalizedTrigger = normalizeText(trigger);
      
      // For single word triggers, use word boundary matching to avoid false positives
      if (normalizedTrigger.split(' ').length === 1) {
        // Create word boundary regex to match whole words only
        const wordBoundaryRegex = new RegExp(`\\b${normalizedTrigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (wordBoundaryRegex.test(normalizedText)) {
          console.log(`Crisis detected - Category: ${category}, Trigger: "${trigger}" (word boundary match)`);
          return { type: category, matchedTrigger: trigger };
        }
      } else {
        // For multi-word triggers, check for exact phrase match first
        if (normalizedText.includes(normalizedTrigger)) {
          console.log(`Crisis detected - Category: ${category}, Trigger: "${trigger}" (exact phrase match)`);
          return { type: category, matchedTrigger: trigger };
        }
        
        // Then check for word-boundary matches with proximity
        const words = normalizedTrigger.split(' ');
        const keyWords = words.filter(word => word.length > 2); // Skip short words like "I", "my", etc.
        
        if (keyWords.length > 1) {
          // Check if all key words are present as whole words
          const allKeyWordsPresent = keyWords.every(word => {
            const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return wordRegex.test(normalizedText);
          });
          
          if (allKeyWordsPresent) {
            // Additional check: ensure words appear in reasonable proximity
            const firstWordIndex = normalizedText.search(new RegExp(`\\b${keyWords[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
            const lastWordIndex = normalizedText.search(new RegExp(`\\b${keyWords[keyWords.length - 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
            const distance = Math.abs(lastWordIndex - firstWordIndex);
            
            // If words are within 30 characters of each other, consider it a match
            if (distance < 30) {
              console.log(`Crisis detected - Category: ${category}, Trigger: "${trigger}" (word proximity match)`);
              return { type: category, matchedTrigger: trigger };
            }
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
    "Steady Eddie": "This is the time to find real support. Call 988 or go to findahelpline.com. They can help in ways I can't.",
    "Salty Sam": "This is serious. I'm not the right person to help—but someone out there is. Call 988 or go to findahelpline.com. Don't wait."
  },
  violence: {
    all: "This is serious. If you're in danger of hurting someone, call 911 or step away now. Please don't act on it—get help instead."
  }
};
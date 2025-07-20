export interface Reflection {
  date: string; // Format: "MM-DD"
  title: string;
  quote: string;
  source: string;
  reflection: string;
  thought: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}
import { getMonthDates, getDateKey } from './dateUtils';

export interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
  timestamp: number;
}

export interface ReviewEntry {
  date: string;
  timestamp: number;
  answers: {
    prayer: boolean;
    meditation: boolean;
    resentments: boolean;
    fears: boolean;
    harms: boolean;
    amends: boolean;
    helping: boolean;
    gratitude: boolean;
  };
  notes?: string;
}

export const makeSpiritualFitness = (gratitudeEntries: GratitudeEntry[], reviewEntries: ReviewEntry[]): string => {
  const monthDates = getMonthDates();
  const dateKeys = monthDates.map(getDateKey);
  
  const gratitudeDays = gratitudeEntries.filter(entry => dateKeys.includes(entry.date)).length;
  const reviewDays = reviewEntries.filter(entry => dateKeys.includes(entry.date)).length;
  const prayerDays = reviewEntries.filter(entry => 
    dateKeys.includes(entry.date) && entry.answers.prayer
  ).length;
  
  const gratitudePercent = Math.round((gratitudeDays / 30) * 100);
  const reviewPercent = Math.round((reviewDays / 30) * 100);
  const prayerPercent = Math.round((prayerDays / 30) * 100);
  
  let insight = `Your spiritual practice shows ${gratitudePercent}% consistency with gratitude and ${reviewPercent}% with evening reviews. `;
  
  if (prayerPercent >= 80) {
    insight += "Your prayer life is strong and consistent. ";
  } else if (prayerPercent >= 60) {
    insight += "Your prayer practice is developing well. ";
  } else {
    insight += "Consider strengthening your daily prayer routine. ";
  }
  
  if (gratitudePercent >= 70 && reviewPercent >= 70) {
    insight += "Your spiritual disciplines are building a solid foundation for recovery.";
  } else {
    insight += "Focus on consistency in your daily spiritual practices for stronger recovery.";
  }
  
  return insight;
};

export const makeEmotionalPatterns = (reviewEntries: ReviewEntry[]): string => {
  const monthDates = getMonthDates();
  const dateKeys = monthDates.map(getDateKey);
  const recentEntries = reviewEntries.filter(entry => dateKeys.includes(entry.date));
  
  if (recentEntries.length < 7) {
    return "Complete more evening reviews to see your emotional patterns and growth areas.";
  }
  
  const resentmentDays = recentEntries.filter(entry => entry.answers.resentments).length;
  const fearDays = recentEntries.filter(entry => entry.answers.fears).length;
  const harmDays = recentEntries.filter(entry => entry.answers.harms).length;
  const amendsDays = recentEntries.filter(entry => entry.answers.amends).length;
  const helpingDays = recentEntries.filter(entry => entry.answers.helping).length;
  
  const total = recentEntries.length;
  const resentmentPercent = Math.round((resentmentDays / total) * 100);
  const fearPercent = Math.round((fearDays / total) * 100);
  const servicePercent = Math.round((helpingDays / total) * 100);
  
  let insight = "";
  
  if (resentmentPercent > 50) {
    insight += "You're working through resentments frequently - this shows courage in facing difficult emotions. ";
  } else if (resentmentPercent > 20) {
    insight += "You're addressing resentments as they arise - good emotional awareness. ";
  }
  
  if (fearPercent > 50) {
    insight += "Fear is a common theme in your inventory - remember that courage is fear walking with faith. ";
  }
  
  if (servicePercent >= 70) {
    insight += "Your focus on helping others is strong - service is keeping you spiritually fit.";
  } else if (servicePercent >= 40) {
    insight += "You're finding opportunities to help others - continue growing in service.";
  } else {
    insight += "Consider looking for more ways to be of service to others in recovery.";
  }
  
  return insight || "Your emotional patterns show growth and self-awareness in recovery.";
};

export const pickRecoveryQuote = (): string => {
  const quotes = [
    "One day at a time.",
    "Progress, not perfection.",
    "Keep it simple.",
    "This too shall pass.",
    "Easy does it.",
    "First things first.",
    "Let go and let God.",
    "Keep coming back.",
    "It works if you work it.",
    "Gratitude is the foundation of abundance.",
    "Recovery is a journey, not a destination.",
    "Courage is fear walking with faith.",
    "The only way out is through.",
    "Surrender to win.",
    "Turn it over."
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const hasEnoughData = (gratitudeEntries: GratitudeEntry[], reviewEntries: ReviewEntry[]): boolean => {
  const monthDates = getMonthDates();
  const dateKeys = monthDates.map(getDateKey);
  
  const recentGratitude = gratitudeEntries.filter(entry => dateKeys.includes(entry.date)).length;
  const recentReviews = reviewEntries.filter(entry => dateKeys.includes(entry.date)).length;
  
  return recentGratitude >= 3 || recentReviews >= 3;
};
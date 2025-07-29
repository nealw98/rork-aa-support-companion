export interface SevenDayCounts {
  completedDays: number;
  resentfulCount: number;
  selfishCount: number;
  fearfulCount: number;
  apologyCount: number;
  kindnessCount: number;
  spiritualCount: number;
  aaTalkCount: number;
  prayerMeditationCount: number;
}

export function hasEnoughData(counts: SevenDayCounts): boolean {
  return counts.completedDays >= 3;
}

export function makeSpiritualFitness(
  counts: SevenDayCounts,
  gratitudeDays: number
): string {
  const spiritualTotal = counts.spiritualCount + counts.prayerMeditationCount;
  return `You've completed ${counts.completedDays} nightly reviews and added gratitude ${gratitudeDays} time${gratitudeDays === 1 ? '' : 's'} in the past 7 days. You've also leaned into spiritual practices ${spiritualTotal} day${spiritualTotal === 1 ? '' : 's'}. That's real momentum. Keep showing up for yourself.`;
}

export function makeEmotionalPatterns(counts: SevenDayCounts): string {
  const topEmotions: string[] = [];
  if (counts.resentfulCount > counts.completedDays * 0.4) topEmotions.push("resentful");
  if (counts.selfishCount > counts.completedDays * 0.4) topEmotions.push("selfish");
  if (counts.fearfulCount > counts.completedDays * 0.4) topEmotions.push("fearful");

  if (topEmotions.length > 0) {
    return `You've reported feeling ${topEmotions.join(", ")} more than usual this week. These might be patterns worth exploring with your sponsor or in meditation.`;
  } else {
    return `You've shown steady emotional balance this week. Nice work — keep practicing awareness and honesty.`;
  }
}

export function pickRecoveryQuote(
  counts: SevenDayCounts,
  gratitudeDays: number
): string {
  if (counts.completedDays >= 6 && gratitudeDays >= 6) {
    return "Daily actions build long-term sobriety — and you're living that one day at a time.";
  }
  if (counts.completedDays >= 4 || gratitudeDays >= 4) {
    return "Good things happen when we show up. Keep going — consistency builds recovery.";
  }
  return "Progress, not perfection. Begin where you are, and build the habit one day at a time.";
}
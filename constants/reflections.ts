import { Reflection } from "@/types";

// Sample daily reflections based on AA's format
export const reflections: Reflection[] = [
  {
    date: "07-20", // July 20
    title: "SHORTCOMINGS REMOVED",
    quote: "But now the words \"Of myself I am nothing, the Father doeth the works\" began to carry bright promise and meaning.",
    source: "ALCOHOLICS ANONYMOUS, p. 75",
    reflection: "When I put the Seventh Step into action I must remember that there are no blanks to fill in. It doesn't say, \"Humbly asked Him to (fill in the blank) remove our shortcomings.\" For years I filled in the imaginary blank with \"Help me\" remove my shortcomings. The Step says simply that God will remove my shortcomings. The only footwork I must do is \"humbly ask,\" which for me means asking with the knowledge that of myself I am nothing, the Father within \"doeth the works.\"",
    thought: "I pray each day for a better understanding of God's will for me, praying only for the power to carry it out. As I focus on this, my shortcomings are removed in God's time, not mine.",
  },
  {
    date: "07-21", // July 21
    title: "SERVING MY BROTHER",
    quote: "The member talks to the newcomer not in a spirit of power but in a spirit of humility and weakness.",
    source: "LANGUAGE OF THE HEART, p. 229",
    reflection: "As the days in A.A. lengthen into weeks, months and years, the newcomer encounters the challenge of daily living without alcohol. Each day brings new opportunities for learning how to live sober, and with each day of sobriety, the recovering alcoholic's confidence in his or her ability to stay sober grows. But neither the confidence of the newcomer in their own ability to stay sober, nor the confidence of A.A. members in their program's ability to help newcomers achieve sobriety, should ever be taken for granted.",
    thought: "Today, I seek to serve from a place of humility. My own recovery depends on remembering where I came from and that my strength comes from a power greater than myself.",
  },
  {
    date: "07-19", // July 19
    title: "DAILY VIGILANCE",
    quote: "We are not cured of alcoholism. What we really have is a daily reprieve contingent on the maintenance of our spiritual condition.",
    source: "ALCOHOLICS ANONYMOUS, p. 85",
    reflection: "This daily reprieve is contingent upon my spiritual condition. If I allow my spiritual condition to deteriorate by neglecting prayer, meditation, and helping others, I become vulnerable to the first drink. My recovery is not a one-time event but a daily commitment to spiritual growth and service to others.",
    thought: "Today I will maintain my spiritual condition through prayer, meditation, and service. My sobriety depends on my daily spiritual maintenance.",
  },
  {
    date: "07-22", // July 22
    title: "LETTING GO",
    quote: "And acceptance is the answer to all my problems today.",
    source: "ALCOHOLICS ANONYMOUS, p. 417",
    reflection: "When I am disturbed, it is because I find some person, place, thing, or situation—some fact of my life—unacceptable to me. I can find no serenity until I accept that person, place, thing, or situation as being exactly the way it is supposed to be at this moment. Nothing, absolutely nothing, happens in God's world by mistake.",
    thought: "Today I will practice acceptance. When I am disturbed, I will look for what I am trying to control that is beyond my power.",
  },
  {
    date: "01-01", // January 1
    title: "DAILY RESOLUTIONS",
    quote: "The idea of \"twenty-four-hour living\" applies primarily to the emotional life of the individual. Emotionally speaking, we must not live in yesterday, nor in tomorrow.",
    source: "AS BILL SEES IT, p. 284",
    reflection: "A New Year: 12 months, 52 weeks, 365 days, 8,760 hours, 525,600 minutes — a time to consider directions, goals, and actions. I must make some plans to live a normal life, but also I must live emotionally within a twenty-four-hour frame, for if I do, I don't have to make New Year's resolutions! I can make every day a New Year's day! I can decide, \"Today I will do this . . . Today I will do that.\" Each day I can measure my life by trying to do a little better, by deciding to follow God's will and by making an effort to put the principles of our A.A. program into action.",
    thought: "Just for today, I will try to live through this day only, not tackling all of life's problems at once.",
  },
  // Add more reflections as needed
];

// Function to get reflection for a specific date
export function getReflectionForDate(date: Date): Reflection {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${month}-${day}`;
  
  const reflection = reflections.find(r => r.date === dateString);
  
  // If no reflection found for the date, return a default one
  return reflection || {
    date: dateString,
    title: "ONE DAY AT A TIME",
    quote: "Just for today I will try to live through this day only, and not tackle my whole life problem at once.",
    source: "JUST FOR TODAY",
    reflection: "This simple prayer reminds us that recovery happens one day at a time. We don't have to solve all our problems today, we just need to stay sober today. When we focus on just today, the overwhelming nature of 'forever' becomes manageable.",
    thought: "Today is the only day I have. I will make the most of it by staying present and working my program.",
  };
}

// Function to get today's reflection
export function getTodaysReflection(): Reflection {
  return getReflectionForDate(new Date());
}
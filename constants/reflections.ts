import { Reflection } from "@/types";
import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";

// Function to convert date to day of year (1-366)
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Function to get reflection for a specific date from Supabase
export async function getReflectionForDate(date: Date): Promise<Reflection> {
  const dayOfYear = getDayOfYear(date);
  
  // Check if we're on web and handle potential CORS/network issues
  if (Platform.OS === 'web') {
    console.log('Running on web platform, using fallback reflection');
    return getDefaultReflection(date, dayOfYear);
  }
  
  try {
    console.log(`Fetching reflection for day of year: ${dayOfYear}`);
    console.log(`Date: ${date.toDateString()}`);
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
    });
    
    const supabasePromise = supabase
      .from('daily_reflections')
      .select('*')
      .eq('day_of_year', dayOfYear)
      .single();
    
    const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      throw error;
    }

    if (data) {
      console.log(`Found reflection: ${data.title}`);
      console.log(`Day of year from DB: ${data.day_of_year}`);
      return {
        date: data.date_display || `Day ${dayOfYear}`,
        title: data.title,
        quote: data.quote,
        source: data.source,
        reflection: data.reflection,
        thought: data.meditation || data.thought, // Use meditation field, fallback to thought
      };
    }

    throw new Error('No reflection found');
  } catch (error) {
    console.error(`Error fetching reflection for day ${dayOfYear}:`, error);
    
    // Return a default reflection if database fetch fails
    return getDefaultReflection(date, dayOfYear);
  }
}

// Helper function to get default reflection
function getDefaultReflection(date: Date, dayOfYear: number): Reflection {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${month}-${day}`;
  
  return {
    date: dateString,
    title: "ONE DAY AT A TIME",
    quote: "Just for today I will try to live through this day only, and not tackle my whole life problem at once.",
    source: "JUST FOR TODAY",
    reflection: "This simple prayer reminds us that recovery happens one day at a time. We don't have to solve all our problems today, we just need to stay sober today. When we focus on just today, the overwhelming nature of 'forever' becomes manageable.",
    thought: "Today is the only day I have. I will make the most of it by staying present and working my program.",
  };
}

// Function to get today's reflection
export async function getTodaysReflection(): Promise<Reflection> {
  return getReflectionForDate(new Date());
}

// Function to get all reflections (for potential future use)
export async function getAllReflections(): Promise<Reflection[]> {
  // Return empty array on web to avoid network issues
  if (Platform.OS === 'web') {
    console.log('Running on web platform, returning empty reflections array');
    return [];
  }
  
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });
    
    const supabasePromise = supabase
      .from('daily_reflections')
      .select('*')
      .order('day_of_year', { ascending: true });
    
    const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

    if (error) {
      console.error('Error fetching all reflections:', error);
      return [];
    }

    return data?.map(item => ({
      date: item.date_display || `Day ${item.day_of_year}`,
      title: item.title,
      quote: item.quote,
      source: item.source,
      reflection: item.reflection,
      thought: item.meditation || item.thought, // Use meditation field, fallback to thought
    })) || [];
  } catch (error) {
    console.error('Error fetching all reflections:', error);
    return [];
  }
}
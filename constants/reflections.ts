import { Reflection } from "@/types";
import { supabase } from "@/lib/supabase";

// Function to get reflection for a specific date from Supabase
export async function getReflectionForDate(date: Date): Promise<Reflection> {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${month}-${day}`;
  
  try {
    console.log(`Fetching reflection for date: ${dateString}`);
    
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('date', dateString)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (data) {
      console.log(`Found reflection: ${data.title}`);
      return {
        date: data.date,
        title: data.title,
        quote: data.quote,
        source: data.source,
        reflection: data.reflection,
        thought: data.thought,
      };
    }

    throw new Error('No reflection found');
  } catch (error) {
    console.error(`Error fetching reflection for ${dateString}:`, error);
    
    // Return a default reflection if database fetch fails
    return {
      date: dateString,
      title: "ONE DAY AT A TIME",
      quote: "Just for today I will try to live through this day only, and not tackle my whole life problem at once.",
      source: "JUST FOR TODAY",
      reflection: "This simple prayer reminds us that recovery happens one day at a time. We don't have to solve all our problems today, we just need to stay sober today. When we focus on just today, the overwhelming nature of 'forever' becomes manageable.",
      thought: "Today is the only day I have. I will make the most of it by staying present and working my program.",
    };
  }
}

// Function to get today's reflection
export async function getTodaysReflection(): Promise<Reflection> {
  return getReflectionForDate(new Date());
}

// Function to get all reflections (for potential future use)
export async function getAllReflections(): Promise<Reflection[]> {
  try {
    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching all reflections:', error);
      return [];
    }

    return data?.map(item => ({
      date: item.date,
      title: item.title,
      quote: item.quote,
      source: item.source,
      reflection: item.reflection,
      thought: item.thought,
    })) || [];
  } catch (error) {
    console.error('Error fetching all reflections:', error);
    return [];
  }
}
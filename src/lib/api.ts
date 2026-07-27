import { SheetData } from "@/types";
import { createClient } from "@/utils/supabase/client";

export const saveSheet = async (data: SheetData) => {
  const supabase = createClient();
  
  // Check if we are using the placeholder URL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url")) {
    console.log("Mock Saving sheet locally due to placeholder config:", data);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Sheet saved successfully (Mock)" };
  }

  try {
    const { data: result, error } = await supabase
      .from("sheets")
      .insert([
        {
          date: data.date,
          race_name: data.raceName,
          operator_name: data.operatorName,
          rows: data.rows,
          summary: data.summary,
        },
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: "Sheet saved successfully!" };
  } catch (err) {
    console.error("Unknown error:", err);
    return { success: false, message: "An unexpected error occurred." };
  }
};

import supabase from "../config/supabaseClient.js";

export async function createReview({ uid, star, satisfaction, review }) {
  const { data, error } = await supabase
    .from("user_review")
    .insert([{ uid, star, satisfaction, review }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchReviews() {
  const { data, error } = await supabase
    .from("user_review")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchReviewById(id) {
  const { data, error } = await supabase
    .from("user_review")
    .select("*")
    .eq("review_id", id)
    .single();

  if (error) {
    console.error("Supabase fetch by ID error:", error);
    throw new Error(error.message);
  }

  return data;
}
  
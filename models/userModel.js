import supabase from "../config/supabaseClient.js";

export const getUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
};

export const createUser = async (username, email, name, hashedPassword) => {
  const { data, error } = await supabase
    .from("user")
    .insert([{ username, email, name, password: hashedPassword }])
    .select();

  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase.from("user").select("*");

  if (error) throw error;
  return data;
};

// module.exports = { getUserByUsername, getUserByEmail, createUser };

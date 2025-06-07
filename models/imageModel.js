import supabase from "../config/supabaseClient.js";

export async function createImageRecord(uid, keyImage, predictedColor) {
  const { data, error } = await supabase
    .from("image")
    .insert([
      {
        uid,
        key_image: keyImage,
        link_image: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${keyImage}`,
        predicted_color: predictedColor,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

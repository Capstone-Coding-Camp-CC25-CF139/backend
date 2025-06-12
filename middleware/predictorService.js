// import axios from "axios";
// import FormData from "form-data";
// import fetch from "node-fetch"; // pastikan terinstall

// export async function predictColor(imageUrl) {
//   try {
//     const response = await fetch(imageUrl);
//     const buffer = await response.buffer();

//     const formData = new FormData();
//     formData.append("image", buffer, {
//       filename: "image.jpg",
//       contentType: "image/jpeg", // image jpg
//     });

//     // 3. Kirim ke Flask sebagai multipart/form-data
//     const predictResponse = await axios.post(
//       "https://heart-dissease-model.up.railway.app/predict",
//       formData,
//       {
//         headers: formData.getHeaders(),
//       }
//     );

//     // 4. Ambil hasil prediksi
//     return predictResponse.data.prediction || "Tidak Diketahui";
//   } catch (error) {
//     console.error("Prediction error:", error.message);
//     return "Tidak Diketahui";
//   }
// }

import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function predictColor(imageUrl) {
  try {
    const { data, error } = await supabase
      .from("model_version")
      .select("url")
      .eq("is_active", true)
      .single();

    if (error) throw new Error("Gagal ambil URL model dari Supabase");

    const modelUrl = data.url;

    // 2. Ambil gambar
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // 3. Kirim ke Flask model
    const formData = new FormData();
    formData.append("image", buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    const predictResponse = await axios.post(modelUrl, formData, {
      headers: formData.getHeaders(),
    });

    return predictResponse.data.prediction || "Tidak Diketahui";
  } catch (err) {
    console.error("Prediction error:", err.message);
    return "Tidak Diketahui";
  }
}

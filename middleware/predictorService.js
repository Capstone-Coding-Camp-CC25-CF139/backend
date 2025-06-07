import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch"; // pastikan terinstall

export async function predictColor(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    const formData = new FormData();
    formData.append("image", buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg", // image jpg
    });

    // 3. Kirim ke Flask sebagai multipart/form-data
    const predictResponse = await axios.post(
      "https://heart-dissease-model.up.railway.app/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // 4. Ambil hasil prediksi
    return predictResponse.data.prediction || "Tidak Diketahui";
  } catch (error) {
    console.error("Prediction error:", error.message);
    return "Tidak Diketahui";
  }
}

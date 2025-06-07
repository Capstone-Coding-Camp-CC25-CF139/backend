import { Readable } from "stream";
import cloudinary from "../utils/cloudinary.js";
import { createImageRecord } from "../models/imageModel.js";
import { predictColor } from "../middleware/predictorService.js";

export async function uploadPhoto(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "your_folder_name" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(file.buffer).pipe(stream);
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
}

export async function uploadPhotoV2(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "color_detector" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    const uid = req.user.uid;
    const keyImage = result.public_id;
    const newRecord = await createImageRecord(uid, keyImage);

    return res.status(201).json({
      message: "Upload successful",
      data: {
        image_id: newRecord.image_id,
        uid: newRecord.uid,
        key_image: newRecord.key_image,
        url: newRecord.link_image,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
}

export async function uploadToPredict(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "color_detector" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    const uid = req.user.uid;
    const keyImage = result.public_id;
    const imageUrl = result.secure_url;

    const predictedColor = await predictColor(imageUrl);

    const newRecord = await createImageRecord(uid, keyImage, predictedColor);

    return res.status(201).json({
      message: "Upload & predict successful",
      data: {
        image_id: newRecord.image_id,
        uid: newRecord.uid,
        key_image: newRecord.key_image,
        url: newRecord.link_image,
        predicted_color: newRecord.predicted_color,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
}

export async function getAllImages(req, res) {
  try {
    const { data, error } = await supabase.from("image").select("*");

    if (error) throw error;

    return res.status(200).json({ message: "Success", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch images", error: err.message });
  }
}

export async function getImagesByUid(req, res) {
  const { uid } = req.params;

  try {
    const { data, error } = await supabase
      .from("image")
      .select("*")
      .eq("uid", uid);

    if (error) throw error;

    return res.status(200).json({ message: "Success", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch user's images", error: err.message });
  }
}
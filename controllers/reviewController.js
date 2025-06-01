import { createReview, fetchReviews, fetchReviewById } from "../models/reviewModel.js";

export const postReview = async (req, res) => {
  try {
    const uid = req.user.uid; // pastikan middleware authenticateToken sudah set req.user
    const { star, satisfaction, review } = req.body;

    // Validasi input
    if (!star || star < 1 || star > 5) {
      return res.status(400).json({ message: "Star harus antara 1 sampai 5" });
    }

    if (!satisfaction || !review) {
      return res
        .status(400)
        .json({ message: "Satisfaction dan review harus diisi" });
    }

    const newReview = await createReview({ uid, star, satisfaction, review });

    res.status(201).json({
      message: "Review berhasil disimpan",
      data: newReview,
    });
  } catch (error) {
    console.error("Post review error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await fetchReviews();

    res.status(200).json({
      message: "Daftar review berhasil diambil",
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await fetchReviewById(id);

    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    res.status(200).json({
      message: "Review berhasil diambil",
      data: review,
    });
  } catch (error) {
    console.error("Get review by ID error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

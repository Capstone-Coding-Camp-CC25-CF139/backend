import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { postReview, getReviews, getReviewById } from "../controllers/reviewController.js";

const router = express.Router();

/**
 * @swagger
 * /api/review/post:
 *   post:
 *     summary: Submit review user
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - star
 *               - satisfaction
 *               - review
 *             properties:
 *               star:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               satisfaction:
 *                 type: string
 *                 example: "Sangat puas dengan layanan"
 *               review:
 *                 type: string
 *                 example: "Proses upload gambar sangat cepat dan mudah."
 *     responses:
 *       201:
 *         description: Review berhasil disimpan
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized, token tidak valid atau tidak ada
 *       500:
 *         description: Server error
 */

router.post("/post", authenticateToken, postReview);

/**
 * @swagger
 * /api/review/getAll:
 *   get:
 *     summary: Ambil semua review
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua review
 *       500:
 *         description: Server error
 */
router.get("/getAll", getReviews);


/**
 * @swagger
 * /api/review/get/{id}:
 *   get:
 *     summary: Ambil review berdasarkan ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari review
 *     responses:
 *       200:
 *         description: Review berhasil ditemukan
 *       404:
 *         description: Review tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get("/get/:id", getReviewById);

export default router;

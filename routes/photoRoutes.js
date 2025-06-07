import express from "express";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { uploadPhoto, uploadPhotoV2, uploadToPredict, getAllImages, getImagesByUid } from "../controllers/photoController.js";

const router = express.Router();

/**
 * @swagger
 * /api/photos/upload:
 *   post:
 *     summary: Upload foto ke Cloudinary
 *     tags: [Photos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload berhasil
 *       400:
 *         description: Tidak ada file yang diupload
 *       500:
 *         description: Upload gagal
 */
router.post("/upload", upload.single("image"), uploadPhoto);

/**
 * @swagger
 * /api/photos/uploadv2:
 *   post:
 *     summary: Upload foto ke Cloudinary dan simpan metadata ke Supabase
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload berhasil dan metadata disimpan
 *       400:
 *         description: Tidak ada file yang diupload
 *       500:
 *         description: Upload gagal
 */
router.post(
  "/uploadv2",
  authenticateToken,
  upload.single("image"),
  uploadPhotoV2
);

/**
 * @swagger
 * /api/photos/uploadtopredict:
 *   post:
 *     summary: Upload foto ke Cloudinary dan simpan metadata ke Supabase untuk prediksi model
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload berhasil dan metadata disimpan
 *       400:
 *         description: Tidak ada file yang diupload
 *       500:
 *         description: Upload gagal
 */
router.post(
  "/uploadtopredict",
  authenticateToken,
  upload.single("image"),
  uploadToPredict
);


/**
 * @swagger
 * /api/photos/all:
 *   get:
 *     summary: Ambil semua image yang tersimpan di Supabase
 *     tags: [Photos]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua data image
 *       500:
 *         description: Gagal mengambil data image
 */
router.get("/all", getAllImages); 
/**
 * @swagger
 * /api/photos/user/{uid}:
 *   get:
 *     summary: Ambil semua image berdasarkan UID user
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID user
 *     responses:
 *       200:
 *         description: Berhasil mengambil image user
 *       500:
 *         description: Gagal mengambil image user
 */
router.get("/user/:uid", getImagesByUid); 

export default router;

import express from "express";
import { login, register, getUsers } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user dan mendapatkan token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - name
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       409:
 *         description: Username/email sudah digunakan
 */
router.post("/register", register);

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Mendapatkan semua user (butuh token)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar user
 *       401:
 *         description: Token tidak valid
 */
router.get("/all", authenticateToken, getUsers);

export default router;

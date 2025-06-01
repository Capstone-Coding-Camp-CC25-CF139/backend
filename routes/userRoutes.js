import express from "express";
import { login, register, getUsers } from "../controllers/userController.js"; 
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/all", authenticateToken, getUsers);

export default router;

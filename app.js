import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Halo dari Express.js!");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Data rahasia untuk user yang sudah login",
    user: req.user,
  });
});
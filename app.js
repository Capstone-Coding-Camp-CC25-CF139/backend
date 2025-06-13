import express from "express";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import photoRoutes from "./routes/photoRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import swaggerJsdoc from "swagger-jsdoc";
import cors  from "cors";
import swaggerUi from "swagger-ui-express";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
});
dotenv.config();

const app = express();
const port = 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/swagger.html"));
});
app.use("/api/review", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Data rahasia untuk user yang sudah login",
    user: req.user,
  });
});

app.listen(port, () => {});
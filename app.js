import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// swagger
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

app.use(express.json());



app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


// app.get("/", (req, res) => {
//   res.send("Halo dari Express.js!");
// });
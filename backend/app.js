const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const prisma = require("./config/prisma");
const errorHandler = require("./middlewares/error.middleware");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans .env");
}

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
//Route pour definir les midlewares
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const clientRoutes = require("./routes/client.routes");
const technicienRoutes = require("./routes/technicien.routes");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/client", clientRoutes);
app.use("/api/v1/technicien", technicienRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      message: "API is running",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      message: "API is running",
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./config/prisma");
const errorHandler = require("./middlewares/error.middleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", async (req, res) => {
  try {
    // Tester la connexion à la base de données
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

// Importer et monter les routes
// const userRoutes = require("./routes/users.routes");
// app.use("/api/users", userRoutes);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

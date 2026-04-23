// Exemple de route pour les utilisateurs
const express = require("express");
const router = express.Router();

// GET /api/users - Liste tous les utilisateurs
router.get("/", (req, res) => {
  res.json({ message: "GET all users" });
});

// POST /api/users - Créer un utilisateur
router.post("/", (req, res) => {
  res.json({ message: "POST create user" });
});

module.exports = router;

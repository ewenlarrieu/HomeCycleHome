// Middleware de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erreur Prisma
  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      error: "Erreur de base de données",
      message: err.message,
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
    });
  }

  // Erreur de validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Erreur de validation",
      message: err.message,
    });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    error: err.message || "Une erreur est survenue",
  });
};

module.exports = errorHandler;

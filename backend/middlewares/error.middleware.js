const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code && err.code.startsWith("P")) {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: 401,
      message: "Token invalide",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Une erreur est survenue",
  });
};

module.exports = errorHandler;

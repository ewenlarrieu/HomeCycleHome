const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ status: 401, message: 'Non authentifié' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Token invalide ou expiré' })
  }
}

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 403, message: 'Accès refusé' })
    }
    next()
  }
}

module.exports = { authenticateToken, authorizeRole }

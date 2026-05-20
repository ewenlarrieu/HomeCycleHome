const express = require('express')
const router = express.Router()
const { register, login, me } = require('../controllers/AuthController')
const { authenticateToken } = require('../middlewares/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateToken, me)

module.exports = router

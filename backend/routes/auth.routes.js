const express = require('express')
const router = express.Router()
const { register, login, me, logout, forgotPassword, resetPassword } = require('../controllers/AuthController')
const { authenticateToken } = require('../middlewares/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateToken, me)
router.post('/logout', authenticateToken, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router

const express = require('express')
const router = express.Router()
const { getProfil } = require('../controllers/ClientController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/profil', authenticateToken, authorizeRole('client'), getProfil)

module.exports = router

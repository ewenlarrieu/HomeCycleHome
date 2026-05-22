const express = require('express')
const router = express.Router()
const { getUtilisateurs, updateRole, updateStatus } = require('../controllers/AdminController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/utilisateurs', authenticateToken, authorizeRole('admin'), getUtilisateurs)
router.put('/utilisateurs/:id/role', authenticateToken, authorizeRole('admin'), updateRole)
router.put('/utilisateurs/:id/status', authenticateToken, authorizeRole('admin'), updateStatus)

module.exports = router

const express = require('express')
const router = express.Router()
const { createUtilisateur, getUtilisateurs, getUtilisateurById, updateUtilisateur, updateRole, updateStatus } = require('../controllers/AdminController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.post('/utilisateurs', authenticateToken, authorizeRole('admin'), createUtilisateur)
router.get('/utilisateurs', authenticateToken, authorizeRole('admin'), getUtilisateurs)
router.get('/utilisateurs/:id', authenticateToken, authorizeRole('admin'), getUtilisateurById)
router.put('/utilisateurs/:id', authenticateToken, authorizeRole('admin'), updateUtilisateur)
router.put('/utilisateurs/:id/role', authenticateToken, authorizeRole('admin'), updateRole)
router.put('/utilisateurs/:id/status', authenticateToken, authorizeRole('admin'), updateStatus)

module.exports = router

const express = require('express')
const router = express.Router()
const { getProfil, updateProfil, getZones, addAdresse, deleteAdresse, getTypesCycles, addCycle, updateCycle, deleteCycle } = require('../controllers/ClientController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/profil', authenticateToken, authorizeRole('client'), getProfil)
router.put('/profil', authenticateToken, authorizeRole('client'), updateProfil)
router.get('/zones', authenticateToken, authorizeRole('client'), getZones)
router.post('/adresses', authenticateToken, authorizeRole('client'), addAdresse)
router.delete('/adresses/:id', authenticateToken, authorizeRole('client'), deleteAdresse)
router.get('/types-cycles', authenticateToken, authorizeRole('client'), getTypesCycles)
router.post('/cycles', authenticateToken, authorizeRole('client'), addCycle)
router.put('/cycles/:id', authenticateToken, authorizeRole('client'), updateCycle)
router.delete('/cycles/:id', authenticateToken, authorizeRole('client'), deleteCycle)

module.exports = router

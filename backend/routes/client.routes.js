const express = require('express')
const router = express.Router()
const { getProfil, updateProfil, getTypesCycles, addCycle, updateCycle, deleteCycle } = require('../controllers/ClientController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/profil', authenticateToken, authorizeRole('client'), getProfil)
router.put('/profil', authenticateToken, authorizeRole('client'), updateProfil)
router.get('/types-cycles', authenticateToken, authorizeRole('client'), getTypesCycles)
router.post('/cycles', authenticateToken, authorizeRole('client'), addCycle)
router.put('/cycles/:id', authenticateToken, authorizeRole('client'), updateCycle)
router.delete('/cycles/:id', authenticateToken, authorizeRole('client'), deleteCycle)

module.exports = router

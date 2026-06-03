const express = require('express')
const router = express.Router()
const { getInterventions, updateStatusIntervention } = require('../controllers/TechnicienController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/interventions', authenticateToken, authorizeRole('technicien'), getInterventions)
router.put('/interventions/:id/status', authenticateToken, authorizeRole('technicien'), updateStatusIntervention)

module.exports = router

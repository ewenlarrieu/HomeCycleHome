const express = require('express')
const router = express.Router()
const { getInterventions, updateStatusIntervention, updateIntervention } = require('../controllers/TechnicienController')
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware')

router.get('/interventions', authenticateToken, authorizeRole('technicien'), getInterventions)
router.put('/interventions/:id/status', authenticateToken, authorizeRole('technicien'), updateStatusIntervention)
router.put('/interventions/:id', authenticateToken, authorizeRole('technicien'), updateIntervention)

module.exports = router

const prisma = require('../config/prisma')

const getInterventions = async (req, res, next) => {
  try {
    const id_technicien = req.user.id_utilisateur

    const rdvs = await prisma.rendez_vous.findMany({
      where: { id_technicien },
      include: {
        forfait_intervention: { select: { nom_service: true, prix: true, duree_estimee_minutes: true } },
        adresse: {
          select: {
            numero_rue: true,
            rue: true,
            complement_adresse: true,
            ville: { select: { nom_ville: true, code_postal: true } },
            zone: { select: { nom_zone: true } },
          },
        },
        cycles: { select: { nom: true, marque: true, annee: true, type_cycle: { select: { libelle: true } } } },
        utilisateur_rendez_vous_id_clientToutilisateur: { select: { prenom: true, nom: true, telephone: true, email: true } },
        status_rendez_vous: { select: { libelle: true } },
      },
      orderBy: { date_rdv: 'asc' },
    })

    res.status(200).json(rdvs)
  } catch (error) {
    next(error)
  }
}

const updateStatusIntervention = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const id_technicien = req.user.id_utilisateur
    const { libelle } = req.body

    if (!libelle) {
      return res.status(400).json({ status: 400, message: 'Le statut est obligatoire.' })
    }

    const rdv = await prisma.rendez_vous.findUnique({ where: { id_rendez_vous: id } })
    if (!rdv || rdv.id_technicien !== id_technicien) {
      return res.status(403).json({ status: 403, message: 'Action non autorisée.' })
    }

    const status = await prisma.status_rendez_vous.findFirst({ where: { libelle } })
    if (!status) {
      return res.status(404).json({ status: 404, message: 'Statut introuvable.' })
    }

    const updated = await prisma.rendez_vous.update({
      where: { id_rendez_vous: id },
      data: { id_status_rendez_vous: status.id_status_rendez_vous },
      include: { status_rendez_vous: { select: { libelle: true } } },
    })

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

const updateIntervention = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const id_technicien = req.user.id_utilisateur
    const rdv = await prisma.rendez_vous.findUnique({ where: { id_rendez_vous: id } })
    if (!rdv || rdv.id_technicien !== id_technicien) {
      return res.status(403).json({ status: 403, message: 'Action non autorisée.' })
    }

    const { commentaire, notes_technicien, duree_rdv } = req.body

    const data = {}
    if (notes_technicien !== undefined) data.notes_technicien = notes_technicien || null
    if (commentaire !== undefined) data.commentaire = commentaire || null
    if (duree_rdv !== undefined) {
      const duree = parseInt(duree_rdv)
      if (isNaN(duree) || duree <= 0) {
        return res.status(400).json({ status: 400, message: 'Durée invalide.' })
      }
      data.duree_rdv = duree
    }

    const updated = await prisma.rendez_vous.update({
      where: { id_rendez_vous: id },
      data,
      include: {
        forfait_intervention: { select: { nom_service: true, prix: true, duree_estimee_minutes: true } },
        adresse: {
          select: {
            numero_rue: true,
            rue: true,
            complement_adresse: true,
            ville: { select: { nom_ville: true, code_postal: true } },
            zone: { select: { nom_zone: true } },
          },
        },
        cycles: { select: { nom: true, marque: true, annee: true, type_cycle: { select: { libelle: true } } } },
        utilisateur_rendez_vous_id_clientToutilisateur: { select: { prenom: true, nom: true, telephone: true, email: true } },
        status_rendez_vous: { select: { libelle: true } },
      },
    })

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

module.exports = { getInterventions, updateStatusIntervention, updateIntervention }

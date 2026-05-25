const prisma = require('../config/prisma')

const getProfil = async (req, res, next) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: req.user.id_utilisateur },
      select: {
        id_utilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        cycles: {
          select: {
            id_cycle: true,
            marque: true,
            annee: true,
            commentaire: true,
            type_cycle: {
              select: { libelle: true },
            },
          },
        },
        adresse: {
          select: {
            id_adresse: true,
            numero_rue: true,
            rue: true,
            complement_adresse: true,
            ville: {
              select: { nom_ville: true, code_postal: true },
            },
            zone: {
              select: { nom_zone: true },
            },
          },
        },
      },
    })

    if (!utilisateur) {
      return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' })
    }

    res.status(200).json(utilisateur)
  } catch (error) {
    next(error)
  }
}

module.exports = { getProfil }

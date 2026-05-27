const prisma = require('../config/prisma')

const updateProfil = async (req, res, next) => {
  try {
    const { nom, prenom, email, telephone } = req.body
    const id = req.user.id_utilisateur

    if (!nom || !prenom || !email || !telephone) {
      return res.status(400).json({ status: 400, message: 'Tous les champs sont obligatoires.' })
    }

    const emailExistant = await prisma.utilisateur.findFirst({
      where: { email, NOT: { id_utilisateur: id } },
    })
    if (emailExistant) {
      return res.status(409).json({ status: 409, message: 'Cet email est déjà utilisé.' })
    }

    const telExistant = await prisma.utilisateur.findFirst({
      where: { telephone, NOT: { id_utilisateur: id } },
    })
    if (telExistant) {
      return res.status(409).json({ status: 409, message: 'Ce numéro de téléphone est déjà utilisé.' })
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { nom, prenom, email, telephone },
      select: { nom: true, prenom: true, email: true, telephone: true },
    })

    res.status(200).json(utilisateur)
  } catch (error) {
    next(error)
  }
}

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
            nom: true,
            marque: true,
            annee: true,
            commentaire: true,
            id_type_cycle: true,
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

const getTypesCycles = async (req, res, next) => {
  try {
    const types = await prisma.type_cycle.findMany({
      select: { id_type_cycle: true, libelle: true },
      orderBy: { libelle: 'asc' },
    })
    res.status(200).json(types)
  } catch (error) {
    next(error)
  }
}

const addCycle = async (req, res, next) => {
  try {
    const { nom, marque, annee, id_type_cycle, commentaire } = req.body
    const id = req.user.id_utilisateur

    if (!nom || !marque || !annee || !id_type_cycle) {
      return res.status(400).json({ status: 400, message: 'Nom, marque, année et type sont obligatoires.' })
    }

    const anneeInt = parseInt(annee)
    if (isNaN(anneeInt) || anneeInt < 1900 || anneeInt > new Date().getFullYear()) {
      return res.status(400).json({ status: 400, message: 'Année invalide.' })
    }

    const typeExiste = await prisma.type_cycle.findUnique({
      where: { id_type_cycle: parseInt(id_type_cycle) },
    })
    if (!typeExiste) {
      return res.status(404).json({ status: 404, message: 'Type de cycle introuvable.' })
    }

    const cycle = await prisma.cycles.create({
      data: {
        nom,
        marque,
        annee: anneeInt,
        commentaire: commentaire || null,
        id_type_cycle: parseInt(id_type_cycle),
        id_utilisateur: id,
      },
      select: {
        id_cycle: true,
        nom: true,
        marque: true,
        annee: true,
        commentaire: true,
        type_cycle: { select: { libelle: true } },
      },
    })

    res.status(201).json(cycle)
  } catch (error) {
    next(error)
  }
}

const updateCycle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const userId = req.user.id_utilisateur
    const { nom, marque, annee, id_type_cycle, commentaire } = req.body

    if (!nom || !marque || !annee || !id_type_cycle) {
      return res.status(400).json({ status: 400, message: 'Nom, marque, année et type sont obligatoires.' })
    }

    const cycle = await prisma.cycles.findUnique({ where: { id_cycle: id } })
    if (!cycle || cycle.id_utilisateur !== userId) {
      return res.status(403).json({ status: 403, message: 'Action non autorisée.' })
    }

    const updated = await prisma.cycles.update({
      where: { id_cycle: id },
      data: {
        nom,
        marque,
        annee: parseInt(annee),
        id_type_cycle: parseInt(id_type_cycle),
        commentaire: commentaire || null,
      },
      select: {
        id_cycle: true,
        nom: true,
        marque: true,
        annee: true,
        commentaire: true,
        id_type_cycle: true,
        type_cycle: { select: { libelle: true } },
      },
    })

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

const deleteCycle = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const userId = req.user.id_utilisateur

    const cycle = await prisma.cycles.findUnique({ where: { id_cycle: id } })
    if (!cycle || cycle.id_utilisateur !== userId) {
      return res.status(403).json({ status: 403, message: 'Action non autorisée.' })
    }

    await prisma.cycles.delete({ where: { id_cycle: id } })
    res.status(200).json({ message: 'Cycle supprimé.' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProfil, updateProfil, getTypesCycles, addCycle, updateCycle, deleteCycle }

const bcrypt = require('bcrypt')
const prisma = require('../config/prisma')

const createUtilisateur = async (req, res, next) => {
  try {
    const nom = req.body.nom?.trim()
    const prenom = req.body.prenom?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const telephone = req.body.telephone?.trim()
    const mot_de_passe = req.body.mot_de_passe
    const role = req.body.role

    if (!nom || !prenom || !email || !telephone || !mot_de_passe || !role) {
      return res.status(400).json({ status: 400, message: 'Tous les champs sont obligatoires.' })
    }

    if (!['client', 'technicien'].includes(role)) {
      return res.status(400).json({ status: 400, message: 'Rôle invalide.' })
    }

    if (mot_de_passe.length < 8) {
      return res.status(400).json({ status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    }

    const emailExistant = await prisma.utilisateur.findUnique({ where: { email } })
    if (emailExistant) {
      return res.status(409).json({ status: 409, message: 'Cet email est déjà utilisé.' })
    }

    const telephoneExistant = await prisma.utilisateur.findUnique({ where: { telephone } })
    if (telephoneExistant) {
      return res.status(409).json({ status: 409, message: 'Ce numéro de téléphone est déjà utilisé.' })
    }

    const motDePasseHache = await bcrypt.hash(mot_de_passe, 10)

    const roleRecord = await prisma.role.findFirst({ where: { libelle: role } })
    const statusRecord = await prisma.status_compte.findFirst({ where: { libelle: 'actif' } })

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe: motDePasseHache,
        date_creation: new Date(),
        id_role: roleRecord.id_role,
        id_status: statusRecord.id_status,
      },
      include: { role: true, status_compte: true },
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur
    res.status(201).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

const getUtilisateurById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
      include: {
        role: true,
        status_compte: true,
        cycles: {
          select: {
            id_cycle: true,
            nom: true,
            marque: true,
            annee: true,
            commentaire: true,
            type_cycle: { select: { libelle: true } },
          },
        },
        adresse: {
          select: {
            id_adresse: true,
            numero_rue: true,
            rue: true,
            complement_adresse: true,
            ville: { select: { nom_ville: true, code_postal: true } },
            zone: { select: { nom_zone: true } },
          },
        },
      },
    })

    if (!utilisateur) {
      return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' })
    }

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur
    res.status(200).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

const updateUtilisateur = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const nom = req.body.nom?.trim()
    const prenom = req.body.prenom?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const telephone = req.body.telephone?.trim()

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
      include: { role: true, status_compte: true },
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur
    res.status(200).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

const getUtilisateurs = async (req, res, next) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      include: {
        role: true,
        status_compte: true,
      },
      orderBy: { nom: 'asc' },
    })

    const clients = utilisateurs
      .filter(u => u.role.libelle === 'client')
      .map(({ mot_de_passe, ...u }) => u)

    const techniciens = utilisateurs
      .filter(u => u.role.libelle === 'technicien')
      .map(({ mot_de_passe, ...u }) => u)

    res.status(200).json({ clients, techniciens })
  } catch (error) {
    next(error)
  }
}

const updateRole = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { role } = req.body

    if (!['client', 'technicien', 'admin'].includes(role)) {
      return res.status(400).json({ status: 400, message: 'Rôle invalide' })
    }

    const roleRecord = await prisma.role.findFirst({ where: { libelle: role } })
    if (!roleRecord) {
      return res.status(404).json({ status: 404, message: 'Rôle introuvable' })
    }

    const utilisateur = await prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { id_role: roleRecord.id_role },
      include: { role: true, status_compte: true },
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur
    res.status(200).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: id },
      include: { status_compte: true },
    })

    if (!utilisateur) {
      return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' })
    }

    const nouveauStatut = utilisateur.status_compte.libelle === 'actif' ? 'inactif' : 'actif'
    const statusRecord = await prisma.status_compte.findFirst({ where: { libelle: nouveauStatut } })

    const updated = await prisma.utilisateur.update({
      where: { id_utilisateur: id },
      data: { id_status: statusRecord.id_status },
      include: { role: true, status_compte: true },
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = updated
    res.status(200).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

module.exports = { createUtilisateur, getUtilisateurs, getUtilisateurById, updateUtilisateur, updateRole, updateStatus }

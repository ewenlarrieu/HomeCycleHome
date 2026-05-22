const prisma = require('../config/prisma')

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

module.exports = { getUtilisateurs, updateRole, updateStatus }

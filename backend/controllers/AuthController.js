const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const register = async (req, res, next) => {
  try {
    const { nom, prenom, email, telephone, mot_de_passe, confirmer_mot_de_passe } = req.body

    if (!nom || !prenom || !email || !telephone || !mot_de_passe || !confirmer_mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Tous les champs sont obligatoires' })
    }

    if (mot_de_passe !== confirmer_mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Les mots de passe ne correspondent pas' })
    }

    const emailExistant = await prisma.utilisateur.findUnique({ where: { email } })
    if (emailExistant) {
      return res.status(409).json({ status: 409, message: 'Cet email est déjà utilisé' })
    }

    const telephoneExistant = await prisma.utilisateur.findUnique({ where: { telephone } })
    if (telephoneExistant) {
      return res.status(409).json({ status: 409, message: 'Ce numéro de téléphone est déjà utilisé' })
    }

    const motDePasseHache = await bcrypt.hash(mot_de_passe, 10)

    const role = await prisma.role.findFirst({ where: { libelle: 'client' } })
    const statusCompte = await prisma.status_compte.findFirst({ where: { libelle: 'actif' } })

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe: motDePasseHache,
        date_creation: new Date(),
        id_role: role.id_role,
        id_status: statusCompte.id_status,
      },
    })

    const token = jwt.sign(
      { id_utilisateur: utilisateur.id_utilisateur, role: role.libelle },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur

    res.status(201).json({ ...utilisateurSansMotDePasse, role: { libelle: role.libelle } })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body

    if (!email || !mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Email et mot de passe obligatoires' })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      include: { role: true, status_compte: true },
    })

    if (!utilisateur) {
      return res.status(401).json({ status: 401, message: 'Email ou mot de passe incorrect' })
    }

    if (utilisateur.status_compte.libelle === 'inactif') {
      return res.status(403).json({ status: 403, message: 'Compte désactivé' })
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe)
    if (!motDePasseValide) {
      return res.status(401).json({ status: 401, message: 'Email ou mot de passe incorrect' })
    }

    const token = jwt.sign(
      { id_utilisateur: utilisateur.id_utilisateur, role: utilisateur.role.libelle },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    })

    const { mot_de_passe: _, ...utilisateurSansMotDePasse } = utilisateur

    res.status(200).json(utilisateurSansMotDePasse)
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }

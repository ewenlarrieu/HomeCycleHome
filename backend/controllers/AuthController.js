const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
const { sendResetPasswordEmail } = require('../services/email.service')

const register = async (req, res, next) => {
  try {
    const nom = req.body.nom?.trim()
    const prenom = req.body.prenom?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const telephone = req.body.telephone?.trim()
    const mot_de_passe = req.body.mot_de_passe
    const confirmer_mot_de_passe = req.body.confirmer_mot_de_passe

    if (!nom || !prenom || !email || !telephone || !mot_de_passe || !confirmer_mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Tous les champs sont obligatoires' })
    }

    if (mot_de_passe.length < 8) {
      return res.status(400).json({ status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères' })
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
    const email = req.body.email?.trim().toLowerCase()
    const mot_de_passe = req.body.mot_de_passe

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

const me = async (req, res, next) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: req.user.id_utilisateur },
      include: { role: true },
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

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.status(200).json({ message: 'Déconnexion réussie' })
}

const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({ status: 400, message: 'Email obligatoire' })
    }

    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } })

    // Réponse identique que l'email existe ou non (sécurité)
    if (!utilisateur) {
      return res.status(200).json({ message: 'Si cet email existe, un lien a été envoyé.' })
    }

    // Token JWT incluant un fragment du hash du mot de passe actuel
    const token = jwt.sign(
      {
        id_utilisateur: utilisateur.id_utilisateur,
        purpose: 'reset-password',
        pwdFragment: utilisateur.mot_de_passe.slice(0, 10),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    await sendResetPasswordEmail(utilisateur.email, utilisateur.prenom, resetLink)

    res.status(200).json({ message: 'Si cet email existe, un lien a été envoyé.' })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token, mot_de_passe, confirmer_mot_de_passe } = req.body

    if (!token || !mot_de_passe || !confirmer_mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Tous les champs sont obligatoires' })
    }

    if (mot_de_passe.length < 8) {
      return res.status(400).json({ status: 400, message: 'Le mot de passe doit contenir au moins 8 caractères' })
    }

    if (mot_de_passe !== confirmer_mot_de_passe) {
      return res.status(400).json({ status: 400, message: 'Les mots de passe ne correspondent pas' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(400).json({ status: 400, message: 'Lien invalide ou expiré' })
    }

    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ status: 400, message: 'Lien invalide' })
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: decoded.id_utilisateur },
    })

    if (!utilisateur) {
      return res.status(404).json({ status: 404, message: 'Utilisateur introuvable' })
    }

    // Vérifie que le mot de passe n'a pas déjà été changé
    if (utilisateur.mot_de_passe.slice(0, 10) !== decoded.pwdFragment) {
      return res.status(400).json({ status: 400, message: 'Lien déjà utilisé ou expiré' })
    }

    const motDePasseHache = await bcrypt.hash(mot_de_passe, 10)

    await prisma.utilisateur.update({
      where: { id_utilisateur: utilisateur.id_utilisateur },
      data: { mot_de_passe: motDePasseHache },
    })

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, me, logout, forgotPassword, resetPassword }

// Service pour la logique métier des utilisateurs
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const userService = {
  // Trouver tous les utilisateurs
  findAll: async () => {
    return await prisma.utilisateur.findMany({
      include: {
        role: true,
      },
      select: {
        idUtilisateur: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        statusCompte: true,
        role: {
          select: {
            libelle: true,
          },
        },
        // Ne pas renvoyer le mot de passe
      },
    });
  },

  // Créer un utilisateur
  create: async (userData) => {
    const { motDePasse, ...rest } = userData;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    return await prisma.utilisateur.create({
      data: {
        ...rest,
        motDePasse: hashedPassword,
        dateCreation: new Date(),
      },
    });
  },

  // Trouver un utilisateur par email
  findByEmail: async (email) => {
    return await prisma.utilisateur.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  },
};

module.exports = userService;

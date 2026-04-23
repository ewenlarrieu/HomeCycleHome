// Exemple de contrôleur pour les utilisateurs
const userService = require("../services/user.service");

const userController = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  // Créer un utilisateur
  createUser: async (req, res, next) => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;

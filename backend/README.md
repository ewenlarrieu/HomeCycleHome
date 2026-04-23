# Backend - HomeCycl'Home

API REST pour la gestion de réparation et entretien de vélos à domicile.

## 🚀 Technologies

- **Runtime** : Node.js 20
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT (JSON Web Token)
- **Sécurité** : bcrypt pour le hachage des mots de passe

## 📁 Structure du projet

```
backend/
├── config/           # Configuration (Prisma, etc.)
├── controllers/      # Contrôleurs (logique de réponse HTTP)
├── services/         # Services (logique métier)
├── routes/           # Définition des routes API
├── middlewares/      # Middlewares (auth, erreurs, etc.)
├── prisma/           # Schéma et migrations Prisma
├── app.js            # Point d'entrée de l'application
├── Dockerfile        # Image Docker
└── .env              # Variables d'environnement (ne pas committer)
```

## ⚙️ Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos valeurs :

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/homecyclhome?schema=public"
JWT_SECRET="votre_secret_jwt_super_securise"
```

### 3. Configurer Prisma

Si votre base de données PostgreSQL existe déjà avec les tables :

```bash
# Générer le client Prisma
npx prisma generate

# Optionnel : voir la base dans Prisma Studio
npx prisma studio
```

Si vous partez de zéro :

```bash
# Créer la base et appliquer les migrations
npx prisma migrate dev --name init
```

## 🏃 Lancer l'application

### Mode développement (avec hot-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

## 🐳 Docker

### Build l'image

```bash
docker build -t homecyclhome-backend .
```

### Lancer avec docker-compose (recommandé)

À la racine du projet :

```bash
docker compose up -d
```

## 📚 API Endpoints

### Health Check

```
GET /api/health
```

Vérifie que l'API fonctionne et que la connexion à la base de données est établie.

**Réponse :**

```json
{
  "message": "API is running",
  "database": "connected"
}
```

### Utilisateurs (exemple)

```
GET /api/users      # Liste tous les utilisateurs
POST /api/users     # Créer un utilisateur
```

_Plus de routes à implémenter selon les besoins du projet_

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Les routes protégées nécessitent un token dans le header :

```
Authorization: Bearer <token>
```

### Rôles disponibles

- **Client** : accès aux fonctionnalités client
- **Technicien** : accès aux interventions
- **Administrateur** : accès complet

## 🧪 Tests

```bash
npm test
```

_(Tests à implémenter)_

## 📦 Scripts npm

- `npm start` : Démarre le serveur en production
- `npm run dev` : Démarre le serveur en développement avec nodemon
- `npm test` : Lance les tests

## 🗃️ Base de données

### Modèles principaux

- **Utilisateur** : Clients, techniciens et administrateurs
- **Role** : Définition des rôles
- **RendezVous** : Interventions planifiées
- **Cycle** : Vélos des clients
- **ForfaitIntervention** : Types d'interventions disponibles
- **Zone** : Zones géographiques d'intervention
- **Produit** : Produits vendables
- **Paiement** : Gestion des paiements

Voir [prisma/schema.prisma](prisma/schema.prisma) pour le schéma complet.

## 🔧 Troubleshooting

### Erreur de connexion à la base de données

Vérifier que :

- PostgreSQL est démarré
- Les credentials dans `DATABASE_URL` sont corrects
- La base de données existe

```bash
# Tester la connexion
npx prisma db pull
```

### Erreur "Client Prisma not found"

```bash
npx prisma generate
```

## 📝 TODO

- [ ] Implémenter toutes les routes (users, rendez-vous, cycles, etc.)
- [ ] Ajouter la validation des données (express-validator)
- [ ] Implémenter l'authentification complète (login, register)
- [ ] Ajouter les tests unitaires et d'intégration
- [ ] Ajouter la documentation API (Swagger)
- [ ] Implémenter l'upload de photos
- [ ] Gérer les disponibilités des techniciens
- [ ] Système de notifications

## 📄 Licence

Projet pédagogique - CDA

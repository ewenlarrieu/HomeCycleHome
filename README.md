# HomeCycl'Home

Application web de gestion de rendez-vous pour la réparation et l'entretien de vélos à domicile.  
Développée pour **LeCycleLyonnais**, elle met en relation des clients lyonnais avec des techniciens qualifiés.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + Vite + React Router |
| Backend | Node.js + Express.js |
| Base de données | PostgreSQL |
| ORM | Prisma v6 |
| Authentification | JWT + bcrypt |
| Serveur web | Nginx (reverse proxy, intégré au conteneur frontend) |
| Conteneurisation | Docker + Docker Compose |

---

## Prérequis

### Avec Docker (recommandé)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2

### Sans Docker (développement local)

- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/) 16+

---

## Installation avec Docker

C'est la méthode recommandée pour lancer le projet complet en une seule commande.

### 1. Cloner le dépôt

```bash
git clone https://github.com/ewenlarrieu/HomeCyclHome.git
cd HomeCyclHome
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Renseigner les valeurs dans `.env` :

```env
# Base de données
POSTGRES_DB=homecyclhome
POSTGRES_USER=postgres
POSTGRES_PASSWORD=motdepassefort

# Backend
NODE_ENV=production
BACKEND_PORT=3000
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
FRONTEND_URL=http://localhost:8080

# Frontend
VITE_API_URL=http://localhost:8080

# Email (nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=motdepasse
```

### 3. Lancer les conteneurs

```bash
docker compose up -d
```

Cette commande :
1. Construit les images Docker du backend et du frontend
2. Démarre les trois conteneurs (base de données, backend, frontend)
3. Applique automatiquement les migrations Prisma au démarrage du backend

### 4. Accéder à l'application

| Service | URL |
|---|---|
| Application web | http://localhost:8080 |
| API backend | http://localhost:8080/api/v1/ |
| Backend direct | http://localhost:3001 |

### Arrêter les conteneurs

```bash
docker compose down
```

Pour supprimer également les données PostgreSQL :

```bash
docker compose down -v
```

---

## Installation sans Docker (développement local)

### 1. Cloner le dépôt

```bash
git clone https://github.com/ewenlarrieu/HomeCyclHome.git
cd HomeCyclHome
```

### 2. Configurer le backend

```bash
cd backend
npm install
```

Créer le fichier `backend/.env` :

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/homecyclhome?schema=public
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=motdepasse
```

### 3. Initialiser la base de données

S'assurer que PostgreSQL est démarré, puis :

```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```

### 4. Configurer le frontend

```bash
cd frontend
npm install
```

Créer le fichier `frontend/.env` :

```env
VITE_API_URL=http://localhost:3000
```

### 5. Lancer les serveurs

Dans deux terminaux séparés :

```bash
# Terminal 1 — backend
cd backend
npm run dev
```

```bash
# Terminal 2 — frontend
cd frontend
npm run dev
```

L'application est accessible sur http://localhost:5173.

---

## Structure du projet

```
HomeCyclHome/
├── backend/
│   ├── config/          # Instance Prisma
│   ├── controllers/     # Logique de traitement des requêtes
│   ├── middlewares/     # Auth JWT, gestion des erreurs
│   ├── routes/          # Définition des endpoints API
│   ├── prisma/          # Schéma et migrations de la base de données
│   ├── app.js           # Point d'entrée Express
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Composants React réutilisables
│   │   ├── pages/       # Pages par rôle (client, technicien, admin)
│   │   └── services/    # Appels API
│   ├── nginx.conf       # Configuration Nginx (SPA + reverse proxy)
│   └── Dockerfile
├── docker-compose.yml
└── .env                 # Variables d'environnement (ne pas committer)
```

---

## Scripts utiles

### Backend

```bash
npm run dev    # Démarrage en développement (nodemon)
npm start      # Démarrage en production
```

### Frontend

```bash
npm run dev    # Serveur de développement Vite
npm run build  # Build de production
npm run lint   # Vérification ESLint
```

### Docker

```bash
docker compose up -d          # Démarrer tous les conteneurs
docker compose down           # Arrêter les conteneurs
docker compose logs -f        # Suivre les logs en temps réel
docker compose ps             # Voir l'état des conteneurs
docker compose build          # Reconstruire les images
```

---

## Vérifier que tout fonctionne

```bash
# Santé de l'API
curl http://localhost:8080/api/health

# État des conteneurs
docker compose ps
```

Une réponse `200 OK` de `/api/health` confirme que le backend et la base de données sont opérationnels.

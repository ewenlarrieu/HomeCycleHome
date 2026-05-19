# HomeCycl'Home — Contexte projet pour Claude Code

## Présentation

Application web de gestion de rendez-vous pour la réparation et l'entretien de vélos à domicile.
Entreprise : LeCycleLyonnais (68 ans d'expérience dans la vente et l'entretien de bicyclettes).

Trois types d'utilisateurs : **Client**, **Technicien**, **Administrateur**.

---

## Stack technique

| Couche           | Technologie                                |
| ---------------- | ------------------------------------------ |
| Frontend         | React + Vite + React Router                |
| Requêtes HTTP    | Fetch API                                  |
| Backend          | Node.js + Express.js                       |
| Base de données  | PostgreSQL                                 |
| ORM              | Prisma v6                                  |
| Authentification | JWT + bcrypt                               |
| Calendrier       | FullCalendar                               |
| Géocodage        | Géoplateforme IGN (Base Adresse Nationale) |
| Serveur web      | Nginx (reverse proxy)                      |
| Conteneurisation | Docker + Docker Compose                    |
| Versioning       | Git + GitHub                               |
| CI/CD            | GitHub Actions                             |

---

## Architecture du projet

```
HomeCyclHome/
├── backend/
│   ├── config/
│   │   └── prisma.js              # Instance Prisma
│   ├── controllers/               # Logique de traitement des requêtes
│   ├── middlewares/               # Auth, gestion des erreurs, validation
│   ├── prisma/
│   │   └── schema.prisma          # Schéma de la base de données
│   ├── routes/                    # Définition des routes API
│   ├── services/                  # Logique métier
│   ├── app.js                     # Point d'entrée Express
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/            # Composants React réutilisables
│   │   ├── pages/                 # Pages de l'application
│   │   ├── services/              # Appels API depuis le front
│   │   └── main.jsx
│   └── vite.config.js
├── docker-compose.yml
└── CLAUDE.md
```

---

## Architecture backend

Le backend suit une organisation stricte en couches :

```
Route → Controller → Service → Prisma (BDD)
```

- **Routes** : définissent les endpoints et appliquent les middlewares
- **Controllers** : reçoivent la requête, appellent le service, renvoient la réponse
- **Services** : contiennent toute la logique métier
- **Middlewares** : authentification JWT, gestion des erreurs, validation des données
- **Prisma** : accès à la base de données PostgreSQL

---

## API REST

- Toutes les routes sont préfixées par `/api/v1/`
- Les réponses sont au format JSON
- Format des erreurs :

```json
{
  "status": 400,
  "message": "Description de l'erreur"
}
```

### Routes publiques (sans authentification)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Routes protégées (JWT requis)

Toutes les autres routes nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

---

## Rôles utilisateurs

| Rôle           | Valeur       | Description                                    |
| -------------- | ------------ | ---------------------------------------------- |
| Client         | `client`     | Réserve des interventions                      |
| Technicien     | `technicien` | Gère son planning et réalise les interventions |
| Administrateur | `admin`      | Supervise toute la plateforme                  |

Chaque utilisateur a **un seul rôle**.
Un compte peut être **désactivé** sans être supprimé (table `status_compte`).

---

## Base de données — Modèles Prisma

Les modèles sont en **minuscules** (générés par `prisma db pull`).
19 tables au total.

### Modèles principaux

**utilisateur** : id_utilisateur, nom, prenom, email (unique), mot_de_passe, telephone, date_creation, id_status (FK status_compte), id_role (FK role)

**rendez_vous** : id_rendez_vous, date_rdv (TIMESTAMP), commentaire, duree_rdv, id_status_rendez_vous, id_cycle, id_adresse, id_service, id_client (nullable), id_technicien (NOT NULL)

- Deux relations vers utilisateur : client (nullable) et technicien (NOT NULL)

**adresse** : id_adresse, rue, numero_rue, complement_adresse (nullable), id_ville, id_zone, id_utilisateur

**zone** : id_zone, nom_zone, code_postal

- Pas de latitude/longitude — gestion par arrondissement de Lyon via code postal

**couvre** : table intermédiaire technicien ↔ zone (id_utilisateur, id_zone) — clé primaire composite

**disponibilites** : id_disponibilite, date_debut (TIMESTAMP), date_fin (TIMESTAMP), id_utilisateur

- Pas de jour_semaine — utilisation de dates complètes pour compatibilité FullCalendar

**cycles** : id_cycle, marque, annee, commentaire (nullable), id_type_cycle, id_utilisateur

**forfait_intervention** : id_service, nom_service (unique), prix (DECIMAL 10,2), duree_estimee_minutes (nullable), description

**produit** : id_produit, nom_produit (unique), photo_produit (nullable), description, quantite

- Pas de table stock séparée — quantite directement dans produit

**produit_rendez_vous** : id_produit_rendez_vous, prix_unitaire (DECIMAL 10,2), quantite, id_produit, id_rendez_vous

- prix_unitaire stocké à la réservation pour historique de facturation

**photos** : id_photo, url_photo (unique), commentaire (nullable), date_ajout, type_photo ('avant' ou 'apres'), id_rendez_vous

**paiement** : id_paiement, montant (DECIMAL 10,2), date_paiement, id_status, id_rendez_vous (unique)

### Tables de référence

- **role** : id_role, libelle (unique) — valeurs : 'client', 'technicien', 'admin'
- **status_compte** : id_status, libelle — valeurs : 'actif', 'inactif'
- **status_paiement** : id_status, libelle — valeurs : 'en attente', 'payé'
- **status_rendez_vous** : id_status_rendez_vous, libelle — valeurs : 'en attente', 'confirmé', 'réalisé', 'annulé'
- **type_cycle** : id_type_cycle, libelle — valeurs : 'vélo classique', 'VAE'...
- **ville** : id_ville, nom_ville, code_postal
- **societe** : id_societe, nom_societe, telephone, email, adresse, ville, code_postal

---

## Zones géographiques — Arrondissements de Lyon

| Zone      | Code postal |
| --------- | ----------- |
| Lyon 1er  | 69001       |
| Lyon 2ème | 69002       |
| Lyon 3ème | 69003       |
| Lyon 4ème | 69004       |
| Lyon 5ème | 69005       |
| Lyon 6ème | 69006       |
| Lyon 7ème | 69007       |
| Lyon 8ème | 69008       |
| Lyon 9ème | 69009       |

- L'admin définit les zones et les affecte aux techniciens via la table `couvre`
- Quand un client saisit son adresse, l'IGN retourne le code postal → on cherche la zone correspondante
- Un technicien doit avoir au moins une zone pour être réservable

---

## Règles métier importantes

### Réservations

- Un client doit être connecté pour réserver
- Une réservation ne peut être créée que sur un créneau disponible
- Un technicien ne peut pas avoir plus d'une réservation sur le même créneau
- Une réservation annulée libère automatiquement le créneau
- La réservation est possible uniquement si l'adresse du client est dans une zone couverte par le technicien

### Disponibilités

- `date_debut` et `date_fin` sont des TIMESTAMP (date + heure complète)
- Les disponibilités d'un même technicien ne doivent pas se chevaucher
- Un créneau réservé devient indisponible pour les autres clients

### Photos

- `type_photo` vaut `'avant'` (client) ou `'apres'` (technicien)

### Comptes

- Mots de passe hachés avec bcrypt
- Désactivation logique via `status_compte` (jamais de suppression physique)

---

## Fonctionnalités par rôle

### Client

- Créer un compte / se connecter
- Gérer ses vélos (ajouter, modifier, supprimer)
- Réserver une intervention (forfait → créneau → vélo → produits → photos)
- Annuler ou modifier un rendez-vous
- Consulter ses réservations passées et futures

### Technicien

- Consulter ses interventions (passées, du jour, à venir)
- Voir les détails d'une intervention et les infos client
- Modifier une intervention, ajouter commentaires et photos
- Marquer une intervention comme réalisée
- Annuler une intervention
- Procéder au paiement en fin d'intervention

### Administrateur

- Gérer les informations de la société
- Gérer les comptes utilisateurs (créer, modifier, désactiver)
- Gérer les interventions (afficher, modifier, supprimer)
- Afficher le planning par technicien
- Gérer les forfaits, produits, zones géographiques

---

## Conventions de code

### Général

- Langage : JavaScript (ES6+)
- Pas de `var`, utiliser `const` et `let`
- Async/await pour toutes les opérations asynchrones
- Gestion des erreurs avec try/catch dans les controllers

### Nommage

- Fichiers : `kebab-case` (ex: `auth.controller.js`, `user.service.js`)
- Variables et fonctions : `camelCase`
- Constantes : `UPPER_SNAKE_CASE`
- Modèles Prisma : `minuscules` (générés automatiquement par prisma db pull)

### Structure d'un controller

```javascript
const maFonction = async (req, res, next) => {
  try {
    const result = await monService.maLogique(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
```

### Structure d'une route

```javascript
router.get(
  "/endpoint",
  authenticateToken,
  authorizeRole("admin"),
  monController.maFonction,
);
```

### Middlewares disponibles

- `authenticateToken` : vérifie le JWT
- `authorizeRole('client' | 'technicien' | 'admin')` : vérifie le rôle
- `errorHandler` : gestion centralisée des erreurs (déjà en place)

---

## Sécurité

- JWT stocké côté client
- Bcrypt pour le hachage des mots de passe
- Variables d'environnement dans `.env` (ne jamais committer)
- CORS configuré pour autoriser uniquement le frontend
- Validation des données entrantes avant traitement

### Variables d'environnement (.env)

```
DATABASE_URL=postgresql://homecyclhome_user:PASSWORD@localhost:5432/homecyclhome_db?schema=public
JWT_SECRET=
PORT=3000
NODE_ENV=development
```

---

## Déploiement

- Backend : conteneur Docker
- Base de données : conteneur Docker (PostgreSQL)
- Frontend : servi par Nginx
- Orchestration : Docker Compose
- CI/CD : GitHub Actions (déjà configuré)
- Hébergement : VPS

---

CopierHomeCycl'Home — Contexte projet pour Claude Code
Présentation
Application web de gestion de rendez-vous pour la réparation et l'entretien de vélos à domicile.
Entreprise : LeCycleLyonnais (68 ans d'expérience dans la vente et l'entretien de bicyclettes).
Trois types d'utilisateurs : Client, Technicien, Administrateur.

Stack technique
CoucheTechnologieFrontendReact + Vite + React RouterRequêtes HTTPFetch APIBackendNode.js + Express.jsBase de donnéesPostgreSQLORMPrismaAuthentificationJWT + bcryptCalendrierFullCalendarGéocodageGéoplateforme IGN (Base Adresse Nationale)Serveur webNginx (reverse proxy)ConteneurisationDocker + Docker ComposeVersioningGit + GitHubCI/CDGitHub Actions

Architecture du projet
HomeCyclHome/
├── backend/
│ ├── config/
│ │ └── prisma.js # Instance Prisma
│ ├── controllers/ # Logique de traitement des requêtes
│ ├── middlewares/ # Auth, gestion des erreurs, validation
│ ├── prisma/
│ │ ├── migrations/
│ │ └── schema.prisma # Schéma de la base de données
│ ├── routes/ # Définition des routes API
│ ├── services/ # Logique métier
│ ├── app.js # Point d'entrée Express
│ └── Dockerfile
├── frontend/
│ ├── src/
│ │ ├── components/ # Composants React réutilisables
│ │ ├── pages/ # Pages de l'application
│ │ ├── services/ # Appels API depuis le front
│ │ └── main.jsx
│ └── vite.config.js
├── docker-compose.yml
└── CLAUDE.md

Architecture backend
Le backend suit une organisation stricte en couches :
Route → Controller → Service → Prisma (BDD)

Routes : définissent les endpoints et appliquent les middlewares
Controllers : reçoivent la requête, appellent le service, renvoient la réponse
Services : contiennent toute la logique métier
Middlewares : authentification JWT, gestion des erreurs, validation des données
Prisma : accès à la base de données PostgreSQL

API REST

Toutes les routes sont préfixées par /api/v1/
Les réponses sont au format JSON
Format des erreurs :

json{
"status": 400,
"message": "Description de l'erreur"
}
Routes publiques (sans authentification)

POST /api/v1/auth/register
POST /api/v1/auth/login

Routes protégées (JWT requis)
Toutes les autres routes nécessitent un token JWT dans le header :
Authorization: Bearer <token>

Rôles utilisateurs
RôleValeurDescriptionClientclientRéserve des interventionsTechnicientechnicienGère son planning et réalise les interventionsAdministrateuradminSupervise toute la plateforme
Chaque utilisateur a un seul rôle.
Un compte peut être désactivé sans être supprimé (champ statut_compte).

Entités principales (base de données)
UTILISATEUR

id_utilisateur, nom, prenom, email (unique), mot_de_passe (haché bcrypt)
telephone, date_creation, statut_compte (actif/inactif)
Lié à : ROLE, ADRESSE, CYCLE, DISPONIBILITES, RENDEZ_VOUS

ADRESSE

id_adresse, rue, numero_rue, complement_adresse
Lié à : VILLE, ZONE, UTILISATEUR

ZONE

id_zone, nom_zone, code_postal, latitude, longitude
Lié à : ADRESSE, TECHNICIEN (UTILISATEUR), DISPONIBILITES

CYCLE (vélo du client)

id_cycle, marque, annee, commentaire
Lié à : TYPE_CYCLE, UTILISATEUR

TYPE_CYCLE

id_type_cycle, libelle (ex: vélo classique, VAE...)

FORFAIT_INTERVENTION

id_service, nom_service, prix, duree_estimee_minutes, description
La durée du forfait détermine la durée du créneau réservé

DISPONIBILITES

id_disponibilite, jour_semaine, heure_debut, heure_fin
Appartient à un technicien (UTILISATEUR)

RENDEZ_VOUS (entité centrale)

id_rendez_vous, date_rdv, heure_rdv, prix, commentaire, duree_rdv
Lié à : UTILISATEUR (client + technicien), ADRESSE, CYCLE, FORFAIT_INTERVENTION
Lié à : STATUS_RENDEZ_VOUS, PAIEMENT, PHOTOS, PRODUIT_RENDEZ_VOUS

STATUS_RENDEZ_VOUS

id_status_rendez_vous, libelle (ex: en attente, confirmé, réalisé, annulé)

PRODUIT

id_produit, nom_produit, photo_produit, commentaire, description
Lié à : STOCK

PRODUIT_RENDEZ_VOUS (table intermédiaire)

id_produit_rendez_vous, prix_unitaire, quantite
Le prix_unitaire est stocké au moment de la réservation (historique de facturation)

PHOTOS

id_photo, url_photo, commentaire, date_ajout
Associées à un RENDEZ_VOUS (photos avant par client, photos après par technicien)

PAIEMENT

id_paiement, montant, date_paiement
Lié à : STATUS_PAIEMENT

STATUS_PAIEMENT

id_status, libelle (ex: en attente, payé)

STOCK

id_stock, quantite

SOCIETE

id_societe, nom_societe, telephone, email, adresse, ville, code_postal

Règles métier importantes
Réservations

Un client doit être connecté pour réserver
Une réservation ne peut être créée que sur un créneau disponible
Un technicien ne peut pas avoir plus d'une réservation sur le même créneau
Une réservation annulée libère automatiquement le créneau
La réservation est possible uniquement si l'adresse du client est dans la zone du technicien

Disponibilités

Les disponibilités d'un même technicien ne doivent pas se chevaucher
Un créneau réservé devient indisponible pour les autres clients

Zones

Un technicien doit avoir au moins une zone pour être réservable
Une zone peut couvrir plusieurs techniciens

Produits

Le prix unitaire est enregistré au moment de la réservation (pas au moment du paiement)

Comptes

Les mots de passe sont hachés avec bcrypt avant stockage
Un compte désactivé ne peut plus se connecter mais ses données sont conservées

Fonctionnalités par rôle
Client

Créer un compte / se connecter
Gérer ses vélos (ajouter, modifier, supprimer)
Réserver une intervention (choisir forfait → créneau → vélo → produits → photos)
Annuler ou modifier un rendez-vous
Consulter ses réservations passées et futures

Technicien

Consulter ses interventions (passées, du jour, à venir)
Voir les détails d'une intervention et les infos client
Modifier une intervention
Ajouter des commentaires et des photos après intervention
Marquer une intervention comme réalisée
Annuler une intervention
Procéder au paiement en fin d'intervention

Administrateur

Gérer les informations de la société
Gérer les comptes utilisateurs (créer, modifier, désactiver)
Gérer les interventions (afficher, modifier, supprimer)
Afficher le planning par technicien
Gérer les forfaits, les produits, les zones géographiques

Conventions de code
Général

Language : JavaScript (ES6+)
Pas de var, utiliser const et let
Async/await pour toutes les opérations asynchrones
Gestion des erreurs avec try/catch dans les controllers

Nommage

Fichiers : kebab-case (ex: auth.controller.js, user.service.js)
Variables et fonctions : camelCase
Constantes : UPPER_SNAKE_CASE
Tables Prisma : PascalCase

Structure d'un controller
javascriptconst maFonction = async (req, res, next) => {
try {
const result = await monService.maLogique(req.body);
res.status(200).json(result);
} catch (error) {
next(error);
}
};
Structure d'une route
javascriptrouter.get('/endpoint', authenticateToken, authorizeRole('admin'), monController.maFonction);
Middlewares disponibles

authenticateToken : vérifie le JWT
authorizeRole('client' | 'technicien' | 'admin') : vérifie le rôle
errorHandler : gestion centralisée des erreurs (déjà en place)

Sécurité

JWT stocké côté client (localStorage ou cookie httpOnly)
Bcrypt pour le hachage des mots de passe
Variables d'environnement dans .env (ne jamais committer)
CORS configuré pour autoriser uniquement le frontend
Validation des données entrantes avant traitement

Variables d'environnement (.env)
DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=

Déploiement

Backend : conteneur Docker
Base de données : conteneur Docker (PostgreSQL)
Frontend : servi par Nginx
Orchestration : Docker Compose
CI/CD : GitHub Actions (déjà configuré)
Hébergement : VPS

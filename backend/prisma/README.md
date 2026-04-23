# Prisma - HomeCycl'Home

## Configuration initiale

### 1. Introspection de la base existante

Si votre base PostgreSQL existe déjà avec les tables, synchronisez Prisma :

```bash
npx prisma db pull
```

### 2. Générer le client Prisma

```bash
npx prisma generate
```

### 3. Créer une migration initiale (optionnel)

Si vous partez de zéro :

```bash
npx prisma migrate dev --name init
```

## Commandes utiles

### Visualiser la base de données

```bash
npx prisma studio
```

### Appliquer les migrations (production)

```bash
npx prisma migrate deploy
```

### Créer une nouvelle migration

```bash
npx prisma migrate dev --name nom_de_la_migration
```

### Réinitialiser la base (développement)

```bash
npx prisma migrate reset
```

### Vérifier le statut des migrations

```bash
npx prisma migrate status
```

## Utilisation dans le code

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Exemple : récupérer tous les utilisateurs
const users = await prisma.utilisateur.findMany({
  include: {
    role: true,
  },
});

// Exemple : créer un utilisateur
const newUser = await prisma.utilisateur.create({
  data: {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    motDePasse: "hashed_password",
    telephone: "0612345678",
    dateCreation: new Date(),
    statusCompte: true,
    idRole: 1,
  },
});
```

## Structure

- `schema.prisma` : Définition du modèle de données
- `migrations/` : Historique des migrations (versionné)
- `.env` : Variables d'environnement (DATABASE_URL)

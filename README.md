# HomeCycl'Home

Application de gestion de réparations de vélos à domicile.

## Technologies

- **Backend**: Node.js 20 + Express + Prisma
- **Frontend**: React 19 + Vite
- **Base de données**: PostgreSQL 18
- **Déploiement**: Docker + GitHub Actions

## Démarrage rapide

### Développement local

```bash
# Démarrer les services avec Docker Compose
docker-compose up -d

# Backend disponible sur http://localhost:3000
# Frontend disponible sur http://localhost:5173
```

### Déploiement

Le déploiement est automatisé via GitHub Actions lors des push sur la branche `main`.

## Documentation

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour les détails du déploiement.

# HomeCycl'Home - CI/CD Documentation

## 📦 Architecture de Déploiement

L'application utilise Docker Compose pour orchestrer 3 services :

- **PostgreSQL** : Base de données
- **Backend** : API Node.js + Express + Prisma
- **Frontend** : Application React servie par Nginx

## 🚀 Configuration du CI/CD

### 1. Prérequis GitHub

Définir les secrets suivants dans GitHub : **Settings → Secrets and variables → Actions → New repository secret**

```
VPS_HOST          # Adresse IP ou domaine de votre VPS
VPS_USERNAME      # Nom d'utilisateur SSH (ex: root ou ubuntu)
VPS_SSH_KEY       # Clé privée SSH (contenu du fichier id_rsa)
VPS_PORT          # Port SSH (optionnel, par défaut 22)
```

### 2. Générer une clé SSH

Sur votre machine locale :

```bash
ssh-keygen -t ed25519 -C "github-actions-homecyclhome"
```

Copiez la clé publique sur votre VPS :

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@votre-vps-ip
```

Copiez le contenu de la clé privée dans le secret `VPS_SSH_KEY` :

```bash
cat ~/.ssh/id_ed25519
```

### 3. Configuration du VPS

Connectez-vous à votre VPS et préparez l'environnement :

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Créer le répertoire de l'application
sudo mkdir -p /opt/homecyclhome
cd /opt/homecyclhome

# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/VOTRE-REPO.git .

# Créer le fichier .env
cp .env.example .env
nano .env  # Éditer avec vos vraies valeurs
```

Éditez le fichier `.env` sur le VPS avec vos valeurs de production :

```env
POSTGRES_DB=homecyclhome
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mot_de_passe_tres_securise_production
BACKEND_PORT=3000
NODE_ENV=production
JWT_SECRET=secret_jwt_aleatoire_et_securise_64_caracteres_min
```

### 4. Premier déploiement manuel

Sur le VPS :

```bash
cd /opt/homecyclhome

# Build et démarrage
docker compose up -d

# Vérifier les logs
docker compose logs -f

# Vérifier le statut
docker compose ps
```

### 5. Configuration du docker-compose pour production

Créez un fichier `docker-compose.prod.yml` sur votre VPS :

```yaml
version: "3.8"

services:
  db:
    image: postgres:16-alpine
    container_name: homecyclhome-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ghcr.io/VOTRE-USERNAME/VOTRE-REPO/backend:latest
    container_name: homecyclhome-backend
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: ${BACKEND_PORT}
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - app-network

  frontend:
    image: ghcr.io/VOTRE-USERNAME/VOTRE-REPO/frontend:latest
    container_name: homecyclhome-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
```

### 6. Workflow CI/CD

Le workflow se déclenche automatiquement :

**Sur push sur `main` :**

1. ✅ Exécute les tests et linting
2. 🐳 Build les images Docker
3. 📤 Push les images sur GitHub Container Registry
4. 🚀 Déploie automatiquement sur le VPS

**Sur push sur `develop` ou PR :**

1. ✅ Exécute les tests et linting
2. 🐳 Build les images Docker
3. 📤 Push les images (mais pas de déploiement)

## 🔐 Sécurité

### Rendre les images du registry publiques OU configurer l'accès

**Option 1 : Images publiques**

- Aller sur GitHub → Packages → Sélectionner votre package → Package settings
- "Change visibility" → Public

**Option 2 : Utiliser un token pour le VPS**

```bash
# Sur le VPS
echo "VOTRE_GITHUB_TOKEN" | docker login ghcr.io -u VOTRE_USERNAME --password-stdin
```

Créez un Personal Access Token :

- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Permissions : `read:packages`

## 📊 Commandes utiles

### Sur le VPS

```bash
# Voir les logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend

# Redémarrer un service
docker compose restart backend

# Voir le statut
docker compose ps

# Entrer dans un conteneur
docker compose exec backend sh

# Mettre à jour manuellement
docker compose pull
docker compose up -d

# Nettoyer
docker system prune -a
```

### Migrations Prisma

```bash
# Exécuter les migrations
docker compose exec backend npx prisma migrate deploy

# Voir le statut des migrations
docker compose exec backend npx prisma migrate status

# Générer le client Prisma
docker compose exec backend npx prisma generate
```

## 🔍 Troubleshooting

### Le déploiement échoue

```bash
# Vérifier les logs GitHub Actions
# Vérifier la connexion SSH
ssh user@votre-vps-ip

# Vérifier Docker sur le VPS
docker ps
docker logs homecyclhome-backend
```

### Base de données ne démarre pas

```bash
# Vérifier les logs
docker compose logs db

# Recréer le volume si nécessaire
docker compose down -v
docker compose up -d
```

### Backend ne se connecte pas à la DB

```bash
# Vérifier la variable DATABASE_URL
docker compose exec backend printenv DATABASE_URL

# Tester la connexion
docker compose exec backend npx prisma db pull
```

## 🌐 Accès à l'application

- **Frontend** : http://votre-vps-ip
- **API Backend** : http://votre-vps-ip/api
- **Health Check** : http://votre-vps-ip/api/health

## 📝 Prochaines étapes

1. ✅ Configurer un nom de domaine
2. ✅ Installer un certificat SSL avec Let's Encrypt
3. ✅ Configurer des sauvegardes automatiques de la DB
4. ✅ Mettre en place un monitoring (Prometheus + Grafana)
5. ✅ Configurer des alertes (email/Slack)

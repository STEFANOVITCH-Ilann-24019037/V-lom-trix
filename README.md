# Vélométrix

SaaS de maintenance prédictive pour vélo.

## Architecture

```
velometrix/
├── backend/      Laravel 11 — API unique (web + mobile)
├── web-app/      Vue 3 + Vite + Tailwind
└── mobile-app/   React Native + Expo
```

## Lancer le projet

### Backend (Laravel)

```bash
cd backend
cp .env.example .env
# Renseigner STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, FCM_SERVER_KEY dans .env
php artisan key:generate
php artisan migrate
php artisan serve
# API disponible sur http://localhost:8000
```

### Web App (Vue.js)

```bash
cd web-app
npm install
npm run dev
# Disponible sur http://localhost:5173
```

### Mobile App (Expo)

```bash
cd mobile-app
npm install
npx expo start
# Scanner le QR code avec Expo Go
```

## Variables d'environnement backend

| Variable | Description |
|----------|-------------|
| `STRAVA_CLIENT_ID` | Client ID de l'app Strava |
| `STRAVA_CLIENT_SECRET` | Client Secret Strava |
| `STRAVA_REDIRECT_URI` | `http://localhost:8000/api/strava/callback` |
| `FCM_SERVER_KEY` | Clé Firebase Cloud Messaging |

## Endpoints API principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/register` | Inscription |
| POST | `/api/login` | Connexion → retourne token |
| GET | `/api/dashboard` | Dashboard complet |
| GET | `/api/bikes` | Liste des vélos |
| POST | `/api/bikes` | Créer un vélo |
| GET | `/api/bikes/{id}/parts` | Pièces d'un vélo |
| POST | `/api/parts/{id}/change` | Enregistrer un changement |
| GET | `/api/strava/redirect` | URL OAuth Strava |
| POST | `/api/sync` | Synchro manuelle Strava |
| GET | `/api/mobile/dashboard` | Dashboard mobile allégé |

## Cron (production)

```bash
# Crontab — toutes les heures
0 * * * * cd /path/to/backend && php artisan strava:sync
0 * * * * cd /path/to/backend && php artisan wear:check
```

# MOUNT UP - KBTU Web Project

MOUNT UP is a full-stack web application for mountain climbers who can monitor their progress and learn information about the mountains. The project combines an Angular frontend and a Django REST Framework backend with JWT authentication.

## Team

| Full Name           | Role                                  |
| ------------------- | ------------------------------------- |
| Nurakynov Nursultan | Frontend / Angular                    |
| Kudaibergen Arsen   | Backend / Django DRF                  |
| Aubanov Assylbek    | Integration / Testing / Documentation |

## Stack

- Frontend: Angular 20 (standalone components), FormsModule, HttpClient
- Backend: Django 4.2, DRF, SimpleJWT
- Database: SQLite (development)

## Repository Structure

- `src/` - Angular frontend
- `backend/` - Django + DRF backend
- `postman/` - API Postman collection

## Quick Start

### Backend

```bash
python -m pip install -r ./backend/requirements.txt
python ./backend/manage.py makemigrations
python ./backend/manage.py migrate
python ./backend/manage.py runserver
```

Backend base URL: `http://127.0.0.1:8000/api/`

### Frontend

```bash
npm install
npm start
```

Frontend URL: `http://localhost:4200`

## API Endpoints

- `POST /api/register/` - register user
- `POST /api/login/` - issue JWT access and refresh
- `POST /api/logout/` - blacklist refresh token
- `GET /api/profile/` - current user profile
- `GET/POST /api/mountains/` - list/create mountains
- `GET/PUT/DELETE /api/mountains/<id>/` - mountain detail CRUD
- `GET/POST /api/ascents/` - list/create ascents
- `GET/POST /api/comments/` - list/create comments

## Postman

- Collection path: `postman/mountup.postman_collection.json`
- Includes auth, profile, mountains CRUD, ascents, comments, and example responses.

## Requirement Coverage Summary

- Angular interfaces and API services are implemented in `src/app/interfaces/` and `src/app/services/`.
- Routing is configured in `src/app/app.routes.ts` with named routes.
- JWT auth uses interceptor + login/logout flow (`src/app/interceptors/auth.interceptor.ts`, `src/app/services/auth.service.ts`).
- Error handling is present in auth/catalog/profile UI pages.
- Django backend includes 4 models, multiple FK relations, Serializer + ModelSerializer classes, FBV + CBV endpoints, token-based auth endpoints, and Mountain CRUD.
- CORS is configured for Angular dev server in `backend/config/settings.py`.

## Verification Commands

```bash
python ./backend/manage.py check
python ./backend/manage.py migrate
npm run build
```

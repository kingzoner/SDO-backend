# SDO - Backend and Frontend

FastAPI backend with PostgreSQL plus a React/TypeScript frontend (glassmorphic purple/blue theme).

## Prerequisites
- Python 3.11+
- Node 18+ (for the frontend)
- Docker & Docker Compose (optional, for containerized run)

## Configuration
Copy `.env.example` to `.env` and adjust as needed:
```
APP__HOST=0.0.0.0
APP__PORT=8000
APP__CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DATABASE__HOST=db
DATABASE__PORT=5432
DATABASE__USER=root
DATABASE__PASSWORD=root
DATABASE__NAME=postgres
JWT__SECRET_KEY=change_me
JWT__ALGORITHM=HS256
JWT__EXPIRES_IN=2592000
```

## Local backend (venv)
```bash
python -m venv .venv
.venv/Scripts/activate  # or source .venv/bin/activate on *nix
pip install -r requirements.txt
python -m app.main
# API docs: http://localhost:8000/docs
```

## Backend with Docker
```bash
docker-compose up --build
# App: http://localhost:8000
```

## Frontend (development)
```bash
cd frontend
npm install
npm run dev  # opens on http://localhost:5173
```
Create `frontend/.env` if you need a custom API URL:
```
VITE_API_URL=http://localhost:8000
```

## Tests (backend)
TBD: run `pytest` once smoke tests are added.

## Prisma Studio (optional DB viewer)
```
cp prisma/.env.prisma.example prisma/.env.prisma   # adjust port/user/password if needed
npx prisma db pull --schema prisma/schema.prisma --dotenv prisma/.env.prisma
npx prisma studio --schema prisma/schema.prisma --dotenv prisma/.env.prisma
```

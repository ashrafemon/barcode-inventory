# Inventory Management Monorepo

A full-stack inventory management system built with:

- **API:** [NestJS](https://nestjs.com/) (`apps/api`)
- **Frontend:** [Next.js](https://nextjs.org/) (`apps/web`)
- **Monorepo:** Managed with [Turborepo](https://turbo.build/)
- **Containerization:** [Docker](https://www.docker.com/) & [docker-compose](https://docs.docker.com/compose/)

---

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development (without Docker)](#local-development-without-docker)
- [Running with Docker](#running-with-docker)
- [Scripts & Utilities](#scripts--utilities)
- [Deployment](#deployment)
- [Resources](#resources)

---

## Project Structure

```
apps/
  api/      # NestJS backend API
  web/      # Next.js frontend
docker-compose.yml    # Multi-service Docker setup
mongo-keyfile         # MongoDB replica set keyfile
```

---

## Prerequisites

- **Node.js** >= 18 ([Download](https://nodejs.org/))
- **npm** >= 10
- **MongoDB** (local or Docker)
- **Docker** & **docker-compose** (for containerized setup)

---

## Local Development (without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

- **Option 1:** Install and run MongoDB locally.
- **Option 2:** Use Docker for MongoDB only:

```bash
docker run --name inventory-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=ashrafemon143 -e MONGO_INITDB_ROOT_PASSWORD=bKA1M4MRpJoQTMP3 -d mongo:6.0
```

### 3. Start the API (NestJS)

```bash
cd apps/api
npm run dev
# API runs on http://localhost:5000
```

### 4. Start the Frontend (Next.js)

```bash
cd apps/web
npm run dev
# Frontend runs on http://localhost:3000
```

---

## Running with Docker

### 1. Build and start all services

```bash
docker-compose up --build
```

- **API:** http://localhost:5000
- **Frontend:** http://localhost:3000
- **MongoDB:** Internal, exposed on 27017

### 2. Stopping services

```bash
docker-compose down
```

---

## Scripts & Utilities

From the root directory, you can use Turborepo scripts:

| Script                | Description               |
| --------------------- | ------------------------- |
| `npm run dev`         | Run all apps in dev mode  |
| `npm run build`       | Build all apps/packages   |
| `npm run lint`        | Lint all apps/packages    |
| `npm run format`      | Format code with Prettier |
| `npm run check-types` | Type-check all packages   |

Or run per-app scripts in `apps/api` and `apps/web`.

---

## Deployment

- **NestJS API:** See [apps/api/README.md](apps/api/README.md) for deployment instructions.
- **Next.js Frontend:** See [apps/web/README.md](apps/web/README.md) for deployment instructions (e.g., Vercel).

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/docs)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## License

MIT

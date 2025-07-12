Here is a **professional and complete documentation** you can submit as your final assessment for the Barcode-Driven Inventory System. It is structured to clearly showcase your choices, architecture, features, and instructions for both local and live setups.

---

# 📦 Barcode-Driven Inventory Management System

A full-stack responsive inventory management system with **barcode scanning**, **drag-and-drop Kanban board**, and **category management**.

![Project Architecture](https://dummyimage.com/900x300/eeeeee/000&text=System+Architecture+Overview)

---

## 🔗 Live Demo

**🔗 Application URL**: [https://inventory.leafwrap.online](https://inventory.leafwrap.online)

**🔐 Credentials**:

- **Username**: `Register your account`
- **Password**: `Register your account`

---

## 📚 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Core Features](#core-features)
3. [Bonus Features](#bonus-features)
4. [Project Structure](#project-structure)
5. [Installation & Running Locally](#installation--running-locally)
6. [Running with Docker](#running-with-docker)
7. [API Overview](#api-overview)
8. [Kanban UX](#kanban-ux)
9. [Resources](#resources)

---

## 🧰 Tech Stack

### 🖥️ Frontend

| Feature          | Stack                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| Framework        | [Next.js](https://nextjs.org/)                                                    |
| Styling          | [TailwindCSS](https://tailwindcss.com/), [Mantine UI](https://mantine.dev/)       |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org/)                                    |
| Forms            | [React Hook Form](https://react-hook-form.com/)                                   |
| Drag-and-Drop    | [@caldwell619/react-kanban](https://christopher-caldwell.github.io/react-kanban/) |
| Barcode Scanner  | [html5-qrcode](https://github.com/mebjas/html5-qrcode)                            |

### 🧪 Backend

| Feature        | Stack                               |
| -------------- | ----------------------------------- |
| Framework      | [NestJS](https://nestjs.com/)       |
| Database       | [MongoDB](https://www.mongodb.com/) |
| ORM            | [Prisma](https://www.prisma.io/)    |
| Authentication | (Optional) JWT-based                |

### ⚙️ DevOps

| Feature          | Stack                                             |
| ---------------- | ------------------------------------------------- |
| Monorepo         | [Turborepo](https://turbo.build/)                 |
| Containerization | [Docker](https://www.docker.com/), Docker Compose |
| Version Control  | Git (GitHub/GitLab/Bitbucket)                     |

---

## ✅ Core Features

### 🔍 Barcode Scanning

- Scans product barcodes using the **device camera**.
- Fetches product details from:
  `https://products-test-aci.onrender.com/product/[barcode]`
- Stores new product in the database under **"Uncategorized"** category.

### 🧾 Kanban Inventory Board

- Fully responsive **drag-and-drop interface**.
- Dynamically create/delete custom categories.
- Products can be moved across categories.
- Data is persisted in MongoDB.

### 🔧 API Backend

- RESTful APIs built with NestJS and Prisma.
- Endpoints:
    - `POST /products` – Add a new product.
    - `GET /products` – Get all products (optional filter by category).
    - `PATCH /products/:id` – Update product.
    - `POST /categories` – Add a new category.
    - `GET /categories` – Get all categories.

---

## 🌟 Bonus Features

- 🔐 **Authentication** _(optional)_
  Secured routes for admin users.

- 📊 **Analytics Dashboard** _(optional)_
    - Count of products per category.
    - Recently added products.

---

## 📁 Project Structure

```
inventory-system/
├── apps/
│   ├── api/        # NestJS backend API
│   └── web/        # Next.js frontend
├── docker-compose.yml
├── mongo-keyfile
├── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10
- Docker (optional but recommended)
- MongoDB (if not using Docker)

---

## 🧑‍💻 Installation & Running Locally (No Docker)

### 1. Clone the Repo

```bash
git clone https://github.com/ashrafemon/barcode-inventory.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

#### Fill database url from mongodb atlas and jwt secret in api .env

```bash
cd apps/api
cp .env.example .env
```

#### Fill api url in web .env

```bash
cd apps/web
cp .env.example .env
```

### 4. Start Backend (NestJS)

```bash
cd apps/api
npx prisma generate
npm run dev
# API: http://localhost:5000
# SwaggerDocs: http://localhost:5000/api/request-docs
```

### 5. Start Frontend (Next.js)

```bash
cd apps/web
npm run dev
# UI: http://localhost:3000
```

### 6. Start Turborepo for both (Frontend and Backend)

```bash
npm run dev
# UI: http://localhost:3000
# API: http:://localhost:5000
# SwaggerDocs: http://localhost:5000/api/request-docs
```

---

## 🐳 Running with Docker

### 1. Start MongoDB (via Docker or Local) (Optional if already done)

```bash
docker run --name inventory-mongo -p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=ashrafemon143 \
-e MONGO_INITDB_ROOT_PASSWORD=bKA1M4MRpJoQTMP3 \
-d mongo:6.0
```

### 2. Generate mongo keyfile (Optional if exists in project)

```bash
openssl rand -base64 756 > mongo-keyfile
chmod 400 mongo-keyfile
```

### 3. Start Docker

```bash
docker-compose up --build -d
```

### 4. Authentication for replicas (Optional if already done)

```bash
docker compose exec database mongosh -u ashrafemon143 -p bKA1M4MRpJoQTMP3 --authenticationDatabase admin --eval "rs.initiate()"
```

Access:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- SwaggerDocs: `http://localhost:5000/api/request-docs`
- MongoDB: exposed on `27017`

To stop:

```bash
docker-compose down
```

---

## 📡 API Overview

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/products`       | List all products   |
| POST   | `/products`       | Add a new product   |
| GET    | `/products/:id`   | Get product         |
| PATCH  | `/products/:id`   | Update product      |
| DELETE | `/products/:id`   | Delete product      |
| GET    | `/categories`     | Get all categories  |
| POST   | `/categories`     | Create new category |
| GET    | `/categories/:id` | Get category        |
| PATCH  | `/categories/:id` | Update category     |
| DELETE | `/categories/:id` | Delete category     |

- SwaggerDocs: `http://localhost:5000/api/request-docs`

---

## 🧠 Kanban UX Overview

| Action               | Result                             |
| -------------------- | ---------------------------------- |
| Scan product barcode | Adds product under "Uncategorized" |
| Drag product card    | Updates category                   |
| Add category         | New column created on Kanban board |
| Responsive UI        | Fully responsive for mobile/tablet |

---

## 🗃️ Resources & Links

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Mantine UI](https://mantine.dev/)
- [Turborepo](https://turbo.build/)
- [Prisma ORM](https://www.prisma.io/docs)

---

## 📎 Submission Checklist

- ✅ Barcode scanning works (tested with [Google Drive Barcodes](https://drive.google.com/drive/folders/1x1jUIMSoK1Qlbv7bisuQdovWtsnl3DUU?usp=sharing))
- ✅ Responsive Kanban board with drag-and-drop
- ✅ Working backend API with category/product support
- ✅ MongoDB persistence
- ✅ Project runs both locally and via Docker
- ✅ Clean README & deployment-ready

---

## 📄 License

Licensed under the MIT License.

---

## 🙋‍♂️ Author

**Ashraf Emon**
[GitHub](https://github.com/ashrafemon) | [LinkedIn](https://www.linkedin.com/in/aiemon/)

---

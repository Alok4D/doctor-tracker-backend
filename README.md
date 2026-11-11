# Doctor Tracker — Hospital Admin REST API (Backend)

## 1. Description

**Doctor Tracker Backend** is a high-performance, modular RESTful API built with **Node.js**, **Express 5**, **TypeScript**, **Zod**, and **MongoDB (Mongoose)**. It powers the Doctor Tracker administrative portal with JWT-authenticated route protection, indexed multi-criteria search/filtering/pagination, doctor-patient relational assignment management, and MongoDB aggregation pipelines for real-time hospital analytics.

---

## 2. Setup Guide

### Prerequisites
- Node.js `v18+`
- MongoDB Atlas URI (or local MongoDB server)

### Step-by-Step Local Installation

1. **Clone the repository:**
   ```bash
   git clone <your-backend-repo-url>
   cd doctor-tracker-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string and JWT secrets:
   ```bash
   cp .env.example .env
   ```
   `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=mongodb+srv://<db_username>:<db_password>@cluster0.1yjndj5.mongodb.net/doctor-tracker?retryWrites=true&w=majority
   BCRYPT_SALT_ROUNDS=12
   DEFAULT_PASS=password123
   JWT_ACCESS_SECRET=your_jwt_access_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=365d
   ```

4. **Seed Sample Data (Optional for testing):**
   ```bash
   npm run seed
   ```
   Seeds 2 admin accounts (`admin@doctor-tracker.com` / `password123`), 14 specialist doctors, and 20 patients across all medical conditions and statuses.

5. **Run the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000` with API prefix `/api/v1`.

6. **Postman Collection:**
   Import `doctor-tracker.postman_collection.json` from the repository root to test all Auth, Doctor, Patient, and Dashboard endpoints.

---

## 3. System Architecture

Each feature domain is encapsulated inside `src/app/modules/<module>` following a clean Controller -> Service -> Validation -> Model architecture:

```
Client Request -> Express Router -> auth('admin') JWT Guard -> validateRequest(Zod) -> Controller -> Service (Mongoose/Aggregation) -> sendResponse()
```

### API Endpoints (`/api/v1`)
- **Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Doctors (Protected):** `GET /doctors`, `POST /doctors`, `GET /doctors/:id`, `PATCH /doctors/:id`, `DELETE /doctors/:id`, `GET /doctors/:id/patients`, `POST /doctors/:id/patients`, `DELETE /doctors/:id/patients/:patientId`
- **Patients (Protected):** `GET /patients`, `POST /patients`, `GET /patients/:id`, `PATCH /patients/:id`, `DELETE /patients/:id`
- **Dashboard Analytics (Protected):** `GET /dashboard/stats`, `GET /dashboard/patients-overview`, `GET /dashboard/specialty-stats`, `GET /dashboard/patients-per-doctor`

---

## 4. Technical Decisions

### Decision 1: MongoDB Indexing & Aggregation Pipelines for Analytics & Scale
Instead of running sequential JavaScript loops over populated documents, `Doctor` (`specialization`, `hospital`, `status`, `createdAt`, text index on `name`/`specialization`/`email`) and `Patient` (`doctorId`, `condition`, `status`, `createdAt`, text index on `name`/`phone`/`condition`) define compound & field indexes. Dashboard metrics and `patientCount` per doctor are computed directly in MongoDB via `$lookup`, `$group`, and `$project` aggregation stages.

### Decision 2: Zod Schema Validation + Centralized Error Handling
Every incoming `POST` and `PATCH` payload passes through `validateRequest` middleware backed by **Zod** schemas before reaching controllers, paired with `catchAsync` and a global Express error handler (`AppError`, Mongoose validation/cast/duplicate key error formatters) ensuring consistent HTTP status codes and clean API responses.

---

## 5. Visual Evidence

- All endpoints verified via Postman (`doctor-tracker.postman_collection.json`) and integrated live with the Next.js frontend.

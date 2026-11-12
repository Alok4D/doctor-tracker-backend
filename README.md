# <img src="public/logo/doctor-tracker-logo.png" alt="Doctor Tracker Logo" width="32" align="absmiddle" />&nbsp;&nbsp;Doctor Tracker — Backend API

This is the backend for the **Doctor Tracker – Hospital Doctor & Patient Management System**. It provides a secure, modular RESTful API built with Node.js, Express, TypeScript, and MongoDB.

## 🔗 Live Links
- **Frontend**: https://doctor-tracker-zone.vercel.app
- **Backend**: https://doctor-tracker-backend-git-main-alok-roys-projects.vercel.app

## 🔑 Demo Login Credentials

| 👑 Admin Account |
| :--- |
| **Email:** `admin@doctortracker.com`<br>**Pass:** `Admin@12345` |

## ✨ Features Implemented

### 1. Authentication & Security
- **JWT-Based Auth**: Secure login flow issuing Access Tokens and Refresh Tokens (`/api/v1/auth/login`, `/api/v1/auth/me`, `/api/v1/auth/logout`).
- **Admin Route Protection**: Custom `auth('admin')` middleware validates JWT tokens and enforces role-based access across all doctor, patient, and dashboard endpoints.
- **Password Hashing**: Uses `bcrypt` with configurable salt rounds (`BCRYPT_SALT_ROUNDS`) to securely hash user passwords.

### 2. Doctor Management
- **Full CRUD API**: Create, Read, Update, and Delete doctor records with specialty, hospital, contact, and duty status (`Active` / `Inactive`).
- **Doctor–Patient Assignment**: Dedicated endpoints to view, assign, or remove patients under a specific doctor (`/api/v1/doctors/:id/patients`).
- **Search, Filter & Pagination**: Supports `searchTerm`, `specialization`, `status`, `page`, and `limit` query parameters.

### 3. Patient Management
- **Full CRUD API**: Register, view, update, and delete patient records with demographics, medical condition, assigned physician, admission date, and status (`Admitted`, `Followup`, `Discharged`, `Transferred`).
- **Image Upload Integration**: Built-in `multer` memory storage + `Cloudinary` streaming upload (`parseFormDataWithOptionalImage`) for both doctor and patient profile photos.

### 4. Dashboard & Date-based Analytics
- **Live MongoDB Aggregations**:
  - `GET /api/v1/dashboard/stats?range=all` — Total doctors, active doctors, total patients, admitted patients, and average patients per doctor.
  - `GET /api/v1/dashboard/patients-overview?timeframe=all` — Status breakdown and date-based admission/registration statistics (`dateStats`) grouped by date or month.
  - `GET /api/v1/dashboard/patients-per-doctor` — Active caseload distribution per doctor.
  - `GET /api/v1/dashboard/specialty-stats` — Doctor distribution by specialization.

### 5. Architecture & Best Practices
- **Modular Pattern**: Organized into clean feature modules (`modules/auth`, `modules/doctor`, `modules/patient`, `modules/dashboard`) separating Routes, Controllers, Services, Models, and Zod Validations.
- **Global Error Handling**: Centralized error handler parsing Mongoose validation/cast errors, Zod schema errors, and custom API errors into standardized JSON responses.
- **Database Seeding**: Includes `src/seed.ts` (`pnpm run seed`) to populate initial admin, doctor, and patient records.

## 🛠️ Tech Stack
- **Node.js & Express.js (v5)**
- **TypeScript**
- **MongoDB & Mongoose**
- **Zod** (Request Validation)
- **JSON Web Tokens (JWT)**
- **Bcrypt** (Password Hashing)
- **Cloudinary** (Cloud Image Storage)
- **Multer** (Multipart File Uploads)
- **CORS** (Cross-Origin Security)

---

## 🚀 Project Setup & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- pnpm (`pnpm@10.29.3` recommended)
- MongoDB (Atlas cluster or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/Alok4D/doctor-tracker-backend.git
cd doctor-tracker-backend
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your credentials:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.../doctor-tracker?retryWrites=true&w=majority

BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=Admin@12345

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Seed & Run the application
**Seed initial data (optional):**
```bash
pnpm run seed
```

**Development mode:**
```bash
pnpm run dev
```

**Production mode:**
```bash
pnpm run build
pnpm run start
```
The server will start on `http://localhost:5000`.

---

## 📚 API Documentation

A complete **Postman Collection** is included in the root directory: `doctor-tracker.postman_collection.json`. Import it into Postman and run **Login Admin** first to automatically store the `{{token}}` variable.

### Key Endpoints Overview

**Auth Endpoints:**
- `POST /api/v1/auth/login` (Login & receive JWT access token)
- `GET /api/v1/auth/me` (Get current authenticated admin — requires auth)
- `POST /api/v1/auth/logout` (Logout session)

**Dashboard Endpoints (Admin Auth Required):**
- `GET /api/v1/dashboard/stats?range=all` (Supports `all`, `today`, `7d`, `30d`, `year`)
- `GET /api/v1/dashboard/patients-overview?timeframe=all` (Supports `all`, `30d`, `7d`, `year`)
- `GET /api/v1/dashboard/patients-per-doctor` (Caseload distribution per doctor)
- `GET /api/v1/dashboard/specialty-stats` (Doctors grouped by specialty)

**Doctor Endpoints (Admin Auth Required):**
- `GET /api/v1/doctors` (Supports `?searchTerm=`, `?specialization=`, `?status=`, `?page=`, `?limit=`)
- `GET /api/v1/doctors/:id` (Get single doctor)
- `POST /api/v1/doctors` (Create doctor, supports `multipart/form-data` image upload)
- `PATCH /api/v1/doctors/:id` (Update doctor)
- `DELETE /api/v1/doctors/:id` (Delete doctor)
- `GET /api/v1/doctors/:id/patients` (Get patients assigned to a doctor)
- `POST /api/v1/doctors/:id/patients` (Assign/register patient to a doctor)
- `DELETE /api/v1/doctors/:id/patients/:patientId` (Remove patient from doctor)

**Patient Endpoints (Admin Auth Required):**
- `GET /api/v1/patients` (Supports `?searchTerm=`, `?status=`, `?doctorId=`, `?page=`, `?limit=`)
- `GET /api/v1/patients/:id` (Get single patient)
- `POST /api/v1/patients` (Register patient, supports `multipart/form-data` image upload)
- `PATCH /api/v1/patients/:id` (Update patient)
- `DELETE /api/v1/patients/:id` (Delete patient)

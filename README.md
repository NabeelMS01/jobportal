# Job Portal Management System - Admin Portal

This repository contains the solution for the TNP India Round 2 Machine Test. It includes a full-stack implementation of the **Admin Portal** using React.js (Vite) on the frontend and Node.js (Express, Prisma, PostgreSQL) on the backend.

## Tech Stack
* **Frontend**: React.js, Tailwind CSS, Redux Toolkit, React Hook Form, Zod, Axios
* **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT for Authentication

## Folder Structure
* `/client`: Frontend React application.
* `/server`: Backend Node.js application.

## Prerequisites
* Node.js (v18+)
* PostgreSQL running locally or remotely.

## Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database named `jobportal`.

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Update `.env` with your actual `DATABASE_URL`.
5. Run database migrations to create tables: `npx prisma migrate dev --name init`
6. Seed the master data (creates admin user and mock jobs): `npm run prisma.seed`
7. Start the backend development server: `npm run dev` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev` (Runs on `http://localhost:5173`)

## Admin Portal Features
* **Authentication**: Login with `admin@tnp.com` and password `admin123`. Managed using JWT access tokens.
* **Redux State Management**: Used across the application for auth state and job state management.
* **Dashboard**: View all jobs in a table with pagination and filtering capabilities (via APIs).
* **Job Form**: Create and edit jobs with comprehensive form validation (Zod + React Hook Form).
* **Responsive UI**: Built beautifully with Tailwind CSS adhering to modern aesthetics.

## Note
The application strictly follows clean architecture, reusable components, and proper state management as specified in the machine test instructions.

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

## Implementation Details

### Scalability
* **Database Choice**: Uses PostgreSQL, a robust relational database capable of handling large-scale data.
* **Stateless Authentication**: Utilizes JWT for stateless session management, allowing the backend to scale horizontally without sticky sessions.
* **Efficient Data Transfer**: Implemented pagination for lists (jobs, applications) to minimize payload sizes and database load.
* **Connection Pooling**: Uses Prisma ORM which manages connection pools efficiently.

### Security
* **HTTP Headers**: Uses `helmet` to secure Express apps by setting various HTTP headers against common vulnerabilities.
* **Rate Limiting**: Implemented `express-rate-limit` on authentication routes to prevent brute-force attacks.
* **CORS Configuration**: Explicitly configured Cross-Origin Resource Sharing to allow requests only from trusted origins.
* **Data Validation**: Uses `zod` for strict runtime schema validation of incoming requests to prevent injection and malformed data.
* **Password Hashing**: Employs `bcrypt` for strong password hashing and verification.
* **Secure Tokens**: Uses JWT access and refresh tokens.

### Design Patterns
* **Controller-Service Architecture**: The backend strictly separates request handling (Controllers), business logic (Services), and routing (Routes).
* **Repository Pattern**: Prisma ORM is utilized as an abstraction layer for database access.
* **Custom Hooks Pattern**: Frontend extracts complex state and API logic into custom hooks (e.g., `useApplications`), promoting reusability.
* **Component-Based UI**: UI is broken down into small, reusable components (`Button`, `Badge`) that encapsulate their own styling and variants.

### SOLID Principles Followed
* **Single Responsibility Principle (SRP)**: Modules are highly focused. For example, `auth.service.ts` only handles authentication logic, while `Button.tsx` solely manages button UI rendering.
* **Open/Closed Principle (OCP)**: Components like `Button` are open for extension via standard HTML props and custom variants, but closed for modification for regular usage.
* **Liskov Substitution Principle (LSP)**: Custom UI components properly extend and implement native HTML attributes (like `ButtonHTMLAttributes`), ensuring they behave correctly in place of standard elements.
* **Dependency Inversion Principle (DIP)**: React components depend on abstractions (Custom Hooks for state/data) rather than concrete API implementations (Axios instances directly in the view).

## Note
The application strictly follows clean architecture, reusable components, and proper state management as specified in the machine test instructions.

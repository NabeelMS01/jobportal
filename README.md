# Job Portal Management System - Admin Portal

This repository contains the solution for the TNP India Round 2 Machine Test. It includes a full-stack implementation of the **Admin Portal** using React.js (Vite) on the frontend and Node.js (Express, Prisma, PostgreSQL) on the backend.

## Tech Stack
* **Frontend**: React.js, Tailwind CSS, Redux Toolkit, React Hook Form, Zod, Axios
* **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, Redis, JWT for Authentication

## Folder Structure
* `/client`: Frontend React application.
* `/server`: Backend Node.js application.

---

## 🚀 Setup Instructions - Fully Automated Docker Setup (Recommended)

We have containerized the entire application. With a single command, Docker will spin up the database (PostgreSQL), cache (Redis), backend (Node.js API), and frontend (React/Vite).

### Prerequisites
- **Docker & Docker Desktop**. Ensure Docker Desktop is installed, open, and running on your machine.

### Getting Started

1. **Start the application**:
   From the root of the project, run the startup script:
   ```bash
   ./start.sh
   ```
   *This script uses `docker compose` to build the images, start the containers in the background, automatically apply database migrations, insert seed data, and open your browser.*

2. **Login**:
   The frontend will automatically open at `http://localhost:5173`. You can log in using the seed credentials:
   - **Email:** `admin@tnp.com`
   - **Password:** `admin123`

### Managing the Application

- **Stop the application**:
  To gracefully stop all containers, run:
  ```bash
  ./stop.sh
  ```

- **View Logs**:
  We have provided helper scripts to easily monitor your services:
  - Watch Backend Server logs: `./logs-server.sh`
  - Watch Frontend Client logs: `./logs-client.sh`
  *(Press `Ctrl + C` in your terminal anytime to stop watching the logs).*

---

## 🛠️ Setup Instructions - Manual Setup (Without Docker)

If you prefer to run the services manually directly on your host machine.

### Prerequisites
- **Node.js** (v20 or higher recommended)
- **PostgreSQL** running locally
- **Redis** running locally

### Step 1: Database Setup  
Create a PostgreSQL database named `jobportal`.
```bash
psql -U postgres -c "CREATE DATABASE jobportal;"
```

### Step 2: Backend Setup
1. **Navigate to the server directory**:
   ```bash
   cd server
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Copy the `.env.example` file to `.env` and configure your database and Redis URLs.
   ```bash
   cp .env.example .env
   ```
4. **Run Migrations and Seed Data**:
   ```bash
   npx prisma migrate dev
   ```
   *(This will also run the seed script to create the admin user and mock jobs)*
5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   *(Runs on `http://localhost:5000`)*

### Step 3: Frontend Setup
Open a **new terminal window**.
1. **Navigate to the client directory**:
   ```bash
   cd client
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   ```bash
   cp .env.example .env
   ```
4. **Start the Frontend Application**:
   ```bash
   npm run dev
   ```
   *(Runs on `http://localhost:5173`)*

### Step 4: Login
Open `http://localhost:5173` in your browser and use the `admin@tnp.com` / `admin123` credentials.

---

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

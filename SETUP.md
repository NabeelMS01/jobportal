# Job Portal - Automated Setup Guide

This guide provides instructions to set up the entire project locally without needing to manually open a PostgreSQL GUI (like pgAdmin or DBeaver).

## Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** installed and running on your system, or **Docker** (if you prefer running the database in a container).

---

## Step 1: Database Setup  

You can choose either Method A (Local Postgres CLI) or Method B (Docker).

### Method A: Using Postgres CLI (macOS/Linux)
If you have PostgreSQL installed locally, run this command in your terminal to create the database:
```bash
# Log into postgres and create the database
psql -U postgres -c "CREATE DATABASE jobportal;"
```
*(If your postgres user doesn't require a password, or if you use your macOS username, simply running `createdb jobportal` might also work).*

### Method B: Using Docker (Fully Automated)
If you have Docker installed, you can spin up a Postgres database with a single command. 

1. Create a `docker-compose.yml` file in the root of the project (if not already present):
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: jobportal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
2. Run the database in the background:
```bash
docker-compose up -d
```

---

## Step 2: Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Copy the example environment file.
   ```bash
   cp .env.example .env
   ```
   *(The default `.env.example` is pre-configured for `postgresql://postgres:postgres@localhost:5432/jobportal?schema=public`, which matches the setup from Step 1).*

4. **Run Migrations and Seed Data**:
   This single command will apply the database schemas and automatically run the seed script to create your `admin@tnp.com` user.
   ```bash
   npx prisma migrate dev
   ```
   *(If prompted, you can name the migration "init")*.

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The backend will now be running at `http://localhost:5001`.

---

## Step 3: Frontend Setup

Open a **new terminal tab/window**.

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Copy the example environment file for the frontend.
   ```bash
   cp .env.example .env
   ```
   *(This ensures the frontend can connect to your backend API correctly).*

4. **Start the Frontend Application**:
   ```bash
   npm run dev
   ```
   The frontend will now be running at `http://localhost:5173`.

---

## Step 4: Login

Open `http://localhost:5173` in your browser.
You can now log in using the seed data generated in Step 2:
- **Email:** `admin@tnp.com`
- **Password:** `admin123`

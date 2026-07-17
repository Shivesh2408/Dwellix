# Setup & Local Installation Guide

Follow these steps to run the complete Dwellix system locally.

---

## 💾 1. Database Setup

Dwellix requires a PostgreSQL server instance.

1.  Start your PostgreSQL database engine.
2.  Connect to your PostgreSQL client (CLI or pgAdmin) and create a database named `dwellix`:
    ```sql
    CREATE DATABASE dwellix;
    ```

---

## ☕ 2. Backend REST API Setup (Spring Boot)

1.  Navigate to the `/backend` directory.
2.  Copy `.env.example` to `.env`.
3.  Configure variables inside `.env`:
    ```bash
    # Database Settings
    DATABASE_URL=jdbc:postgresql://localhost:5432/dwellix
    DATABASE_USERNAME=postgres
    DATABASE_PASSWORD=your_secure_password

    # Ports
    PORT=8080

    # API Keys
    OPENROUTER_API_KEY=your_openrouter_api_key_here
    CLOUDINARY_URL=cloudinary://key:secret@name
    ```
4.  Run compilation and boot the server:
    ```bash
    # Compile and package application jar
    ./mvnw clean package -DskipTests

    # Start Spring Boot application
    java -jar target/dwellix-backend-0.1.0.jar
    ```
    The Spring Boot server will run at [http://localhost:8080](http://localhost:8080).

---

## 📱 3. Frontend Client Setup (Next.js)

1.  Navigate to the `/frontend` directory.
2.  Create `.env.local` based on `.env.example`:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
    ```
3.  Install NPM packages:
    ```bash
    npm install
    ```
4.  Start Next.js development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your web browser.

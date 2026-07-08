# Dwellix - AI-Powered Home Management Platform

Dwellix is a premium, modern web application designed to act as an operating system for your household. It simplifies home ownership by organizing appliances, digitizing receipts, tracking warranties, scheduling technician services, and leveraging a state-of-the-art AI Workspace to assist with issues, maintenance, and diagnostics.

---

## 🚀 Key Features

*   **Premium AI Assistant Workspace**: A chat interface styled after Claude/ChatGPT, featuring context panels, dynamic conversation history grouping, voice input recognition, and home parameters integration.
*   **Appliance registry & Health Score**: A structured catalog of home appliances with computed health status, brand, model, and placement details.
*   **Warranty & Invoice Vaults**: A secure digitizing pipeline using **Cloudinary** storage to host appliance invoices, specs, and warranties, alerting users when expiration dates draw near.
*   **Maintenance Scheduler & Bookings**: Tracking technician dispatches, maintenance cycles, and scheduler timelines.
*   **Interactive Onboarding Wizard**: A step-by-step custom wizard allowing users to setup their home configuration, rooms, and appliances upon registration.

---

## 🛠️ Technical Stack

### Frontend
*   **Framework**: Next.js 16 (React 19, TypeScript)
*   **Styling**: Tailwind CSS & Vanilla CSS custom modules
*   **Animations**: Framer Motion
*   **Utility & Icons**: Lucide React & Radix UI primitives
*   **State Management**: React Context, Hooks, and Reducers

### Backend
*   **Framework**: Spring Boot 3 (Java 21)
*   **Database**: PostgreSQL
*   **Migration**: Flyway (SQL-based migrations)
*   **Security**: Spring Security 6, Cookie-based JWT authentication, Google OAuth2 Login
*   **Client**: Spring WebFlux (Reactive WebClient for asynchronous AI provider calls)

### Cloud & APIs
*   **AI Provider**: OpenRouter API (flexible models sequencing with fallback resilience)
*   **Media Hosting**: Cloudinary SDK Integration

---

## ⚙️ Configuration & Setup

### Prerequisites
*   Java Development Kit (JDK 21+)
*   Node.js (v18+) & npm
*   PostgreSQL server instance

### 1. Database Setup
Create a PostgreSQL database named `dwellix`:
```sql
CREATE DATABASE dwellix;
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the backend and frontend directories:
*   Configure the database URL, credentials, and JWT secret.
*   Add API credentials for **Cloudinary** and **OpenRouter** (required for images and chat co-pilot features).
*   Add **Google Client ID / Client Secret** (if testing Google login integration locally).

### 3. Running the Backend
Navigate to the `/backend` folder:
```bash
# Build the application
./mvnw clean package -DskipTests

# Start the Spring Boot Application
java -jar target/dwellix-backend-0.1.0.jar
```

### 4. Running the Frontend
Navigate to the `/frontend` folder:
```bash
# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔒 Security & Best Practices
*   **JWT Security**: Separate Access & Refresh tokens inside HttpOnly, SameSite cookies to protect credentials from XSS/CSRF vectors.
*   **Rate Limiting**: Custom route interceptor constraints preventing endpoint request abuse.
*   **Purity & Compile Checks**: Strict Next.js Turbopack compiler, type compliance, and ESLint purity requirements enforced at build time.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
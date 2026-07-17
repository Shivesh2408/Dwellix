# Interview Preparation & Project Guide: Dwellix

This guide is structured to help you explain Dwellix professionally during software engineering interviews, portfolio presentations, and code reviews.

---

## ⏱️ The 2-Minute Elevator Pitch

> *"Dwellix is an AI-powered home management platform designed to act as an operating system for residential home ownership. As a homeowner, keeping track of appliances, maintaining receipts, mapping warranty dates, and diagnosing appliance issues can be highly disjointed. Dwellix solves this by centralizing three core pillars:
> 
> 1. **Structured Appliance Registry**: A digital catalog tracking model numbers, rooms, and dynamic health scores.
> 2. **Digital Document Vault**: Integrates directly with Cloudinary to digitize invoices, warranties, and models.
> 3. **AI Workspace**: Leveraging OpenRouter API to build a Claude/ChatGPT-style workspace that understands a user's home context and guides them through step-by-step diagnostic procedures for failing home appliances.
> 
> Technically, it is built with **Next.js 16** on the frontend for a fast React SPA experience, backed by a **Spring Boot 3.5** API, and backed by a **PostgreSQL** database. Security is managed via Spring Security using HttpOnly cookie-based JWTs and Google OAuth2 login."*

---

## 🗺️ Architectural Deep Dive

Dwellix utilizes a standard Client-Server Architecture separated into an SPA client and a stateless REST backend.

1.  **Frontend SPA (Next.js 16 / React 19)**:
    *   Uses React Context and custom reducers for UI/State management.
    *   Integrates **Framer Motion** for micro-interactions (e.g. custom cursor, page loaders, onboarding wizard animations).
2.  **Stateless REST API (Spring Boot 3.5 / Java 21)**:
    *   Decoupled architecture using **Controllers -> Services -> JPA Repositories**.
    *   Utilizes **Spring WebFlux WebClient** to perform asynchronous non-blocking calls to OpenRouter for AI tasks, ensuring thread safety and performance.
    *   Database changes are versioned and managed sequentially using **Flyway migrations**.
    *   Integrates the **Cloudinary SDK** to handle image/invoice file uploads securely at the backend layer.
3.  **Database Layer (PostgreSQL)**:
    *   Normalized schema modeling User Entities, Appliance catalogs, Homes, Rooms, AI Conversations, and Booking dispatch histories.

---

## 💾 Database Schema & Design

The database contains 6 structured migrations:
*   `V1__auth_schema.sql`: Models `users`, `refresh_tokens`, `verification_tokens`, and `password_reset_tokens`.
*   `V2__onboarding_schema.sql`: Models home setup (`homes`, `rooms`, `appliances`).
*   `V3__ai_conversation_history.sql`: Tracks AI workspace conversations (`ai_conversations`, `ai_messages`).
*   `V4__ai_diagnosis_history.sql`: Records automated appliance image diagnosis results.
*   `V5__technician_bookings.sql`: Controls dispatcher scheduling tables.
*   `V6__technicians.sql`: Seeds `technicians` table with specialty technician data.

---

## 🔒 Security & Authentication

Dwellix implements strict enterprise security measures:
*   **HttpOnly Cookies**: Refresh tokens are stored in HttpOnly cookies with `Secure` and `SameSite` configurations based on environment properties. This blocks client-side JavaScript access, neutralizing **XSS (Cross-Site Scripting)** attacks.
*   **Access Token in Memory**: Access tokens are kept in memory by React and automatically rotated in the background using the HttpOnly cookie before expiration.
*   **Rate Limiting**: An interceptor checks IP/Username requests (`InMemoryRateLimitService`) to stop brute-force password guessing and API request abuse.

---

## 💬 Top Interviewer Questions & Answers

### Q1: Why did you use Spring Security + Cookie JWTs instead of local storage?
> **Answer**: *"Storing JWTs in LocalStorage makes them vulnerable to XSS attacks—if a third-party script gets injected, it can read the token. By moving the Refresh token to an HttpOnly cookie and keeping the Access token in React memory, JavaScript cannot access the credentials, making the authentication pipeline highly secure."*

### Q2: Why did you integrate OpenRouter API with WebClient instead of RestTemplate?
> **Answer**: *"RestTemplate is blocking and synchronous; each request holds a server thread. OpenRouter calls can take several seconds to stream. By using WebFlux WebClient, we leverage reactive, non-blocking HTTP requests. This lets the backend handle other REST calls efficiently without blocking worker threads."*

### Q3: How do you handle file uploads for warranties/invoices?
> **Answer**: *"The frontend client uploads files directly to the Spring Boot REST API backend via multipart requests. The backend validates file parameters (such as a 10MB size limit and allowed MIME types including JPG, PNG, and WEBP) before uploading the files to Cloudinary using the official Java SDK. This centralizes validation controls before cloud storage."*

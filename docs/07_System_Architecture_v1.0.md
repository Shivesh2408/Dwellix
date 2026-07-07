
# Dwellix

# 07_System_Architecture_v1.0

**Version:** 1.0

## High Level Architecture

User
↓
Next.js Frontend
↓
Spring Boot Backend
↓
PostgreSQL / Redis / Cloudinary / Gemini API / Razorpay

---

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Structure

frontend/
├── app
├── components
├── features
├── hooks
├── lib
├── services
├── types
├── utils

---

## Backend

backend/
├── controller
├── service
├── repository
├── entity
├── dto
├── config
├── security
├── exception

---

## Request Lifecycle

Browser
→ API
→ JWT Validation
→ Controller
→ Service
→ Repository
→ Database
→ Response

---

## AI Flow

User
→ Gemini API
→ Structured Diagnosis
→ Recommendation
→ Booking Suggestion

---

## Payment Flow

Booking
→ Razorpay Order
→ Payment
→ Verification
→ Invoice
→ Database Update

---

## Deployment

Frontend → Vercel

Backend → Render

Database → PostgreSQL

Images → Cloudinary

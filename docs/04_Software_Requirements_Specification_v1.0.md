
# Dwellix

# 04_Software_Requirements_Specification_v1.0

**Version:** 1.0
**Status:** Draft
**Project:** Dwellix
**Tagline:** Your Home. Smarter Every Day.

---

# 1. Purpose

This document defines the functional and technical requirements required to build Dwellix v1.0.

---

# 2. User Roles

## Guest
- Browse website
- View features
- Register/Login

## Customer
- Manage home
- Chat with AI
- Book services
- Track technician
- Make payments
- Manage warranties and invoices

## Technician
- Accept jobs
- Update status
- View earnings

## Admin
- Manage platform
- View analytics
- Resolve complaints

---

# 3. Functional Modules

## Authentication
Features:
- Login
- Signup
- Email Verification
- Forgot Password
- Reset Password

Requirements:
- JWT Authentication
- Password Hashing
- Protected Routes
- Remember Me
- Session Expiry

---

## Dashboard

Components:
- Welcome Card
- Home Health Overview
- Upcoming Bookings
- AI Recommendations
- Notifications
- Quick Actions

---

## AI Assistant

Functions:
- Diagnose appliance issues
- Ask follow-up questions
- Estimate repair cost
- Recommend technician
- Save conversation history

---

## Home Management

Features:
- Add Home
- Add Rooms
- Add Appliances
- Warranty Vault
- Invoice Vault
- Maintenance Timeline

---

## Marketplace

Features:
- Browse Services
- Search
- Technician Profiles
- Ratings
- Book Service

---

## Booking System

- Create Booking
- Cancel Booking
- Reschedule Booking
- Booking Status Timeline

---

## Live Tracking

- Technician Location
- ETA
- Live Status Updates

---

## Payments

- Razorpay Integration
- Payment History
- Invoice Download

---

## Notifications

- Booking Updates
- Warranty Alerts
- Payment Alerts
- Maintenance Reminders

---

## Technician Portal

- Dashboard
- Jobs
- Availability
- Earnings
- Reviews

---

## Admin Portal

- Users
- Technicians
- Services
- Bookings
- Payments
- Reports
- Analytics

---

# 4. Non Functional Requirements

- Responsive Design
- Secure Authentication
- Fast Performance
- Accessibility
- Scalable Architecture
- Production Ready

---

# 5. Tech Stack

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- Java
- Spring Boot

Database:
- PostgreSQL

Authentication:
- JWT

Realtime:
- WebSockets

Payments:
- Razorpay

Storage:
- Cloudinary

AI:
- Gemini API

Deployment:
- Docker
- Vercel
- Render

---

# 6. Development Rule

Every module must be completed in this order:

1. UI
2. Database
3. API
4. Backend
5. Frontend
6. Testing
7. Documentation
8. Interview Notes

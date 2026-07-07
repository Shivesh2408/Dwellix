
# Dwellix

# 06_API_Documentation_v1.0

**Version:** 1.0
**Status:** Draft
**Project:** Dwellix

---

# API Standards

- Base URL: /api/v1
- Authentication: JWT Bearer Token
- Response Format: JSON
- Versioning: v1

---

# Authentication APIs

## POST /auth/signup
Create a new account.

## POST /auth/login
Authenticate user.

## POST /auth/logout
Logout current user.

## POST /auth/forgot-password
Send password reset link.

## POST /auth/reset-password
Reset password.

## GET /auth/me
Return current logged-in user.

---

# Dashboard APIs

## GET /dashboard
Fetch dashboard overview.

## GET /dashboard/home-health
Return Home Health Score.

## GET /dashboard/recommendations
Return AI recommendations.

---

# Home APIs

## GET /homes
List homes.

## POST /homes
Create home.

## PUT /homes/{id}
Update home.

## DELETE /homes/{id}
Delete home.

---

# Room APIs

GET /rooms

POST /rooms

PUT /rooms/{id}

DELETE /rooms/{id}

---

# Appliance APIs

GET /appliances

POST /appliances

PUT /appliances/{id}

DELETE /appliances/{id}

GET /appliances/{id}/timeline

GET /appliances/{id}/warranty

---

# AI APIs

POST /ai/diagnose

POST /ai/chat

GET /ai/history

GET /ai/report/{id}

---

# Marketplace APIs

GET /services

GET /services/{id}

GET /technicians

GET /technicians/{id}

GET /categories

---

# Booking APIs

POST /bookings

GET /bookings

GET /bookings/{id}

PUT /bookings/{id}

DELETE /bookings/{id}

---

# Tracking APIs

GET /tracking/{bookingId}

PUT /tracking/location

---

# Payment APIs

POST /payments/create-order

POST /payments/verify

GET /payments/history

GET /payments/invoice/{bookingId}

---

# Notification APIs

GET /notifications

PUT /notifications/{id}/read

DELETE /notifications/{id}

---

# Technician APIs

GET /technician/dashboard

GET /technician/jobs

PUT /technician/jobs/{id}

GET /technician/earnings

---

# Admin APIs

GET /admin/users

GET /admin/bookings

GET /admin/services

GET /admin/payments

GET /admin/analytics

PUT /admin/users/{id}

DELETE /admin/users/{id}

---

# Standard Success Response

{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}

---

# Standard Error Response

{
  "success": false,
  "message": "Validation failed",
  "errors": []
}

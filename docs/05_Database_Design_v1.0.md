
# Dwellix

# 05_Database_Design_v1.0

**Version:** 1.0
**Status:** Draft
**Project:** Dwellix

---

# Database

PostgreSQL

---

# Entity Relationship Overview

Users
│
├── Homes
│   ├── Rooms
│   │   └── Appliances
│   │       ├── Warranties
│   │       ├── Invoices
│   │       └── Maintenance History
│
├── Bookings
│   ├── Payments
│   └── Reviews
│
├── Notifications
│
└── AI Conversations

Technicians
├── Services
├── Bookings
└── Reviews

---

# Tables

## users

- id (PK)
- full_name
- email
- password_hash
- phone
- role
- profile_image
- created_at
- updated_at

---

## homes

- id (PK)
- user_id (FK)
- home_name
- house_type
- address
- city
- state
- pincode
- created_at

---

## rooms

- id (PK)
- home_id (FK)
- room_name
- floor_number

---

## appliances

- id (PK)
- room_id (FK)
- appliance_name
- brand
- model
- serial_number
- purchase_date
- warranty_expiry
- status

---

## warranties

- id (PK)
- appliance_id (FK)
- document_url
- expiry_date

---

## invoices

- id (PK)
- appliance_id (FK)
- booking_id (FK)
- invoice_url
- invoice_number
- amount

---

## technicians

- id (PK)
- full_name
- email
- phone
- experience
- rating
- is_available

---

## services

- id (PK)
- service_name
- category
- description
- base_price

---

## bookings

- id (PK)
- user_id (FK)
- technician_id (FK)
- service_id (FK)
- appliance_id (FK)
- booking_status
- booking_date
- scheduled_time
- completed_at

---

## payments

- id (PK)
- booking_id (FK)
- razorpay_payment_id
- amount
- payment_status
- payment_date

---

## reviews

- id (PK)
- booking_id (FK)
- user_id (FK)
- technician_id (FK)
- rating
- review

---

## notifications

- id (PK)
- user_id (FK)
- title
- message
- type
- is_read
- created_at

---

## ai_conversations

- id (PK)
- user_id (FK)
- title
- prompt
- response
- created_at

---

## maintenance_history

- id (PK)
- appliance_id (FK)
- booking_id (FK)
- maintenance_type
- notes
- performed_on

---

# Indexes

- users.email
- technicians.rating
- bookings.user_id
- bookings.technician_id
- appliances.room_id
- notifications.user_id

---

# Future Tables (v2)

- career_profiles
- resumes
- job_applications
- expenses
- health_records
- documents

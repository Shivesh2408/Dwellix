# REST API Documentation - Dwellix

All backend endpoints are prefixed with `/api/v1/`.

---

## 🔑 Authentication Endpoints (`/api/v1/auth`)

### 1. User Signup
*   **Method**: `POST`
*   **URL**: `/api/v1/auth/signup`
*   **Request Payload**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response**: `201 Created` with session credentials.

### 2. User Login
*   **Method**: `POST`
*   **URL**: `/api/v1/auth/login`
*   **Request Payload**:
    ```json
    {
      "email": "jane@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response**: `200 OK` (transmits Refresh Token in HttpOnly cookie, and Access Token in JSON response).

### 3. Google OAuth2 Login
*   **URL**: `/oauth2/authorization/google`
*   **Description**: Redirects browser to Google authentication workspace.

---

## 🏠 Onboarding & Appliances (`/api/v1/onboarding`, `/api/v1/appliances`)

### 1. Save Home Parameters
*   **Method**: `POST`
*   **URL**: `/api/v1/onboarding/home`
*   **Payload**:
    ```json
    {
      "name": "My Main Home",
      "homeType": "APARTMENT"
    }
    ```

### 2. List Appliances
*   **Method**: `GET`
*   **URL**: `/api/v1/appliances`
*   **Response**: List of registered appliances including model numbers, health statuses, and invoice links.

---

## 💬 AI Workspace Conversations (`/api/v1/ai`)

### 1. Chat Workspace Request
*   **Method**: `POST`
*   **URL**: `/api/v1/ai/chat`
*   **Payload**:
    ```json
    {
      "conversationId": "38a7c29e-289c-4f11-9a99-4d695c02919a",
      "message": "My Samsung fridge is showing an error code OF OF."
    }
    ```
*   **Response**: Streams message responses after matching fridge metadata parameters with OpenRouter diagnostics.

---

## 🔧 Technician Booking (`/api/v1/bookings`)

### 1. Book Dispatch Service
*   **Method**: `POST`
*   **URL**: `/api/v1/bookings`
*   **Payload**:
    ```json
    {
      "applianceId": 45,
      "bookingDate": "2026-08-10T10:00:00Z",
      "description": "Ice maker leaking water."
    }
    ```

# Authentication API Examples

## POST /api/v1/auth/signup

Request
```json
{
  "fullName": "Alex Morgan",
  "email": "alex@dwellix.com",
  "phoneNumber": "+15551234567",
  "password": "StrongPass!123"
}
```

Response
```json
{
  "message": "Account created for alex@dwellix.com. Verify your email to continue."
}
```

## POST /api/v1/auth/login

Request
```json
{
  "email": "alex@dwellix.com",
  "password": "StrongPass!123",
  "rememberMe": true
}
```

Response
```json
{
  "user": {
    "id": "b7e2d9ce-fdc4-4e2c-8d81-7f7b91e1d211",
    "fullName": "Alex Morgan",
    "email": "alex@dwellix.com",
    "phoneNumber": "+15551234567",
    "role": "ROLE_USER",
    "emailVerified": true,
    "lastLoginAt": "2026-07-07T12:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "expiresInSeconds": 900
  },
  "message": "Login successful."
}
```

## POST /api/v1/auth/logout

Response
```json
{
  "message": "Logged out successfully."
}
```

## POST /api/v1/auth/refresh

Response
```json
{
  "user": {
    "id": "b7e2d9ce-fdc4-4e2c-8d81-7f7b91e1d211",
    "fullName": "Alex Morgan",
    "email": "alex@dwellix.com",
    "phoneNumber": "+15551234567",
    "role": "ROLE_USER",
    "emailVerified": true,
    "lastLoginAt": "2026-07-07T12:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "expiresInSeconds": 900
  },
  "message": "Token refreshed."
}
```

## POST /api/v1/auth/forgot-password

Request
```json
{
  "email": "alex@dwellix.com"
}
```

Response
```json
{
  "message": "If the account exists, a reset link will be sent shortly."
}
```

## POST /api/v1/auth/reset-password

Request
```json
{
  "token": "reset-token-value",
  "password": "NewStrongPass!123",
  "confirmPassword": "NewStrongPass!123"
}
```

Response
```json
{
  "message": "Password updated successfully."
}
```

## POST /api/v1/auth/verify-email

Request
```json
{
  "token": "verification-token-value"
}
```

Response
```json
{
  "message": "Email verified successfully."
}
```

## GET /api/v1/auth/me

Headers
```http
Authorization: Bearer eyJhbGciOi...
```

Response
```json
{
  "id": "b7e2d9ce-fdc4-4e2c-8d81-7f7b91e1d211",
  "fullName": "Alex Morgan",
  "email": "alex@dwellix.com",
  "phoneNumber": "+15551234567",
  "role": "ROLE_USER",
  "emailVerified": true,
  "lastLoginAt": "2026-07-07T12:00:00Z"
}
```

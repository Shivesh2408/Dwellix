# Production Deployment Guidelines

Dwellix is built with stateless design patterns, making it highly compatible with modern PaaS platforms (e.g. Render.com, Heroku, Vercel) and Docker container hosting.

---

## 🐳 1. Docker Containerization

The backend is packaged using a multi-stage Docker build config located at `/backend/Dockerfile`.

### Backend Dockerfile (`backend/Dockerfile`)
The backend is packaged using the following multi-stage config:
```dockerfile
# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy the maven wrapper and pom file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Mark the wrapper script as executable
RUN chmod +x mvnw

# Download dependencies offline to optimize cache layering
RUN ./mvnw dependency:go-offline -B

# Copy the source code and compile the application jar
COPY src/ src
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the minimal execution environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the packaged JAR file from the builder stage
COPY --from=builder /app/target/dwellix-backend-0.1.0.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## ☁️ 2. Cloud Deployments (Render.com + Vercel)

Dwellix contains a `render.yaml` configuration template blueprint to deploy the Spring Boot backend service:

1.  **Spring Boot API Service**: Deployed on Render using the Docker path.
2.  **Next.js Frontend Client**: Deployed on **Vercel** or **Render Static Sites**.

### Required Environment Variable Mappings

#### Backend Environment Settings (Spring Boot)
*   `DATABASE_URL`: JDBC database path.
*   `DATABASE_USERNAME`: Database username credential.
*   `DATABASE_PASSWORD`: Database password credential.
*   `JWT_SECRET`: Base64 encoded private secret key.
*   `OPENROUTER_API_KEY`: API token from OpenRouter console.
*   `CLOUDINARY_URL`: Managed endpoint signature for uploads.

#### Frontend Environment Settings (Next.js)
*   `NEXT_PUBLIC_API_URL`: Pointing to your deployed Spring Boot domain (e.g., `https://your-api.onrender.com/api/v1`).
*   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary service identifier.

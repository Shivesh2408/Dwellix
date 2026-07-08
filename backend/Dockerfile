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

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend application
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/src ./backend/src

# Copy built frontend from Stage 1 into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist ./backend/src/main/resources/static/

WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 3: Run the full-stack application
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

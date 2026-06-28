# Inventor - Inventory Management System

Inventor is a full-stack Inventory Management System built with a Spring Boot backend and a React (Vite) frontend. It allows users to manage their inventory efficiently, complete with features like authentication, PDF bill generation, and a modern, responsive UI.

**🌍 Live Demo:** [https://smart-inventory-app-bice.vercel.app/](https://smart-inventory-app-bice.vercel.app/)

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.4**
- **MongoDB** (Database)
- **Spring Security & JWT** (Authentication)
- **iText PDF** (Bill Generation)
- **Maven**

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **React Router**
- **Axios** (API requests)
- **jsPDF & jsPDF-AutoTable** (Client-side PDF handling)
- **Lucide React** (Icons)

## 📂 Project Structure

- `/backend`: Contains the Spring Boot application, REST APIs, and database configurations.
- `/frontend`: Contains the React SPA (Single Page Application) with modern UI and Tailwind styling.

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Java Development Kit (JDK) 17** installed.
- **Node.js (v18+)** and **npm** installed.
- **Maven** installed (optional, you can use the wrapper if included).
- A **MongoDB** instance (The project is pre-configured to use a MongoDB Atlas cluster, but you can change this in `application.properties`).

## 🚦 Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build the project and install dependencies:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080`.*

> **Note**: The backend stores generated bills in a local `./bills/` directory as specified in the `application.properties`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on the port provided by Vite (usually `http://localhost:5173`).*

## 🐳 Docker Deployment

The project includes a `Dockerfile` to containerize the **backend**.

To build and run the backend using Docker:

1. Build the Docker image from the root directory:
   ```bash
   docker build -t inventor-backend .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:8080 inventor-backend
   ```

## 🌐 Environment Variables & Configuration

### Backend (`backend/src/main/resources/application.properties`)
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string.
- `PORT`: Server port (default: `8080`).
- `JWT_SECRET`: Secret key for JWT signing.
- `JWT_EXPIRATION`: Expiration time for JWT in milliseconds.
- `BILL_PATH`: Local directory path to store generated PDFs.

### Frontend
- The frontend is configured for deployment using Vite and includes a `vercel.json` file for easy deployment to Vercel.

## 📝 License

This project is licensed under the MIT License.

# CivicVoice

CivicVoice is a community engagement platform featuring a mobile-friendly frontend and a robust Java Spring Boot backend.

**🚀 Live Application:** [https://civicvoice-ten.vercel.app](https://civicvoice-ten.vercel.app)

## Architecture

This repository uses a monorepo structure:
* **`frontend/`**: Contains the client-side code (HTML, CSS, JS) and Capacitor setup for mobile deployment.
* **`backend/`**: Contains the Java Spring Boot REST API and database migration configurations.

## Running Locally

To run the application locally, you will need to start both the frontend and backend servers.

### 1. Start the Backend
The backend runs on Java 21 and uses Maven.
```bash
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
The backend API will be available at `http://localhost:8080`.

### 2. Start the Frontend
The frontend consists of static files that can be served using any local HTTP server.
```bash
cd frontend/www
python -m http.server 3333
```
The frontend will be available in your browser at `http://localhost:3333`.

## Deployment
* **Frontend**: Deployed via Vercel (Root Directory: `frontend/www`)
* **Backend**: Deployed via Render (Root Directory: `backend`)

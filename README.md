# Prompt Project

This repository contains the frontend (Angular) and backend (NestJS) applications for the Prompt project.

## Containerization and CI/CD Implementation

This project has been containerized using Docker and includes a CI/CD pipeline using GitHub Actions.

### Docker Setup

#### Prerequisites

- Docker
- Docker Compose

#### Running the Application Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd prompt
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

4. Stop the application:
   ```bash
   docker-compose down
   ```

### Docker Images

- **Backend**: NestJS application with MongoDB
  - Built using a multi-stage Dockerfile
  - Production image uses Node.js Alpine
  
- **Frontend**: Angular application
  - Built using a multi-stage Dockerfile
  - Production image uses Nginx to serve static files

### CI/CD Pipeline

The CI/CD pipeline is implemented using GitHub Actions and consists of the following stages:

#### Backend CI/CD

1. **Build and Test**:
   - Sets up Node.js and MongoDB
   - Installs dependencies
   - Runs linting
   - Runs unit tests
   - Runs end-to-end tests
   - Builds Docker image

#### Frontend CI/CD

1. **Build and Test**:
   - Sets up Node.js
   - Installs dependencies
   - Runs tests
   - Builds Docker image

#### Deployment

1. **Push to Registry**:
   - Builds and pushes Docker images to Docker Hub
   - Tags images with commit SHA and 'latest'

2. **Deploy**:
   - Placeholder for deployment steps (to be customized based on deployment environment)

### Required Secrets for CI/CD

The following secrets need to be configured in GitHub repository settings:

- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: Your Docker Hub access token

## Development

### Backend (NestJS)

```bash
cd back-end
npm install
npm run start:dev
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

## Testing

### Backend Tests

```bash
cd back-end
npm test          # Unit tests
npm run test:e2e  # End-to-end tests
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Environment Variables

### Backend

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
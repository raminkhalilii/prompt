# Base image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./.env

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build arguments for Vite
ARG VITE_API_URL
ARG VITE_SECRET_KEY

# Pass arguments to environment variables (so Vite can pick them up)
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SECRET_KEY=${VITE_SECRET_KEY}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy fingerprint device SDK folder (includes license files and libraries)
COPY --from=builder /app/sdk /usr/share/nginx/html/sdk

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

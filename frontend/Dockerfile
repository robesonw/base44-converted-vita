# Use official Node.js image as parent image
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:alpine AS runner

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app .

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
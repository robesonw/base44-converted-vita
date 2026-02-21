# syntax=docker/dockerfile:1.0.0-experimental
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]

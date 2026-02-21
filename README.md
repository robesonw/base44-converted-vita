# Project Title

## Quickstart

Run the following command to start the services:

```bash
docker-compose up --build
```

## Manual Setup

1. Install dependencies:
   - `npm install`
2. Run database migrations:
   - `npx prisma migrate dev`
3. Seed the database:
   - `npx prisma db seed`
4. Start the server:
   - `npm run dev`

## Environment Variables

| Variable                     | Description                               |
|------------------------------|-------------------------------------------|
| DATABASE_URL                  | Postgres connection string                |
| JWT_SECRET                   | Secret key for JWT                        |
| JWT_EXPIRES_IN               | Expiration time for JWT                   |
| PORT                         | Port to run the backend on               |
| CORS_ORIGIN                  | Frontend URL                              |
| AI_PROVIDER                   | AI provider to use (openai, anthropic)  |
| AI_MODEL                      | AI model to utilize                       |
| AI_API_KEY                   | API Key for the AI provider               |
| UPLOAD_DIR                   | Directory to store uploaded files         |
| SEED_ADMIN_EMAIL             | Admin email for seeding purposes          |

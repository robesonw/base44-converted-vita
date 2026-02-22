# Quickstart

1. Clone the repository
2. Run `docker-compose up --build` to start the services
3. Access the frontend at `http://localhost` and the API at `http://localhost/api`

# Manual Setup

1. Run `npm install` in the backend and frontend directories.
2. Create a `.env` file from `.env.example` in the backend directory and fill in the database and JWT configurations.
3. Run migrations: `npx prisma migrate dev`
4. Seed the database: `npx ts-node prisma/seed.ts`
5. Start the backend and frontend servers.

# Environment Variables
| Variable                       | Description                                  |
|-------------------------------|----------------------------------------------|
| DATABASE_URL                  | Connection string for PostgreSQL            |
| JWT_SECRET                    | Secret key for JWT signing                   |
| JWT_EXPIRES_IN                | Token expiration duration                    |
| PORT                          | Port for the backend server                  |
| CORS_ORIGIN                   | Allowed origins for CORS                    |
| AI_PROVIDER                   | AI provider (e.g., openai)                  |
| AI_MODEL                      | Model to use for AI requests                 |
| AI_API_KEY                    | API key for the AI service                   |
| AZURE_OPENAI_ENDPOINT         | Endpoint for Azure OpenAI service            |
| OLLAMA_BASE_URL               | Base URL for Ollama AI service               |
| UPLOAD_DIR                    | Directory for file uploads                   |
| AWS_S3_BUCKET                 | AWS S3 bucket name for uploads               |
| AWS_ACCESS_KEY_ID             | AWS access key ID                            |
| AWS_SECRET_ACCESS_KEY         | AWS secret access key                        |

# API Reference
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get a JWT
- `GET /api/auth/me` - Get the currently logged-in user
- `POST /api/auth/logout` - Log out
- `POST /api/auth/refresh` - Refresh the JWT
- `POST /api/ai/invoke` - Invoke an AI model
- `POST /api/upload` - Upload a file
# Quickstart\n\n## Running with Docker\nTo run the application, you can use Docker and docker-compose. Ensure Docker is installed, then execute the following command from the root of the project:

```bash\ndocker-compose up\n```\n
## Manual Setup\n1. Clone the repository and change into the backend directory.
2. Install dependencies:
```bash\nnpm install\n```\n3. Set up a .env file:
```bash\ncp .env.example .env\n```\n4. Run migrations and start the server:
```bash\nnpx prisma migrate dev\nnpm run dev\n```\n
## Environment Variables\nEnsure to set the following in your .env file:\n- `DATABASE_URL`\n- `JWT_SECRET`\n- `PORT`\n- `AI_PROVIDER`\n- `AI_MODEL`\n- `AI_API_KEY`
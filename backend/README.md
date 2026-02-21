# Base44 App Backend

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd your_project_name
   ```

2. **Create a `.env` File**
   Copy the example environment variables file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your PostgreSQL and JWT settings.

3. **Build the Docker Containers**
   Ensure you have Docker installed. Then run:
   ```bash
   docker-compose up --build
   ```

4. **Run Migrations**
   After the containers are running, you may need to run migrations:
   ```bash
   docker exec -it <your_backend_container_name> npx prisma migrate deploy
   ```

5. **Access the API**
   The backend will be available at `http://localhost:3000`.

## Endpoints
- **User CRUD**: `/users`
- **Authentication**: `/login`, `/logout`, `/me`
- **File Upload**: `/upload`
# Backend PostgreSQL Setup

This project expects a Postgres database for development. You can either run Postgres locally or use the included Docker Compose file.

## Recommended (Docker)

1. Make sure Docker is installed and running.
2. From the `backend` folder run:

```bash
npm run db:docker
```

This will start a Postgres container with these defaults:
- user: `postgres`
- password: `password`
- database: `sweet_shop_db`
- port: `5432`

3. Run the database setup/seed script:

```bash
npm run db:setup
```

## Manual / Local Postgres

1. Create a database user and database or set these env vars in a `.env` file (see `.env.example`):

```
DB_NAME=sweet_shop_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
```

2. Start Postgres and ensure it accepts connections.
3. Run database setup:

```bash
npm run db:setup
```

## Windows PowerShell env example (temporary)

```powershell
$env:DB_NAME='sweet_shop_db'
$env:DB_USER='postgres'
$env:DB_PASSWORD='password'
$env:DB_HOST='localhost'
$env:DB_PORT='5432'
npm run db:setup
```

If `npm run db:setup` fails with an authentication error, check your Postgres user password or run `npm run db:docker` to launch a container with the defaults.

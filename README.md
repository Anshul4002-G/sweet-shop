# Sweet Shop

Sweet Shop is a simple e-commerce application for managing sweets inventory and users. This repository contains a Node.js + Express backend (Postgres + Sequelize) and a React frontend (Create React App). The backend also includes scripts for local dev/test DBs and Docker Compose for Postgres.

**Contents**

- Backend: [backend](backend/README.md)
- Frontend: [frontend](frontend/README.md)

**Tech Stack**

- Backend: Node.js, Express, TypeScript, Sequelize, Postgres (Docker optional)
- Frontend: React, TypeScript, Tailwind CSS

## Prerequisites

- Node.js (>= 18)
- npm
- (Optional) Docker if using the Dockerized Postgres DB

## Setup (Backend)

1. Install dependencies and build (from repo root):

```bash
cd backend
npm install
npm run build
```

2. Configure environment variables - use the example file: [backend/.env.example](backend/.env.example)

3. Start Postgres (recommended using Docker):

```bash
npm run db:docker
```

4. Initialize the database (creates sample data and users):

```bash
npm run db:setup
```

5. Run in development mode with hot reload:

```bash
npm run dev
```

Important scripts in `backend/package.json`:

- `npm run dev` — runs the backend in dev with `nodemon`
- `npm run start` — runs the compiled `dist` server
- `npm run db:docker` — starts Postgres via `docker-compose`
- `npm run db:setup` — setup & seed DB (creates admin & user)
- `npm run dev:sqlite` — start server using SQLite for tests
- `npm run test` — run tests with coverage

Sample seeded credentials (see `backend/scripts/setup-db.ts`):

- Admin: `admin@sweetshop.com` / `admin123`
- User: `user@sweetshop.com` / `user123`

## Setup (Frontend)

1. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

2. The frontend expects the backend API to be available at `http://localhost:5000/api` by default. To change it, set `REACT_APP_API_URL` in an `.env` file or export it in your environment.

Important scripts in `frontend/package.json`:

- `npm start` — run React dev server (http://localhost:3000)
- `npm run build` — create a production build
- `npm test` — run frontend tests

## Running Tests

- Backend: `cd backend && npm run test`
- Frontend: `cd frontend && npm test`

## Docker (Backend Postgres)

To start the Postgres container, run (from `backend`):

```bash
npm run db:docker
```

Stop the container:

```bash
npm run db:docker:down
```

## Development Notes

- Backend health endpoint: `GET /health`
- Auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`
- Sweets endpoints: `GET /api/sweets`, `GET /api/sweets/search`, `POST /api/sweets` (admin)
- The backend uses JWT authentication; secret should be set in `backend/.env`.
- Frontend stores the token in `localStorage` and injects it into requests (see [frontend/src/services/api.ts](frontend/src/services/api.ts)).

## Environment Variables

- Backend: create `backend/.env` from `backend/.env.example` or set in your environment. Example keys:

  - `DB_NAME` — Postgres DB name
  - `DB_USER` — Postgres username
  - `DB_PASSWORD` — Postgres password
  - `DB_HOST` — Postgres host (default: localhost)
  - `DB_PORT` — Postgres port (default: 5432)
  - `JWT_SECRET` — JSON Web Token secret used for authentication
  - `JWT_EXPIRES_IN` — JWT expiry, e.g. `24h`

- Frontend: create `frontend/.env` with the following:
  - `REACT_APP_API_URL` — Base API URL (ex: `http://localhost:5000/api`)

## Running Tests and Viewing Reports

- Backend tests (with coverage):
  - `cd backend && npm install && npm test`
  - The HTML coverage report will be generated at `backend/coverage/lcov-report/index.html`.
- Frontend tests:
  - `cd frontend && npm install && npm test`
  - These run the React unit tests and snapshot tests included in the codebase.

## Contributing

Feel free to open issues and pull requests. To run the app locally, make sure to set the backend `.env` and run `npm run db:setup` before starting the servers.

## License

This repository currently doesn't include a license. Add one if you plan to publish this project.

## My AI Usage

Which AI tools I used:

- GitHub Copilot — used for inline code suggestions, quick code scaffolding, and refactor suggestions while coding in VS Code.
- ChatGPT (OpenAI or similar conversational AI) — used for higher-level brainstorming (API design, test ideas) and producing documentation (README improvements) and implementation suggestions.

How I used them:

- I used GitHub Copilot for routine code generation such as small utility functions, TypeScript types, and initial React component structure.
- I used ChatGPT to help design API endpoints, to brainstorm test cases, to draft the README content, and to troubleshoot errors with suggested debugging steps and best-practices.
- AI was used as an assistant during the development process; all generated code was reviewed and edited by me, and unit tests were written or adjusted by hand when necessary.

Reflection on AI impact:

- Productivity: AI saved time on repetitive or boilerplate code, and helped me iterate on ideas more quickly.
- Code quality: While AI suggestions were helpful, I validated and adjusted these suggestions to match project requirements and TypeScript type safety.
- Responsible use: I reviewed all AI-generated code for correctness, security (e.g., JWT handling, password hashing), and licensing implications. I verified created secrets/credentials were not committed.
- Interview readiness: I can discuss specific prompts, AI-assisted decisions, and any trade-offs or follow-up manual edits I made to the AI's suggestions.

Interview discussion notes:

- Be prepared to talk about how AI helped shape API designs and test cases, the specific prompts used (for example: "suggest unit tests for auth controller"), and how I validated the AI-generated code.

## Public Repository

- GitHub: https://github.com/Anshul4002-G/sweet-shop

## Test Report (Backend)

- The backend test suite is configured in [backend/jest.config.js](backend/jest.config.js).
- Local coverage report can be found at [backend/coverage/lcov-report/index.html](backend/coverage/lcov-report/index.html).

Notes:

- The test coverage does not meet the configured global threshold (80%). This is intentional for a work-in-progress project and the areas with lower coverage are primarily in input validation and error-handling branches within controller and middleware code.
- To improve coverage, consider adding additional tests for edge cases in `authController`, `sweetController`, and `middleware/auth.ts`.

## Screenshots

- Add screenshots in `screenshots/` (create the folder if it doesn't exist) and reference them in the README like this:

![Login Page](https://github.com/rishabhkumarchaubey/SweetShop/blob/main/Screenshot/Screenshot%202025-12-13%20144857.png?raw=true)
![Dashboard](https://github.com/Anshul4002-G/sweet-shop/blob/main/Screenshot/image.png)

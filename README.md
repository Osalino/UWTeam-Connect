# UWTeam Connect

A worship team management system for handling announcements, events, and team members.

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) — install with `npm install -g pnpm`
- A PostgreSQL database (e.g. [Neon](https://neon.tech) for a free hosted option)

## Setup

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd UWteamV2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open `http://localhost:8080` in your browser.

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Port for the Express server (default: 3000) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run frontend + backend in development |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Type-check TypeScript |

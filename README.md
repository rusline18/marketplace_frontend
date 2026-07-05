# Marketplace Frontend

Public-facing Nuxt application for the Marketplace project: catalog
browsing and the check-in/marks flow. Consumes the backend's public API
(`/api/v1`).

## Stack

- Nuxt 4, Nuxt UI, Tailwind CSS v4
- Tiptap (rich text editing)
- TypeScript
- Vitest + Vue Test Utils + happy-dom for tests

## Structure

```
app/
├── pages/         index, listings/[id], login, register
├── composables/   useApiClient, useAuth, useListings
├── plugins/       auth.ts
└── layouts/       default.vue
```

## Setup

```bash
npm install
```

Copy `.env` and point it at the backend's public API:

```
NUXT_PUBLIC_API_BASE=http://localhost:8092
```

Adjust the port to match wherever the backend's nginx container is exposed
locally.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

Or run it in Docker (`FRONTEND_PORT` defaults to 3000):

```bash
docker compose up
```

## Testing and Linting

```bash
npm run test           # vitest
npm run test:coverage
npm run lint
```

## Production

```bash
npm run build
npm run preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

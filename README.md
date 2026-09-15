# PlayVerse

## Development and production

The frontend uses separate Vite modes for local development and production:

- `npm run dev` uses `VITE_DEV_BACKEND_URL`, defaulting to the local backend at `http://localhost:3000` through the Vite `/api` proxy.
- `npm run build` uses `VITE_PROD_BACKEND_URL` for the deployed backend.

Copy `.env.example` to `.env` and set the production URL before building a deployment. Environment files containing real values are ignored by Git.

The backend should use its own `Backend/.env` file. Set `NODE_ENV=development` locally and `NODE_ENV=production` in deployment; this also controls production cookie settings.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

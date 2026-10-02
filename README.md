# shoppingplace-frontend

A responsive ShoppingPlace storefront foundation built with static mock data. This repository contains the frontend only; it does not include a backend, business API routes, authentication, or persistence.

## Tech Stack

- Next.js 15.5.27 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9
- npm

## Requirements

- Node.js 18.18 or later (Node.js 20+ is recommended)
- npm 9 or later

## Installation

```bash
npm install
```

Copy `.env.example` to `.env.local` if you need to change the local API URL. `.env.local` is ignored by Git.

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | API base URL reserved for future frontend integration | `http://localhost:5000/api` |

The current UI uses static mock data and does not make API requests.

## Commands

```bash
npm run dev       # Start the development server at http://localhost:3000
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Serve the production build
```

## Project Structure

```text
public/                  Static public assets
src/
  app/                   App Router pages, layout, and global styles
  components/
    common/              Shared component space
    layout/              Site header and footer
    ui/                  Reusable interface components
  hooks/                 Custom React hooks
  lib/                   Shared libraries and configuration
  services/              External service integrations
  types/                 Shared TypeScript types
  utils/                 Utility functions
.env.example             Environment variable template

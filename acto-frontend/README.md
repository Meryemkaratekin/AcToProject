# ACTO Frontend

A responsive React single-page application for **ACTO**, a social experiences and events platform. The UI is built with Vite and React Router, uses CSS Modules for styling, and ships with a warm, editorial visual language (amber palette, Playfair Display + Plus Jakarta Sans).

## Features

- **Marketing & discovery:** Home, event listings, search/filter UI, and “How it works” walkthrough
- **Auth (client-side demo):** Register and login with credentials stored in `localStorage` (no backend)
- **Authenticated flows:** Profile, create requests/events, join events, favorites
- **Shared UI:** Navbar (desktop + mobile menu), footer, auth modal, toast notifications
- **Accessibility:** `prefers-reduced-motion` support for animations; semantic HTML where applicable

## Tech Stack

- [React 18](https://react.dev/)
- [React Router 6](https://reactrouter.com/)
- [Vite 5](https://vitejs.dev/)
- CSS Modules + global design tokens in `src/styles/global.css`

## Prerequisites

- **Node.js** 18+ (recommended)

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start dev server with HMR      |
| `npm run build`| Production build to `dist/`    |
| `npm run preview` | Serve the production build locally |

## Project Structure

```
src/
  App.jsx              # Routes, auth state, events, localStorage sync
  main.jsx             # Entry + global styles import
  components/
    layout/            # Navbar, Footer
    ui/                # EventCard, AuthModal, Toast, CityInput, …
  pages/               # Home, Events, How, Profile, Create, Join, NotFound
  data/                # Static seeds (events, blog posts)
  styles/
    global.css         # CSS variables, breakpoints, utilities
public/
  favicon.svg
  og-image.svg         # Default share image (use absolute URLs in production meta if needed)
```

## Routes

| Path                     | Notes                                      |
| ------------------------ | ------------------------------------------ |
| `/`                      | Home                                       |
| `/events`                | Event catalog                              |
| `/events/:eventId/join`  | Join flow (requires login)                 |
| `/how`                   | How the platform works                     |
| `/profile`               | User profile (requires login)              |
| `/create`                | Create request / marketplace (requires login) |
| `*`                      | 404 page                                   |

## Production Notes

- For social previews (Open Graph / Twitter), set **`og:image` and `twitter:image` to absolute URLs** pointing at your deployed domain (relative paths work for the site, but crawlers prefer full URLs).
- Static assets in `public/` are copied to the build output root on `npm run build`.

## License

Private project (`"private": true` in `package.json`). Adjust as needed for your organization.

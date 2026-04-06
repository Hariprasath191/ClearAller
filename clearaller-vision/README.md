# ClearAller Vision (AllerGuard) — Frontend

Mobile-first, production-grade React (Vite) frontend for:

- Allergen detection (scan / upload / search)
- AI ingredient analysis result screen
- Smart search with ML-like top-3 ranking
- ChatGPT-style chatbot (AllerGuard AI)
- Multi-profile allergy management (family support)
- Dark mode toggle, toasts, smooth transitions

## Tech stack

- React + Vite
- TailwindCSS
- React Router
- Axios (with auth token interceptor)
- Mock API fallback (Axios adapter) with 1–2s delay
- Lucide icons + Framer Motion animations

## Run locally

From this folder:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in your terminal.

## Backend / Mock mode

By default, the app uses a **mock backend** (so the demo works even without your server).

- **Mock enabled (default)**: no setup needed.
- **Use real backend** at `http://localhost:8000`:
  - Create a `.env` file and set:

```bash
VITE_MOCK_API=false
```

## Demo login (mock mode)

- Email: `demo@clearaller.ai`
- Password: `demo123`

## API endpoints expected (when backend is enabled)

- `POST /auth/register`
- `POST /auth/login`
- `GET /profiles`
- `POST /profiles`
- `POST /profiles/{id}/allergies`
- `POST /scan/barcode`
- `POST /scan/image`
- `GET /product/search?q=`
- `POST /analysis`
- `POST /chat`

# Zauli's Coffee - Local Sales Demo

This workspace contains a small static frontend and a minimal Express API to demo a local sales flow (products, cart, checkout).

Quick start:

1. Open a terminal in the `projeto` folder.

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open the site in your browser:

http://localhost:3000/index.html

Notes:
- The server serves static files and provides API endpoints:
  - `GET /api/products` — returns product list
  - `POST /api/checkout` — accepts `{ cart: [...], customer?: {...} }` and returns `{ success: true, orderId }
- This is a demo; orders are stored in memory only.

# Stockroom — Retail Sales & Inventory Copilot

A small full-stack demo for retail operations: a dashboard that surfaces sales trends and stock health, plus a chat-style copilot that can answer questions about your data in plain language.

Built with a **React (Vite) frontend** and a **Node/Express backend**, running on generated mock data — no database or API keys required to get it running.

## Features

- **Sales overview** — revenue, units sold, and average order value over a rolling window, with a trend chart.
- **Inventory table** — every SKU with on-hand quantity, reorder point, and a status badge (in stock / low stock / out of stock), sorted so the most urgent items surface first.
- **Copilot chat** — ask questions like "what's low on stock?" or "top sellers this month?" and get an answer generated from the live data.
- **Mock data engine** — 20 SKUs across 5 categories with 60 days of generated sales history, so the dashboard is populated immediately.

## Tech stack

| Layer    | Tech                                  |
|----------|----------------------------------------|
| Frontend | React 18, Vite, Recharts               |
| Backend  | Node.js, Express                       |
| Data     | In-memory generated mock data (`backend/src/data/mockData.js`) |

## Project structure

```
retail-copilot/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── src/
│   │   ├── data/mockData.js      # Product catalog + generated sales history
│   │   ├── routes/               # sales, inventory, copilot endpoints
│   │   └── utils/insights.js     # Shared aggregation/analytics helpers
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js                # fetch helpers for the backend API
│   │   └── components/           # Sidebar, KpiStrip, SalesChart, InventoryTable, CopilotPanel
│   └── package.json
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18+ and npm

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run the backend

```bash
cd backend
npm run dev       # starts on http://localhost:4000
```

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** — the frontend proxies `/api/*` requests to the backend automatically (configured in `frontend/vite.config.js`).

## API reference

All endpoints are prefixed with `/api`.

| Method | Endpoint                         | Description                                  |
|--------|-----------------------------------|-----------------------------------------------|
| GET    | `/sales/summary?days=30`         | Total revenue, units, profit, avg order value |
| GET    | `/sales/trend?days=30`           | Daily revenue/units time series               |
| GET    | `/sales/top-products?days=30&limit=5` | Best-selling products by revenue         |
| GET    | `/sales/by-category?days=30`     | Revenue and units grouped by category         |
| GET    | `/inventory`                     | Full product catalog with stock status        |
| GET    | `/inventory/alerts`              | Products at or below their reorder point      |
| GET    | `/inventory/summary`             | Counts of healthy / low / out-of-stock SKUs, total stock value |
| POST   | `/copilot/ask`                   | `{ "question": "..." }` → `{ "answer": "..." }` |

## How the copilot works

Out of the box, `/api/copilot/ask` matches the question against a set of retail intents (low stock, out of stock, top sellers, revenue, category breakdown, inventory value) and answers directly from the mock-data functions in `backend/src/utils/insights.js`. No API key needed — this is what runs by default.

### Wiring up a real LLM

If you set an `ANTHROPIC_API_KEY` environment variable before starting the backend, the copilot instead sends a data snapshot (sales summary, top products, category breakdown, inventory alerts) to the Claude API along with the question, and returns a natural-language answer grounded in that data. This lets the copilot handle open-ended follow-ups and phrasing the rule-based matcher doesn't cover.

```bash
export ANTHROPIC_API_KEY=your-key-here
npm run dev
```

No other code changes are required — the route checks for the environment variable at request time.

## Customizing the mock data

Edit `backend/src/data/mockData.js`:
- `PRODUCT_SEED` — add, remove, or change products, categories, prices, and costs.
- `buildProducts()` — controls how starting stock quantities and reorder points are generated.
- `buildSalesHistory()` — controls how many days of history are generated and the sales-frequency/weekend-boost model.

Everything downstream (routes, insights, copilot, frontend) reads from these two generated arrays, so changes here propagate automatically.

## Roadmap ideas

- Swap the in-memory data module for a real database (Postgres/SQLite).
- Add authentication and per-store data scoping.
- Persist copilot chat history.
- Add a dedicated Inventory and Sales page (currently combined into one dashboard view).
- Replace the keyword-matching intent engine with the LLM path by default once an API key is available.

## License

MIT — use this as a starting point for your own project.

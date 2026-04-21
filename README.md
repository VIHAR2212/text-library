# 📚 Text Library

> A public, no-login platform to store, share, and access text/code snippets instantly.

**Live demo stack:** React + Vite · Node.js + Express · MongoDB · Framer Motion · Glassmorphism UI

---

## ✨ Features

- 🚫 **No authentication** — drop a snippet, grab a link, done
- ⚡ **Real-time search** — by title or content, debounced
- 🎨 **Glassmorphism UI** — frosted glass cards, gradient blobs, dark/light themes
- 🌗 **Theme toggle** — smooth dark ↔ light with `localStorage` persistence
- 💻 **Syntax highlighting** — auto-detected via highlight.js
- 📋 **Copy to clipboard** — one click
- ⬇️ **Instant download** — `.txt` file, no extra steps
- 🔢 **Line numbers** — in the code viewer
- 📜 **Pagination / Load More** — for large libraries
- 🔔 **Toast notifications** — feedback on every action
- 📱 **Mobile responsive** — works on all screen sizes

---

## 🗂️ Project Structure

```
text-library/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server entry
│   │   ├── models/
│   │   │   └── Snippet.js    # Mongoose schema
│   │   └── routes/
│   │       └── snippets.js   # REST API routes
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx           # React entry
    │   ├── App.jsx            # Router + Toaster
    │   ├── styles/
    │   │   └── globals.css    # CSS vars, glass utils, animations
    │   ├── lib/
    │   │   └── api.js         # Fetch wrappers
    │   ├── hooks/
    │   │   ├── useTheme.jsx   # Dark/light context
    │   │   └── useSnippets.js # Data fetching + state
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── SearchBar.jsx
    │   │   └── features/
    │   │       ├── UploadForm.jsx
    │   │       └── SnippetCard.jsx
    │   └── pages/
    │       ├── HomePage.jsx
    │       └── SnippetPage.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally **or** a [MongoDB Atlas](https://cloud.mongodb.com) URI

### 2. Backend

```bash
cd backend
npm install

# Copy and edit env file
cp .env.example .env
# Set MONGODB_URI in .env

npm run dev   # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:3000
```

> The Vite dev server proxies `/api` → `localhost:5000` automatically.

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/snippets` | List all snippets (search, page, limit params) |
| `GET` | `/api/snippets/:shortId` | Get one snippet (increments views) |
| `POST` | `/api/snippets` | Create snippet `{ title, content }` |
| `DELETE` | `/api/snippets/:shortId` | Delete a snippet |
| `GET` | `/health` | Health check |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, import to Vercel
# Set VITE_API_URL env var to your backend URL
```

### Backend → Render
```bash
# Create new Web Service on Render
# Build command: npm install
# Start command: npm start
# Set MONGODB_URI env var
```

---

## 🎨 Design Notes

The UI uses a **frosted glass / glassmorphism** design system:
- CSS custom properties for all colors and gradients (dark + light themes)
- `backdrop-filter: blur()` for glass effect on cards
- Gradient mesh backgrounds with radial blobs
- Syne (display) + DM Sans (body) + JetBrains Mono (code) font trio
- Framer Motion for all transitions and micro-interactions
- Noise texture overlay for depth

---

## 📝 License

MIT — use freely, no attribution required.

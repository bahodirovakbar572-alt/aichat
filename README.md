# 🌙 Luna AI Chat — InfortX

Akbarshoxbek tomonidan yaratilgan AI chat sayt.

---

## 📁 Loyiha tuzilmasi

```
luna-chat/
├── server.js          ← Node.js backend (Express + SSE streaming)
├── package.json       ← Dependencies
├── README.md
└── public/
    └── index.html     ← Frontend (HTML + Tailwind + JS)
```

---

## 🚀 Ishga tushirish

### 1. Kutubxonalarni o'rnatish
```bash
npm install
```

### 2. Serverni ishga tushirish
```bash
node server.js
```
yoki **nodemon** bilan (auto-restart):
```bash
npm run dev
```

### 3. Brauzerda ochish
```
http://localhost:3000
```

---

## ✨ Imkoniyatlar

| Funksiya             | Holat |
|----------------------|-------|
| Streaming javoblar   | ✅    |
| Markdown render      | ✅    |
| Kod highlight        | ✅    |
| Copy button          | ✅    |
| Typing animation     | ✅    |
| Chat history         | ✅    |
| Dark / Light tema    | ✅    |
| Yangi suhbat         | ✅    |
| LocalStorage saqlov  | ✅    |

---

## ⚙️ Sozlamalar (server.js)

```js
const OPENROUTER_API_KEY = "...";   // API kalit
const MODEL = "openai/gpt-oss-120b:free"; // Model
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Streaming**: Server-Sent Events (SSE)
- **Frontend**: HTML5 + Tailwind CSS CDN + Vanilla JS
- **Markdown**: marked.js + highlight.js
- **AI**: OpenRouter API

---

Yaratuvchi: **InfortX · Akbarshoxbek**
# aichat

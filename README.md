# AI Customer Reviews Sentiment Analyzer 📊✨

An enterprise-grade, high-fidelity monorepo application designed to ingest, process, analyze, and visualize customer reviews. 

The application utilizes **local NLP VADER** for real-time sentiment scoring and keyword mapping, combined with the **Google Gemini API** for generating structured executive business intelligence reports. Features an ultra-premium, dark-mode-first dashboard interface styled after industry leaders like Stripe, Linear, Vercel, and Datadog.

---

## 📂 Repository Architecture

This repository is organized as a monorepo containing both the backend services and the frontend client workspace:

```text
Customer-review-analyzer/
├── README.md                   # Root monorepo documentation
├── .gitignore                  # Root Git ignore rules
│
├── backend/                    # Python Flask Backend
│   ├── app.py                  # API Entrypoint, health check, documentation
│   ├── config.py               # Env configuration loader
│   ├── requirements.txt        # Backend python dependencies
│   ├── .env.example            # Environment template configuration
│   ├── verify_backend.py       # Local NLP & DB test suite runner
│   ├── database/
│   │   └── mongodb.py          # MongoDB Atlas connector
│   ├── routes/                 # Blueprint routers (Upload, Dashboard, Reviews, Reports)
│   ├── services/               # Core business services (VADER, Keywords, Gemini, CSV Export)
│   └── static/
│       └── swagger.json        # OpenAPI API Specifications
│
└── AI sentiment Project/       # React TypeScript Frontend
    ├── package.json            # Node project configuration
    ├── index.html              # Frontend page template
    ├── vite.config.ts          # Vite build manager
    ├── src/
    │   ├── App.tsx             # Main dashboard shell & graphs
    │   ├── index.css           # Glassmorphism and dark theme styles
    │   ├── components/         # Interactive dashboard UI components
    │   └── utils/              # Local engine and CSV helpers
```

---

## 🚀 Setup & Launch Guides

### 1. Backend API (Flask + MongoDB Atlas)

#### Prerequisites
* **Python 3.12+**
* Live MongoDB Atlas Database connection URI.
* Google Gemini API Key (optional; API gracefully falls back to structured mock reports if not provided).

#### Installation & Run
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the `.env.example` template to `.env` and fill in your variables:
   ```env
   SECRET_KEY=A0AVbKvDSotyoqGT
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/Review-Sentiment-Analyzer
   GEMINI_API_KEY=your_gemini_key_here
   PORT=5000
   FLASK_DEBUG=True
   ```
5. Test the backend modules locally:
   ```bash
   python verify_backend.py
   ```
6. Start the development server:
   ```bash
   python app.py
   ```
The API will run on `http://localhost:5000`. You can inspect the interactive OpenAPI/Swagger Documentation UI by visiting `http://localhost:5000/docs`.

---

### 2. Frontend client (React + TS + Tailwind)

#### Prerequisites
* **NodeJS v18+**
* **npm** or **yarn** package managers.

#### Installation & Run
1. Navigate to the `AI sentiment Project/` directory:
   ```bash
   cd "AI sentiment Project"
   ```
2. Install the node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
Open the output port (usually `http://localhost:5173`) in your browser to view the client.

---

## 🔌 API Blueprint Reference

The backend exposes a developer-friendly REST API.

| Method | Route | Description |
|---|---|---|
| **GET** | `/health` | Server check and MongoDB connectivity verification. |
| **POST** | `/demo-load` | Seeds the collection with 25 pre-processed test reviews. |
| **POST** | `/upload` | Ingests CSV feedback spreadsheets, runs NLP calculations, saves to DB. |
| **GET** | `/dashboard` | Returns overall volumes, categories, and top complaint metrics. |
| **GET** | `/reviews` | Paginated review feed with sorting, `sentiment`/`category` filters, and text search. |
| **GET** | `/trends` | Outputs monthly sentiment volumes for time-series charts. |
| **GET** | `/product-performance` | Product analytics (positive vs negative feedback rates). |
| **GET** | `/executive-summary` | Queries Gemini for high-level business intelligence reports. |
| **GET** | `/export/csv` | Generates a downloadable review CSV stream for external tool ingestion. |

---

## 📈 Power BI Integration

You can easily feed processed sentiment logs into Power BI Dashboards:
1. Copy the export route link: `http://localhost:5000/export/csv` (or your production backend URL).
2. Inside **Power BI Desktop**, click **Get Data** -> **Web**.
3. Paste the URL and click **OK**.
4. Power BI will fetch the live data directly from your database, enabling custom business intelligence visualization models.

# AI Review Intelligence Dashboard Backend

A production-quality Python backend API built on **Flask** and **MongoDB Atlas** that parses customer review files, performs local sentiment checks using VADER, automatically categories review topics, and generates high-level business reports using the **Google Gemini API**.

---

## 🛠️ Tech Stack
* **Python 3.12+**
* **Flask** & **Flask-CORS** (REST API)
* **PyMongo** (MongoDB Atlas connector)
* **Pandas** (CSV Parser & In-Memory Data Frames)
* **VADER Sentiment Analysis** (Local rule-based sentiment classification)
* **Google GenAI SDK** (Executive summary generation)
* **python-dotenv** (Environment variables configuration)
* **Gunicorn** (Production WSGI deployment server)

---

## 📂 Project Structure

```text
backend/
├── app.py                      # Main entrypoint, health checks, Swagger blueprints
├── config.py                   # Environment configuration parser
├── requirements.txt            # Package dependencies
├── .env.example                # Template for configuration environment settings
├── .env                        # Local configurations (keep secret!)
├── postman_collection.json     # Ready-to-import Postman API tests
│
├── database/
│   └── mongodb.py              # MongoDB Atlas client connection setup
│
├── routes/
│   ├── upload.py               # Handles CSV parsing/upload & demo data loader
│   ├── dashboard.py            # Dashboard overview aggregations
│   ├── reviews.py              # Paginated lists with query sorting & search
│   └── reports.py              # Monthly trends, product stats, Gemini summaries, exports
│
├── services/
│   ├── sentiment_service.py    # VADER sentiment analyzer logic
│   ├── category_service.py     # Regex-supported keyword categorizer
│   ├── gemini_service.py       # Google GenAI executive summary orchestrator
│   └── export_service.py       # Buffered CSV builder
│
└── utils/
    └── helpers.py              # MongoDB BSON serializer helpers
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have **Python 3.12+** installed on your workstation.

### 2. Installation
Navigate to the `backend/` directory, create a virtual environment, and install dependencies:

```bash
# Create Virtual Environment
python -m venv venv

# Activate Virtual Environment (Windows)
.\venv\Scripts\activate

# Activate Virtual Environment (macOS/Linux)
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Create a file named `.env` in the `backend/` directory matching the format of `.env.example`:

```env
SECRET_KEY=A0AVbKvDSotyoqGT
MONGO_URI=mongodb+srv://adi_db_user:d31pKRPvqkP5dymV@cluster0.jrdi1qp.mongodb.net/Review-Sentiment-Analyzer?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
FLASK_DEBUG=True
```

*Note: A functional MongoDB Atlas database credentials URI has been provided by default in `.env`. Replace `GEMINI_API_KEY` with your Google Gemini API token when ready. The app will gracefully fall back to high-quality simulated reports if the Gemini key is left blank.*

### 4. Running Locally
Run the Flask server:
```bash
python app.py
```
The server will run on `http://localhost:5000`. You can access interactive Swagger Documentation at `http://localhost:5000/docs`.

---

## 🍃 MongoDB Setup Instructions

The backend is pre-configured with a live MongoDB Atlas sandbox cluster. If you wish to set up your own MongoDB instance:
1. Register for an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (free tier).
3. Under **Database Access**, create a user with read/write credentials.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or configure your static hosting IP.
5. Retrieve your cluster connection string using the **Drivers** (Python) option.
6. Append the target database name `/Review-Sentiment-Analyzer` to the path portion of your connection string.
7. Paste the connection string into the `MONGO_URI` variable inside the `.env` file.

The backend will automatically initialize the database schema and create a `reviews` collection on first write.

---

## ♊ Google Gemini API Setup Instructions

To retrieve your Gemini API key:
1. Log in to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API Key**.
3. Create a API Key in a new project or select an existing one.
4. Copy the generated string and save it to the `GEMINI_API_KEY` parameter in the backend `.env` configuration file.
5. In production settings, define the key in the hosting environment variables (e.g. Render Dashboard).

---

## 📊 Power BI Integration Export

The backend provides a specialized endpoint:
`GET /export/csv`

This generates a downloadable file: `processed_reviews.csv`
Containing the columns: `review, date, product, sentiment, sentiment_score, category`.

### To load data into Power BI:
1. Open **Power BI Desktop**.
2. Select **Get Data** -> **Web** from the Home tab.
3. Paste the URL of your hosted backend export route:
   * Local testing: `http://localhost:5000/export/csv`
   * Production: `https://your-backend-app.onrender.com/export/csv`
4. Click **OK**. Power BI will fetch the processed reviews directly from your database, parsing the fields for custom visualizations.

---

## 🔌 API Route Reference

Expose interactive docs at `GET /docs`.

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/health` | System status and database ping checks. |
| **POST** | `/demo-load` | Resets review collection and populates 25 rich demo samples. |
| **POST** | `/upload` | Accept CSV files (`file` key), run VADER & keyword classification, save to DB. |
| **GET** | `/dashboard` | Overall sentiment counts, percentages, top issues, and category metrics. |
| **GET** | `/reviews` | Paginated reviews with sorting. Params: `page`, `limit`, `sentiment`, `category`, `search`. |
| **GET** | `/trends` | Monthly sentiment counts (for charts). |
| **GET** | `/product-performance` | Product breakdown metrics (positive %, negative % rates). |
| **GET** | `/executive-summary` | Aggregates stats and requests a structured report from Gemini. |
| **GET** | `/export/csv` | Download CSV of all processed reviews for Power BI. |

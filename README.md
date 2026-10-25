# 🔔 ActionAlert AI

ActionAlert AI reads your Gmail inbox, flags the emails that need action, pulls out the deadline and the to-dos, and sends you a Telegram alert when something urgent is due within 24 hours.

**Live demo:** <https://actionalert-ai.onrender.com>. The classifier is public, so you can paste any email and try it. The inbox dashboard needs the owner password. The free Render plan sleeps when idle, so the first request can take about 30 seconds.

---

## Features

- **Urgency classifier:** TF-IDF + Logistic Regression (scikit-learn) labels each email `urgent` or `not_urgent` with a confidence score.
- **Deadline and action extraction:** Gemini reads the email and returns the deadline plus a list of action items as JSON.
- **Gmail integration:** read-only OAuth access (`gmail.readonly`) fetches and classifies your latest emails.
- **Telegram alerts:** urgent emails with a deadline in the next 24h are pushed to your phone, once per email.
- **Inbox dashboard:** history table with a label filter, urgent-row highlighting, a "Fetch new emails" button and per-row delete.
- **Persistent storage:** Postgres (Neon) in production, SQLite locally, chosen automatically.
- **Retention:** emails older than `RETENTION_DAYS` (default 30) are cleaned up automatically.
- **Owner-only inbox:** `/emails` and `/history` require an `X-App-Password` header. `/classify` stays public for demos.

---

## Architecture

```
                    ┌──────────────────────────────┐
 Browser ──────────▶│ FastAPI (src/main.py)        │
 (frontend/         │                              │
  index.html)       │  /classify ─┐                │
                    │  /emails  ──┼─▶ classifier ──┼──▶ urgent? ──▶ Gemini extractor
 cron-job.org ─────▶│  /history   │   (TF-IDF+LR)  │                 (deadline, actions)
 (/health, /emails) │  /health    │                │                        │
                    └─────────────┼────────────────┘                        ▼
                                  │                       deadline < 24h ──▶ Telegram
                     Gmail API ◀──┘ (/emails only)
                                  │
                                  ▼
                     Postgres (Neon)  /  SQLite (local)
```

| File | Role |
|---|---|
| `src/main.py` | FastAPI app, routes, password check, alert logic |
| `src/classifier.py` | Text cleaning, training and prediction |
| `src/extractor.py` | Gemini prompt for deadline and action items |
| `src/gmail_auth.py` | Gmail OAuth and fetching recent emails |
| `src/storage.py` | Postgres/SQLite storage with the same SQL for both |
| `src/notifier.py` | Telegram alerts, with a console fallback |
| `frontend/index.html` | Single-page UI (vanilla JS, no build step) |
| `test_train.py` | Retrains `models/classifier.pkl` from `data/emails.csv` |

---

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/classify` | public | Body `{"subject": "...", "body": "..."}` → label, confidence, deadline, actions |
| `GET` | `/emails?n=10` | password | Fetch, classify, save and alert on the latest `n` Gmail emails |
| `GET` | `/history?limit=50&label=urgent` | password | Saved emails, newest first |
| `DELETE` | `/history/{id}` | password | Remove one saved email |
| `GET` | `/health` | public | Health check used by Render and the keep-alive ping |

---

## Run locally

Requires Python 3.10+.

```bash
git clone https://github.com/dark-maj/ActionAlert-AI.git
cd ActionAlert-AI
python -m venv venv
venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

1. Create a `.env` file (see the table below). `GEMINI_API_KEY` is the only value the classifier page needs.
2. For the Gmail features, download an OAuth **Desktop app** client from Google Cloud as `credentials.json` into the project root. The first fetch opens a browser to sign in and saves `token.json`.
3. Start the server:

   ```bash
   python -m uvicorn src.main:app --reload
   ```

4. Open <http://127.0.0.1:8000>.

To retrain the classifier after editing `data/emails.csv`, run `python test_train.py`.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | yes | Google AI Studio key for deadline and action extraction |
| `APP_PASSWORD` | in production | Owner password for `/emails`, `/history` and delete. If unset, those routes are open |
| `GMAIL_TOKEN_JSON` | in production | Contents of `token.json`. Locally the file is used instead |
| `DATABASE_URL` | no | Postgres connection string (e.g. Neon, with `?sslmode=require`). If unset, SQLite is used |
| `DB_PATH` | no | SQLite file path, default `data/actionalert.db` |
| `TELEGRAM_BOT_TOKEN` | no | Bot token from @BotFather. If unset, alerts are printed to the console |
| `TELEGRAM_CHAT_ID` | no | Your chat ID (send the bot a message, then check `getUpdates`) |
| `RETENTION_DAYS` | no | Delete saved emails older than this many days, default `30`. `0` keeps everything |

Never commit `.env`, `credentials.json` or `token.json`; they're in `.gitignore`.

---

## Deploy (Render)

`render.yaml` defines the service: `pip install -r requirements.txt`, then `uvicorn src.main:app`, with `/health` as the health check. Set the secret variables above in Render → Environment.

Optional cron-job.org jobs:
- `GET /health` every 10 minutes keeps the free instance awake.
- `GET /emails?n=10` every 30 minutes, with the header `X-App-Password`, checks the inbox automatically, so urgent alerts reach Telegram without opening the dashboard.

---

## Limitations and next steps

- The classifier is trained on a small hand-labelled set (92 emails, balanced between the two labels), so treat its confidence as a rough signal. More labelled data is the biggest improvement available.
- The Google OAuth app is unverified, which is fine for a single owner but not for other users.
- Ideas: a Telegram chat bot (paste an email and get the classification back), "ignore" instead of delete, and moving from `google-generativeai` to the newer `google-genai` SDK.

---

## License

MIT, see [LICENSE](LICENSE).

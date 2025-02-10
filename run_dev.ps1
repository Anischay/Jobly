# Start FastAPI backend
Start-Process -NoNewWindow powershell -ArgumentList "uvicorn src.ml.api:app --reload --port 8000"

# Start Next.js frontend
npm run dev

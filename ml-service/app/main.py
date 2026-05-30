from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ocr, anomaly

app = FastAPI(
    title="ExpenseFlow ML Service",
    description="Machine learning microservice for OCR, anomaly detection, and fraud scoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR"])
app.include_router(anomaly.router, prefix="/api/anomaly", tags=["Anomaly Detection"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-service", "version": "1.0.0"}


@app.get("/")
async def root():
    return {
        "service": "ExpenseFlow ML Service",
        "endpoints": {
            "health": "/health",
            "ocr_extract": "POST /api/ocr/extract",
            "anomaly_detect": "POST /api/anomaly/detect",
            "fraud_score": "POST /api/anomaly/fraud-score",
        },
    }

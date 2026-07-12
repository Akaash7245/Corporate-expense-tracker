import random
import re
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class OCRResult(BaseModel):
    merchant: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[str] = None
    items: list[str] = []
    raw_text: str = ""
    confidence: float = 0.0


@router.post("/extract", response_model=OCRResult)
async def extract_receipt(file: UploadFile = File(...)):
    """
    Extract structured data from a receipt image.
    Uses simulated OCR for development (replace with Tesseract/Google Vision in production).
    """
    contents = await file.read()
    file_size = len(contents)

    # Simulated OCR extraction (replace with pytesseract in production)
    merchants = [
        "Starbucks Coffee", "Uber Technologies", "Delta Airlines",
        "Marriott Hotels", "Amazon.com", "Office Depot", "Chipotle",
        "FedEx Corporation", "Hilton Hotels", "Best Western",
    ]

    simulated_result = OCRResult(
        merchant=random.choice(merchants),
        amount=round(random.uniform(10, 500), 2),
        date="2026-05-30",
        items=[
            f"Item {i + 1} - ${round(random.uniform(5, 100), 2)}"
            for i in range(random.randint(1, 5))
        ],
        raw_text=f"[Simulated OCR] File: {file.filename}, Size: {file_size} bytes",
        confidence=round(random.uniform(0.75, 0.98), 2),
    )

    return simulated_result

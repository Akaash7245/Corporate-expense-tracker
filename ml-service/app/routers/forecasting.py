import math
from datetime import datetime, timedelta
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class MonthlyData(BaseModel):
    month: str  # Format: "YYYY-MM"
    amount: float

class ForecastRequest(BaseModel):
    category: str
    historical_data: List[MonthlyData]
    months_to_predict: int = 3

class ForecastPoint(BaseModel):
    month: str
    predicted_amount: float
    confidence_interval_low: float
    confidence_interval_high: float

class ForecastResult(BaseModel):
    category: str
    forecast: List[ForecastPoint]
    trend: str  # "increasing", "decreasing", "stable"
    volatility: float

@router.post("/predict", response_model=ForecastResult)
async def predict_expenses(request: ForecastRequest):
    """
    Predict future expenses based on historical data using simple linear regression.
    """
    hist = sorted(request.historical_data, key=lambda x: x.month)
    
    if len(hist) < 2:
        # Not enough data for trend analysis, return flat average
        avg = hist[0].amount if hist else 0.0
        return generate_flat_forecast(request.category, avg, request.months_to_predict, hist)

    # Linear Regression: y = mx + c
    n = len(hist)
    x = list(range(n))
    y = [d.amount for d in hist]
    
    sum_x = sum(x)
    sum_y = sum(y)
    sum_xy = sum(x[i] * y[i] for i in range(n))
    sum_xx = sum(x[i] * x[i] for i in range(n))
    
    denominator = (n * sum_xx - sum_x * sum_x)
    if denominator == 0:
        # Prevent division by zero
        m = 0
    else:
        m = (n * sum_xy - sum_x * sum_y) / denominator
        
    c = (sum_y - m * sum_x) / n
    
    # Calculate volatility (standard deviation of residuals)
    residuals = [y[i] - (m * x[i] + c) for i in range(n)]
    variance = sum(r * r for r in residuals) / n
    std_dev = math.sqrt(variance)
    
    trend = "stable"
    if m > (sum_y / n) * 0.05:  # more than 5% growth per period
        trend = "increasing"
    elif m < -(sum_y / n) * 0.05:
        trend = "decreasing"
        
    forecasts = []
    last_month_str = hist[-1].month
    
    try:
        last_date = datetime.strptime(last_month_str, "%Y-%m")
    except ValueError:
        # Fallback if format is not YYYY-MM
        last_date = datetime.now()
        
    for i in range(request.months_to_predict):
        pred_x = n + i
        pred_y = max(0, m * pred_x + c)  # Expenses can't be negative
        
        # Calculate next month (handling year rollover)
        month = last_date.month + i + 1
        year = last_date.year + (month - 1) // 12
        month = (month - 1) % 12 + 1
        
        pred_month_str = f"{year}-{month:02d}"
        
        # Simple confidence interval (expanding with time)
        margin = std_dev * (1.96 + i * 0.2)  # 95% CI roughly
        
        forecasts.append(ForecastPoint(
            month=pred_month_str,
            predicted_amount=round(pred_y, 2),
            confidence_interval_low=max(0, round(pred_y - margin, 2)),
            confidence_interval_high=round(pred_y + margin, 2)
        ))
        
    return ForecastResult(
        category=request.category,
        forecast=forecasts,
        trend=trend,
        volatility=round(std_dev, 2)
    )

def generate_flat_forecast(category, amount, months_to_predict, hist):
    forecasts = []
    
    last_date = datetime.now()
    if hist:
        try:
            last_date = datetime.strptime(hist[-1].month, "%Y-%m")
        except ValueError:
            pass
            
    for i in range(months_to_predict):
        month = last_date.month + i + 1
        year = last_date.year + (month - 1) // 12
        month = (month - 1) % 12 + 1
        
        pred_month_str = f"{year}-{month:02d}"
        forecasts.append(ForecastPoint(
            month=pred_month_str,
            predicted_amount=round(amount, 2),
            confidence_interval_low=max(0, round(amount * 0.9, 2)),
            confidence_interval_high=round(amount * 1.1, 2)
        ))
        
    return ForecastResult(
        category=category,
        forecast=forecasts,
        trend="stable",
        volatility=0.0
    )

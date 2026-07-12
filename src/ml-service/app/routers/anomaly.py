import math
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class ExpenseData(BaseModel):
    amount: float
    category: str
    merchant: Optional[str] = None
    description: Optional[str] = None
    user_avg_expense: Optional[float] = None
    user_max_expense: Optional[float] = None
    frequency_per_month: Optional[int] = None


class AnomalyResult(BaseModel):
    is_anomaly: bool
    anomaly_score: float
    risk_level: str  # low, medium, high
    reasons: list[str]
    recommendation: str


class FraudResult(BaseModel):
    fraud_score: float  # 0.0 to 1.0
    risk_level: str
    flags: list[str]
    explanation: str


# Category-specific thresholds for anomaly detection
CATEGORY_THRESHOLDS = {
    "Travel": {"mean": 350, "std": 200, "max": 2000},
    "Food & Dining": {"mean": 45, "std": 30, "max": 300},
    "Office Supplies": {"mean": 60, "std": 40, "max": 500},
    "Accommodation": {"mean": 200, "std": 120, "max": 1000},
    "Transportation": {"mean": 30, "std": 20, "max": 200},
    "Communication": {"mean": 50, "std": 25, "max": 150},
    "Entertainment": {"mean": 80, "std": 60, "max": 500},
    "Miscellaneous": {"mean": 40, "std": 30, "max": 300},
}


def calculate_z_score(value: float, mean: float, std: float) -> float:
    """Calculate z-score for anomaly detection."""
    if std == 0:
        return 0.0
    return (value - mean) / std


@router.post("/detect", response_model=AnomalyResult)
async def detect_anomaly(expense: ExpenseData):
    """
    Detect anomalies in expense data using statistical methods (z-score, IQR).
    Returns anomaly score and risk assessment.
    """
    reasons = []
    score = 0.0

    # Get category thresholds
    thresholds = CATEGORY_THRESHOLDS.get(
        expense.category,
        {"mean": 100, "std": 50, "max": 500},
    )

    # 1. Z-score analysis against category average
    z = calculate_z_score(expense.amount, thresholds["mean"], thresholds["std"])
    z_abs = abs(z)

    if z_abs > 3:
        score += 0.4
        reasons.append(
            f"Amount ${expense.amount:.2f} is {z_abs:.1f} standard deviations "
            f"from category average (${thresholds['mean']:.2f})"
        )
    elif z_abs > 2:
        score += 0.2
        reasons.append(
            f"Amount is significantly above category average "
            f"(${thresholds['mean']:.2f})"
        )

    # 2. Exceeds category maximum
    if expense.amount > thresholds["max"]:
        score += 0.3
        reasons.append(
            f"Exceeds category maximum threshold of ${thresholds['max']:.2f}"
        )

    # 3. Compare to user's historical average (if available)
    if expense.user_avg_expense and expense.user_avg_expense > 0:
        ratio = expense.amount / expense.user_avg_expense
        if ratio > 5:
            score += 0.3
            reasons.append(
                f"Amount is {ratio:.1f}x higher than user's average expense"
            )
        elif ratio > 3:
            score += 0.15
            reasons.append(
                f"Amount is {ratio:.1f}x higher than user's average expense"
            )

    # 4. Round number suspicion (common in fraud)
    if expense.amount >= 100 and expense.amount == round(expense.amount):
        score += 0.05
        reasons.append("Suspiciously round amount")

    # Clamp score
    score = min(score, 1.0)

    # Determine risk level
    if score >= 0.6:
        risk_level = "high"
        recommendation = "Flag for manual review by finance team."
    elif score >= 0.3:
        risk_level = "medium"
        recommendation = "Request additional documentation or receipt verification."
    else:
        risk_level = "low"
        recommendation = "Expense appears normal. Auto-approve eligible."

    if not reasons:
        reasons.append("No anomalies detected. Expense is within normal parameters.")

    return AnomalyResult(
        is_anomaly=score >= 0.3,
        anomaly_score=round(score, 3),
        risk_level=risk_level,
        reasons=reasons,
        recommendation=recommendation,
    )


@router.post("/fraud-score", response_model=FraudResult)
async def calculate_fraud_score(expense: ExpenseData):
    """
    Calculate fraud risk score using rule-based + statistical analysis.
    Returns a score from 0.0 (no risk) to 1.0 (high risk).
    """
    flags = []
    score = 0.0

    # Rule 1: Weekend/holiday submissions for certain categories
    # (Simplified - in production, check actual date)
    if expense.category in ["Office Supplies", "Communication"]:
        pass  # Would check if submitted on weekend

    # Rule 2: Amount analysis
    thresholds = CATEGORY_THRESHOLDS.get(
        expense.category, {"mean": 100, "std": 50, "max": 500}
    )

    z = calculate_z_score(expense.amount, thresholds["mean"], thresholds["std"])
    if abs(z) > 3:
        score += 0.25
        flags.append("extreme_amount")

    # Rule 3: Exact round numbers over $100
    if expense.amount >= 100 and expense.amount % 50 == 0:
        score += 0.1
        flags.append("round_number")

    # Rule 4: Just under common approval thresholds
    approval_limits = [100, 250, 500, 1000]
    for limit in approval_limits:
        if 0 < (limit - expense.amount) <= limit * 0.05:
            score += 0.15
            flags.append(f"just_under_{limit}_threshold")
            break

    # Rule 5: Missing merchant info
    if not expense.merchant or expense.merchant.strip() == "":
        score += 0.1
        flags.append("missing_merchant")

    # Rule 6: Vague or missing description
    if not expense.description or len(expense.description.strip()) < 10:
        score += 0.05
        flags.append("vague_description")

    # Rule 7: High frequency (if available)
    if expense.frequency_per_month and expense.frequency_per_month > 20:
        score += 0.15
        flags.append("high_frequency")

    # Clamp score
    score = min(score, 1.0)

    # Determine risk level
    if score >= 0.5:
        risk_level = "high"
        explanation = (
            "Multiple fraud indicators detected. This expense should be "
            "carefully reviewed before approval."
        )
    elif score >= 0.25:
        risk_level = "medium"
        explanation = (
            "Some potential indicators flagged. Consider requesting "
            "additional supporting documentation."
        )
    else:
        risk_level = "low"
        explanation = "No significant fraud indicators. Expense appears legitimate."

    return FraudResult(
        fraud_score=round(score, 3),
        risk_level=risk_level,
        flags=flags,
        explanation=explanation,
    )

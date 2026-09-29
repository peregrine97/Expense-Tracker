from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.api.auth import get_current_user_id
from backend.services import analytics
from datetime import datetime
import calendar

router = APIRouter()

@router.get("/summary/{year}/{month}")
def get_monthly_summary(
    year: int, 
    month: int, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id) # The Bouncer
):
    # 1. Ask the Head Chef for the raw income/expenses math
    summary = analytics.calculate_monthly_summary(db, user_id, year, month)
    
    # 2. Ask the Head Chef for the Top X% ranking
    top_percentile = analytics.calculate_top_percentile(db, year, month, summary["savings_rate"])
    
    # 3. Calculate points earned this month
    points_earned = analytics.award_points(db, user_id, summary["savings_rate"])
    
    # Serve the final dish to the React frontend
    return {
        "summary": summary,
        "social_ranking": f"Top {top_percentile}%",
        "points_earned_this_month": points_earned
    }

@router.get("/historical/savings")
def get_historical_savings(
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    today = datetime.today()
    history = []
    # Fetch last 6 months
    for i in range(5, -1, -1):
        y = today.year
        m = today.month - i
        if m <= 0:
            m += 12
            y -= 1
        
        month_name = calendar.month_abbr[m]
        summary = analytics.calculate_monthly_summary(db, user_id, y, m)
        history.append({
            "month": f"{month_name} {y}",
            "savings": summary["savings"],
            "income": summary["income"],
            "expenses": summary["expenses"]
        })
    return history

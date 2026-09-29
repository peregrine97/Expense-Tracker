from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from backend.models.expense import Expense
from backend.models.user import User

def calculate_monthly_summary(db: Session, user_id: int, year: int, month: int):
    # Sum all income for the month directly in the database
    income = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        Expense.is_income == True,
        extract('year', Expense.expense_date) == year,
        extract('month', Expense.expense_date) == month
    ).scalar() or 0.0

    # Sum all expenses for the month
    expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        Expense.is_income == False,
        extract('year', Expense.expense_date) == year,
        extract('month', Expense.expense_date) == month
    ).scalar() or 0.0

    savings = income - expenses
    
    # Calculate savings rate (avoiding division by zero)
    savings_rate = (savings / income * 100) if income > 0 else 0
    return {"income": income, "expenses": expenses, "savings": savings, "savings_rate": savings_rate}

def calculate_top_percentile(db: Session, year: int, month: int, user_savings_rate: float):
    # This gets everyone's savings rate for the month to compare.
    # Note: For millions of users, this would be optimized into a direct SQL query,
    # but this is perfect for our scale to understand the logic.
    users = db.query(User).all()
    rates = []
    for u in users:
        summary = calculate_monthly_summary(db, u.id, year, month)
        rates.append(summary["savings_rate"])
    
    if not rates: return 100
    
    # How many people have a savings rate LESS than our user?
    lower_rates = [r for r in rates if r < user_savings_rate]
    percentile = (len(lower_rates) / len(rates)) * 100
    
    # If they are in the 85th percentile, they are in the "Top 15%"
    top_x = 100 - percentile
    return round(top_x, 1)

def award_points(db: Session, user_id: int, savings_rate: float):
    # Basic gamification rule: 1 point for every 1% saved
    points_earned = int(max(0, savings_rate))
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.total_points += points_earned
        db.commit()
    
    return points_earned

from sqlalchemy.orm import Session
from sqlalchemy import extract
from backend.models.expense import Expense
from backend.schemas.expense import ExpenseCreate

def create_user_expense(db: Session, expense: ExpenseCreate, user_id: int):
    db_expense = Expense(**expense.model_dump(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses_by_user_and_month(db: Session, user_id: int, year: int, month: int):
    return db.query(Expense).filter(
        Expense.user_id == user_id,
        extract('year', Expense.expense_date) == year,
        extract('month', Expense.expense_date) == month
    ).all()

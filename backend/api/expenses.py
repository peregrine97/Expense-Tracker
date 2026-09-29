from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.core.database import get_db
from backend.crud import expense as crud_expense
from backend.schemas.expense import ExpenseCreate, ExpenseResponse
from backend.api.auth import get_current_user_id

router = APIRouter()

@router.post("/", response_model=ExpenseResponse)
def add_expense(
    expense: ExpenseCreate, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id) # Ensures only logged-in users get here
):
    return crud_expense.create_user_expense(db=db, expense=expense, user_id=user_id)

@router.get("/{year}/{month}", response_model=List[ExpenseResponse])
def get_monthly_expenses(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id) # Ensures only logged-in users get here
):
    return crud_expense.get_expenses_by_user_and_month(db=db, user_id=user_id, year=year, month=month)

from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0, description="Expense amount must be strictly positive")
    category: str = Field(..., min_length=1)
    is_income: bool = False
    description: Optional[str] = None
    expense_date: date

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

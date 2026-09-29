from sqlalchemy.orm import Session
from backend.models.user import User
from backend.schemas.user import UserCreate

def get_user_by_google_id(db: Session, google_id: str):
    return db.query(User).filter(User.google_id == google_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(email=user.email, name=user.name, google_id=user.google_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

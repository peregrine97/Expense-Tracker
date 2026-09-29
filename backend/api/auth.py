from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import httpx
from backend.core.database import get_db
from backend.crud import user as crud_user
from backend.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/login", response_model=UserResponse)
async def login_with_google(request: Request, token: str, db: Session = Depends(get_db)):
    if token == "test_token":
        # --- BYPASS FOR TESTING PURPOSES ---
        google_id = "test_123"
        email = "test@example.com"
        name = "Test User"
    else:
        # 1. Ask Google if the token the frontend sent is valid
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google Token")
            
        id_info = response.json()
        google_id = id_info['sub']
        email = id_info['email']
        name = id_info.get('name', 'Unknown User')

    # 2. Check if we know this user, if not, add them to our database
    user = crud_user.get_user_by_google_id(db, google_id=google_id)
    if not user:
        user_data = UserCreate(email=email, name=name, google_id=google_id)
        user = crud_user.create_user(db=db, user=user_data)
    
    # 3. Set the Session Cookie (The Table Tracker)
    request.session['user_id'] = user.id
    return user

@router.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"message": "Successfully logged out"}

# A helper to check if someone is logged in before letting them do things
def get_current_user_id(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Not logged in. Please log in first.")
    return user_id

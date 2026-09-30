from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from backend.core.config import settings
from backend.core.database import engine, Base
from backend.api import auth, expenses, analytics
from backend.services.notifications import end_of_month_reminder_job

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    print("Creating Database Tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Starting Background Robot (APScheduler)...")
    scheduler = BackgroundScheduler()
    
    # Schedule the reminder to run on the last day of every month at 10:00 AM
    scheduler.add_job(end_of_month_reminder_job, 'cron', day='last', hour=10)
    scheduler.start()
    
    yield # The application is now running and accepting requests
    
    # --- SHUTDOWN LOGIC ---
    print("Shutting down Background Robot...")
    scheduler.shutdown()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Expense Tracker API", version="1.0.0", lifespan=lifespan)

# Add CORS Middleware to allow requests from the Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://expense-tracker-three-chi-20.vercel.app",
        "https://expense-tracker-git-main-yashcomjfn.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the Session Cookie tracker using our secret key, configured for cross-origin (third-party) cookies
app.add_middleware(
    SessionMiddleware, 
    secret_key=settings.SECRET_KEY, 
    same_site="none", 
    https_only=True
)

# Register our Waiters (Routers)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracker API! The Restaurant is fully operational."}

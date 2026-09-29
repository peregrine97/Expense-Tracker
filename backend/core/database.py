from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings

# We get the DATABASE_URL securely from our settings file.
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(db_url)

# 2. Create a SessionLocal class: Each time we need to do work in the database,
# we create a new 'session' (like opening the fridge door).
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create a Base class: All our Tupperware Blueprints (SQLAlchemy models) 
# will inherit from this base class so SQLAlchemy knows about them.
Base = declarative_base()

# 4. Dependency function: We will use this in our API routes. It safely gets a 
# database session for a single request, and ensures it gets closed afterwards.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

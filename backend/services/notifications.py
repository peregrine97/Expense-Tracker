from twilio.rest import Client
from sqlalchemy.orm import Session
from backend.core.config import settings
from backend.core.database import SessionLocal
from backend.models.user import User

def send_sms(to_phone_number: str, message_body: str):
    # This connects to Twilio using your secret keys
    try:
        # Note: This will fail if the fake keys in .env aren't replaced with real ones
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message_body,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_phone_number
        )
        return True
    except Exception as e:
        print(f"Failed to send SMS to {to_phone_number}: {e}")
        return False

def end_of_month_reminder_job():
    """
    This function will be triggered by our Robot (APScheduler) at the end of every month.
    """
    print("🤖 Robot waking up! Sending end of month reminders...")
    
    # We need to manually open the fridge door (Database session) because this 
    # isn't triggered by a normal user's web request, it's triggered by the background robot.
    db: Session = SessionLocal()
    try:
        # Find all users who have provided a phone number
        users = db.query(User).filter(User.phone_number.isnot(None)).all()
        
        for user in users:
            name = user.name or "Saver"
            message = (
                f"Hi {name}! The month is ending. 📈 "
                f"Don't forget to log into the Expense Tracker to review your final numbers "
                f"and see your new Social Ranking and points!"
            )
            # Send the text!
            send_sms(user.phone_number, message)
            
        print(f"✅ Sent reminders to {len(users)} users.")
    finally:
        # ALWAYS close the fridge door
        db.close()

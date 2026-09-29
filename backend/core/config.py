from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # These match the names of the variables in our .env file exactly.
    # Pydantic will automatically look for them and make sure they are strings.
    DATABASE_URL: str
    SECRET_KEY: str

    # Twilio keys (with defaults so the app doesn't crash before you set them up)
    TWILIO_ACCOUNT_SID: str = "fake_sid"
    TWILIO_AUTH_TOKEN: str = "fake_token"
    TWILIO_PHONE_NUMBER: str = "+1234567890"

    # This tells Pydantic to look for a file named ".env" to find these variables
    model_config = SettingsConfigDict(env_file=".env")

# We create one instance of this Settings class to use everywhere in our app
settings = Settings()

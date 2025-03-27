from zoneinfo import ZoneInfo
from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    API_URL = os.getenv("API_URL")
    RADIOCULT_SECRET_KEY = os.getenv("RADIOCULT_SECRET_KEY")
    TIMEZONE = ZoneInfo("Australia/Melbourne")
    
    @staticmethod
    def validate():
        if not Config.API_URL:
            raise ValueError("API_URL environment variable is required")
        if not Config.RADIOCULT_SECRET_KEY:
            raise ValueError("RADIOCULT_SECRET_KEY environment variable is required")

Config.validate()
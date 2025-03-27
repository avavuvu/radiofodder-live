from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from config import Config

def datetime_to_iso(date: datetime) -> str:
    if date.utcoffset() != timedelta(0):
        date = date.astimezone(ZoneInfo("UTC"))
    return date.isoformat().replace("+00:00", "Z")

def get_current_date() -> datetime:
    return datetime.now(Config.TIMEZONE)
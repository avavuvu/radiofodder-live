from fastapi import APIRouter, Request, HTTPException
import httpx
from utils.time_utility import get_current_date, datetime_to_iso
from config import Config
from datetime import timedelta

router = APIRouter(prefix="/api/schedule")

@router.get("/live")
async def get_live_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client
        url = f"{Config.API_URL.rstrip('/')}/schedule/live"
        response = await http_client.request("GET", url)
        return response.json()["result"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/week")
async def get_week_schedule(request: Request):
    try:
        current_date = get_current_date()
        print(current_date)
        print(current_date.replace(hour=0, minute=0, second=0))
        start_of_week = current_date
        end_of_week = current_date + timedelta(days=6)
        
        url = (
            f"{Config.API_URL.rstrip('/')}/schedule?"
            f"startDate={datetime_to_iso(start_of_week.replace(hour=0, minute=0, second=0))}&"
            f"endDate={datetime_to_iso(end_of_week.replace(hour=23, minute=59, second=59))}"
        )
        
        response = await request.state.http_client.request("GET", url)
        return response.json()["schedules"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/day")
async def get_day_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client

        current_date = get_current_date()
        start_of_day = current_date.replace(hour=0, minute=0, second=0)
        start_date = datetime_to_iso(start_of_day)

        end_of_day = current_date.replace(hour=23, minute=59, second=59)
        end_date = datetime_to_iso(end_of_day)

        url = f"{Config.API_URL.rstrip('/')}/schedule?startDate={start_date}&endDate={end_date}"

        response = await http_client.request("GET", url)

        return response.json()["schedules"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")

@router.get("/latertoday")
async def get_day_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client

        current_date = get_current_date()
        start_date = datetime_to_iso(current_date)

        end_of_day = current_date.replace(hour=23, minute=59, second=59)
        end_date = datetime_to_iso(end_of_day)

        url = f"{Config.API_URL.rstrip('/')}/schedule?startDate={start_date}&endDate={end_date}"

        response = await http_client.request("GET", url)

        return response.json()["schedules"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")

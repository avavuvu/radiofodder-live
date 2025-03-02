from zoneinfo import ZoneInfo
from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
from radiocult_middleware import RadoicultMiddleware
from datetime import datetime, timedelta, timezone

load_dotenv()

app = FastAPI()

api_url = os.getenv("API_URL")
if not api_url:
    raise ValueError("API_URL environment variable is required")

api_key = os.getenv("RADIOCULT_SECRET_KEY")
if not api_key:
    raise ValueError("RADIOCULT_SECRET_KEY environment variable is required")

app.add_middleware(CORSMiddleware, 
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://radiofodder-live.web.app",
        "https://radiofodder.live",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"])

app.add_middleware(RadoicultMiddleware, 
    api_key=api_key, 
    api_url=api_url)

@app.get("/")
async def index():
    return {"message": "Hello World"}
    
@app.get("/api/schedule/live")
async def get_live_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client
        url = f"{api_url.rstrip('/')}/schedule/live"

        response = await http_client.request("GET", url)

        return response.json()["result"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")

def datetime_to_iso(date: datetime):
    if date.utcoffset() != timedelta(0):
        date = date.astimezone(ZoneInfo("UTC"))

    return date.isoformat().replace("+00:00","Z")

@app.get("/api/schedule/week")
async def get_week_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client

        current_date = datetime.now(ZoneInfo("Australia/Melbourne"))
        start_of_week = current_date - timedelta(days=current_date.weekday())
        start_date = datetime_to_iso( 
            start_of_week.replace(hour=0, minute=0, second=0)
            )

        end_of_week = current_date + timedelta(days=6 - current_date.weekday())
        end_date = datetime_to_iso(
            end_of_week.replace(hour=23, minute=59, second=59)
            )
        
        url = f"{api_url.rstrip('/')}/schedule?startDate={start_date}&endDate={end_date}"

        response = await http_client.request("GET", url)

        return response.json()["schedules"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")


@app.get("/api/schedule/day")
async def get_day_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client

        current_date = datetime.now(ZoneInfo("Australia/Melbourne"))
        start_of_day = current_date.replace(hour=0, minute=0, second=0)
        start_date = datetime_to_iso(start_of_day)

        end_of_day = current_date.replace(hour=23, minute=59, second=59)
        end_date = datetime_to_iso(end_of_day)

        url = f"{api_url.rstrip('/')}/schedule?startDate={start_date}&endDate={end_date}"

        response = await http_client.request("GET", url)

        return response.json()["schedules"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")

@app.get("/api/schedule/latertoday")
async def get_day_schedule(request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client

        current_date = datetime.now(ZoneInfo("Australia/Melbourne"))
        start_date = datetime_to_iso(current_date)

        end_of_day = current_date.replace(hour=23, minute=59, second=59)
        end_date = datetime_to_iso(end_of_day)

        url = f"{api_url.rstrip('/')}/schedule?startDate={start_date}&endDate={end_date}"

        response = await http_client.request("GET", url)

        return response.json()["schedules"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")

#IMPORTANT: DEFINE THE CATCHALL API LAST
@app.get("/api/{path:path}")
async def get_api(path: str, request: Request):
    try:
        http_client: httpx.AsyncClient = request.state.http_client
        url = f"{api_url.rstrip('/')}/{path}"

        response = await http_client.request("GET", url)

        return response.json()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error, {str(e)}")




if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT")) or 8080

    uvicorn.run(app=app, host="0.0.0.0", port=port)
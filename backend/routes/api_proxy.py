from fastapi import APIRouter, Request, HTTPException
from config import Config

router = APIRouter(prefix="/api")

@router.get("/{path:path}")
async def catch_all_proxy(path: str, request: Request):
    try:
        url = f"{Config.API_URL.rstrip('/')}/{path}"
        response = await request.state.http_client.request("GET", url)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
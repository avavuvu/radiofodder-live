import os
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import FastAPI, Request, Response
import httpx

## Add api key automatically to requests
class RadoicultMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, api_key: str, api_url: str):
        super().__init__(app)
        self.api_key = api_key
        self.api_url = api_url
        self.http_client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "x-api-key": f"{self.api_key}",
                "Content-Type": "application/json"})
        
    async def dispatch(self, request: Request, call_next):
        request.state.http_client = self.http_client
        response = await call_next(request)
        return response

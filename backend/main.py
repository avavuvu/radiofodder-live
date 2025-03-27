from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import Config
from middleware.radiocult import RadoicultMiddleware
from routes import schedule, api_proxy
import os

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173", 
        "https://radiofodder-live.web.app",
        "https://radiofodder.live",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(
    RadoicultMiddleware,
    api_key=Config.RADIOCULT_SECRET_KEY,
    api_url=Config.API_URL
)

# Routes
app.include_router(schedule.router)
app.include_router(api_proxy.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT")) or 8080

    uvicorn.run(app=app, host="0.0.0.0", port=port)
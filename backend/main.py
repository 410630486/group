from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import User, UserCreate, UserUpdate
from database.mongodb import get_database, connect_to_mongo, close_mongo_connection
from routes.user_routes import router as user_router
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時連接資料庫
    await connect_to_mongo()
    yield
    # 關閉時斷開資料庫連接
    await close_mongo_connection()

# 創建 FastAPI 應用
app = FastAPI(
    title="User Management API",
    description="前後端分離 - Python FastAPI + MongoDB 後端",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設置 - 允許前端跨域訪問
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含用戶路由
app.include_router(user_router, prefix="/api", tags=["users"])

# 根路由
@app.get("/")
async def root():
    return {"message": "用戶管理 API - Python FastAPI + MongoDB"}

# 健康檢查
@app.get("/health")
async def health_check():
    try:
        # 檢查資料庫連接
        db = await get_database()
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected", "error": str(e)}
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.connection import init_database, close_database
from routes.products import router as products_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時初始化資料庫
    await init_database()
    yield
    # 關閉時清理資源
    await close_database()

app = FastAPI(
    title="存貨管理系統 API",
    description="前後端分離的存貨管理系統後端 API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊路由
app.include_router(products_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "存貨管理系統 API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API 服務正常運行"}

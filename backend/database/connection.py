import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.product import Product

# MongoDB 配置
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "inventory_db")

# MongoDB 客戶端
client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

async def init_database():
    """初始化資料庫連接"""
    await init_beanie(database=db, document_models=[Product])
    print("資料庫連接成功！")

async def close_database():
    """關閉資料庫連接"""
    client.close()
    print("資料庫連接已關閉")

async def get_database():
    """取得資料庫實例"""
    return db

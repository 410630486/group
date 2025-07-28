from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """連接到 MongoDB"""
    # MongoDB 連接字符串
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "user_management")
    
    print(f"正在連接到 MongoDB: {mongodb_url}")
    
    try:
        # 創建客戶端
        db.client = AsyncIOMotorClient(mongodb_url)
        
        # 測試連接
        await db.client.admin.command('ping')
        print("✅ MongoDB 連接成功!")
        
        # 設置資料庫
        db.database = db.client[database_name]
        
        # 創建索引（確保 email 唯一）
        await db.database.users.create_index("email", unique=True)
        print("✅ 資料庫索引創建完成!")
        
    except Exception as e:
        print(f"❌ MongoDB 連接失敗: {e}")
        raise e

async def close_mongo_connection():
    """關閉 MongoDB 連接"""
    if db.client:
        db.client.close()
        print("✅ MongoDB 連接已關閉")

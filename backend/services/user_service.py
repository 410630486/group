from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError
from models.user import User, UserCreate, UserUpdate, UserResponse
from database.mongodb import get_database

class UserService:
    def __init__(self):
        self.collection_name = "users"
    
    async def get_collection(self):
        """獲取用戶集合"""
        db = await get_database()
        return db[self.collection_name]
    
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """創建新用戶"""
        collection = await self.get_collection()
        
        try:
            # 轉換為字典
            user_dict = user_data.model_dump()
            
            # 插入資料庫
            result = await collection.insert_one(user_dict)
            
            # 獲取插入的用戶
            created_user = await collection.find_one({"_id": result.inserted_id})
            
            return UserResponse(
                id=str(created_user["_id"]),
                name=created_user["name"],
                email=created_user["email"],
                phone=created_user.get("phone")
            )
            
        except DuplicateKeyError:
            raise ValueError(f"郵箱 {user_data.email} 已存在")
    
    async def get_all_users(self) -> List[UserResponse]:
        """獲取所有用戶"""
        collection = await self.get_collection()
        
        users = []
        async for user in collection.find():
            users.append(UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                phone=user.get("phone")
            ))
        
        return users
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """根據 ID 獲取用戶"""
        if not ObjectId.is_valid(user_id):
            return None
            
        collection = await self.get_collection()
        user = await collection.find_one({"_id": ObjectId(user_id)})
        
        if user:
            return UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                phone=user.get("phone")
            )
        return None
    
    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserResponse]:
        """更新用戶信息"""
        if not ObjectId.is_valid(user_id):
            return None
            
        collection = await self.get_collection()
        
        # 只更新提供的字段
        update_data = {k: v for k, v in user_data.model_dump().items() if v is not None}
        
        if not update_data:
            # 如果沒有要更新的數據，返回現有用戶
            return await self.get_user_by_id(user_id)
        
        try:
            result = await collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 1:
                return await self.get_user_by_id(user_id)
            
        except DuplicateKeyError:
            if "email" in update_data:
                raise ValueError(f"郵箱 {update_data['email']} 已被其他用戶使用")
        
        return None
    
    async def delete_user(self, user_id: str) -> bool:
        """刪除用戶"""
        if not ObjectId.is_valid(user_id):
            return False
            
        collection = await self.get_collection()
        result = await collection.delete_one({"_id": ObjectId(user_id)})
        
        return result.deleted_count == 1
    
    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """根據郵箱獲取用戶"""
        collection = await self.get_collection()
        user = await collection.find_one({"email": email})
        
        if user:
            return UserResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                phone=user.get("phone")
            )
        return None

# 創建用戶服務實例
user_service = UserService()

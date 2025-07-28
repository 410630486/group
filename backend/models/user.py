from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId
from pydantic import ConfigDict

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    """用戶基礎模型"""
    name: str = Field(..., min_length=2, max_length=50, description="用戶姓名")
    email: EmailStr = Field(..., description="電子郵箱")
    phone: Optional[str] = Field(None, max_length=20, description="電話號碼")

class UserCreate(UserBase):
    """創建用戶時使用的模型"""
    pass

class UserUpdate(BaseModel):
    """更新用戶時使用的模型"""
    name: Optional[str] = Field(None, min_length=2, max_length=50, description="用戶姓名")
    email: Optional[EmailStr] = Field(None, description="電子郵箱")
    phone: Optional[str] = Field(None, max_length=20, description="電話號碼")

class User(UserBase):
    """用戶完整模型（包含 ID）"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

class UserInDB(User):
    """資料庫中的用戶模型"""
    pass

class UserResponse(BaseModel):
    """API 響應用戶模型"""
    id: str = Field(..., description="用戶 ID")
    name: str = Field(..., description="用戶姓名")
    email: str = Field(..., description="電子郵箱")
    phone: Optional[str] = Field(None, description="電話號碼")
    
    model_config = ConfigDict(from_attributes=True)

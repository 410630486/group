from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional

class Product(Document):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    min_stock: int = Field(..., ge=0)
    supplier: str = Field(..., min_length=1, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        collection = "products"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "iPhone 15 Pro",
                "description": "最新款 iPhone，搭載 A17 Pro 處理器",
                "category": "手機",
                "price": 35900,
                "stock": 25,
                "min_stock": 10,
                "supplier": "Apple Taiwan"
            }
        }

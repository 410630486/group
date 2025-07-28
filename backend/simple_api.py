from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import json
import os
from datetime import datetime
import random

app = FastAPI(
    title="存貨管理系統 API",
    description="前後端分離的存貨管理系統後端 API",
    version="1.0.0"
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 簡單的記憶體資料庫
products_db: List[Dict[str, Any]] = []

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

@app.get("/api/products/")
async def get_all_products():
    """獲取所有產品"""
    return products_db

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    """根據 ID 獲取產品"""
    for product in products_db:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="產品不存在")

@app.post("/api/products/")
async def create_product(product_data: Dict[str, Any]):
    """創建新產品"""
    product_id = str(len(products_db) + 1)
    product = {
        "id": product_id,
        "_id": product_id,
        **product_data,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    products_db.append(product)
    return product

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product_data: Dict[str, Any]):
    """更新產品"""
    for i, product in enumerate(products_db):
        if product["id"] == product_id:
            products_db[i].update({
                **product_data,
                "updated_at": datetime.now().isoformat()
            })
            return products_db[i]
    raise HTTPException(status_code=404, detail="產品不存在")

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    """刪除產品"""
    for i, product in enumerate(products_db):
        if product["id"] == product_id:
            products_db.pop(i)
            return {"message": "產品刪除成功"}
    raise HTTPException(status_code=404, detail="產品不存在")

@app.get("/api/products/stats/inventory")
async def get_inventory_stats():
    """獲取庫存統計"""
    total_products = len(products_db)
    total_value = sum(p["price"] * p["stock"] for p in products_db)
    low_stock_count = sum(1 for p in products_db if p["stock"] <= p["minStock"])
    categories = list(set(p["category"] for p in products_db))
    
    return {
        "totalProducts": total_products,
        "totalValue": total_value,
        "lowStockCount": low_stock_count,
        "categories": categories
    }

@app.post("/api/products/seed")
async def seed_products():
    """生成100個測試產品數據"""
    global products_db
    products_db = []  # 清空現有數據
    
    # 產品類別和供應商
    categories = ["手機", "筆記型電腦", "平板電腦", "耳機", "充電器", "保護套", "螢幕", "鍵盤", "滑鼠", "攝影機"]
    suppliers = ["Apple Taiwan", "Samsung", "華碩", "宏碁", "微星", "技嘉", "聯想", "戴爾", "HP", "小米"]
    
    # 生成產品名稱模板
    product_names = {
        "手機": ["iPhone 15", "Galaxy S24", "Pixel 8", "小米 14", "OPPO Find X7"],
        "筆記型電腦": ["MacBook Air", "ThinkPad X1", "ZenBook", "Aspire 5", "Legion"],
        "平板電腦": ["iPad Pro", "Galaxy Tab", "Surface Pro", "MatePad", "小米平板"],
        "耳機": ["AirPods", "Galaxy Buds", "WH-1000XM5", "FreeBuds", "小米耳機"],
        "充電器": ["MagSafe", "無線充電器", "快充頭", "行動電源", "車充"],
        "保護套": ["手機殼", "筆電包", "平板套", "螢幕保護貼", "鍵盤膜"],
        "螢幕": ["4K 顯示器", "曲面螢幕", "電競螢幕", "便攜螢幕", "觸控螢幕"],
        "鍵盤": ["機械鍵盤", "無線鍵盤", "藍牙鍵盤", "電競鍵盤", "薄膜鍵盤"],
        "滑鼠": ["電競滑鼠", "無線滑鼠", "藍牙滑鼠", "軌跡球", "觸控板"],
        "攝影機": ["網路攝影機", "行車記錄器", "運動攝影機", "監控鏡頭", "直播攝影機"]
    }
    
    for i in range(100):
        category = random.choice(categories)
        supplier = random.choice(suppliers)
        base_name = random.choice(product_names[category])
        
        # 添加版本或型號
        versions = ["Pro", "Max", "Plus", "Ultra", "Mini", "Lite", "SE", ""]
        version = random.choice(versions)
        name = f"{base_name} {version}".strip()
        
        # 根據類別設定價格範圍
        price_ranges = {
            "手機": (8000, 50000),
            "筆記型電腦": (15000, 80000),
            "平板電腦": (8000, 35000),
            "耳機": (500, 15000),
            "充電器": (200, 3000),
            "保護套": (100, 2000),
            "螢幕": (5000, 40000),
            "鍵盤": (500, 8000),
            "滑鼠": (300, 5000),
            "攝影機": (1000, 20000)
        }
        
        min_price, max_price = price_ranges.get(category, (500, 10000))
        price = random.randint(min_price, max_price)
        stock = random.randint(0, 100)
        min_stock = random.randint(5, 20)
        
        product = {
            "id": str(i + 1),
            "_id": str(i + 1),
            "name": name,
            "description": f"高品質的{category}產品，適合各種使用場景",
            "category": category,
            "price": float(price),
            "stock": stock,
            "minStock": min_stock,
            "supplier": supplier,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        products_db.append(product)
    
    return {"message": f"成功生成 {len(products_db)} 個產品數據"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

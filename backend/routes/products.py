from fastapi import APIRouter, HTTPException, status
from models.product import Product
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_all_products():
    """獲取所有產品"""
    try:
        products = await Product.find_all().to_list()
        return products
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"獲取產品列表失敗: {str(e)}"
        )

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """根據 ID 獲取產品"""
    try:
        product = await Product.get(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="產品不存在"
            )
        return product
    except Exception as e:
        if "產品不存在" in str(e):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"獲取產品失敗: {str(e)}"
        )

@router.post("/", response_model=Product)
async def create_product(product_data: dict):
    """創建新產品"""
    try:
        product = Product(**product_data)
        await product.insert()
        return product
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"創建產品失敗: {str(e)}"
        )

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: dict):
    """更新產品"""
    try:
        product = await Product.get(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="產品不存在"
            )
        
        # 更新時間
        product_data["updated_at"] = datetime.now()
        
        # 更新產品資料
        for key, value in product_data.items():
            if hasattr(product, key):
                setattr(product, key, value)
        
        await product.save()
        return product
    except Exception as e:
        if "產品不存在" in str(e):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"更新產品失敗: {str(e)}"
        )

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """刪除產品"""
    try:
        product = await Product.get(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="產品不存在"
            )
        
        await product.delete()
        return {"message": "產品刪除成功"}
    except Exception as e:
        if "產品不存在" in str(e):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"刪除產品失敗: {str(e)}"
        )

@router.get("/stats/inventory")
async def get_inventory_stats():
    """獲取庫存統計"""
    try:
        products = await Product.find_all().to_list()
        
        total_products = len(products)
        total_value = sum(p.price * p.stock for p in products)
        low_stock_count = sum(1 for p in products if p.stock <= p.min_stock)
        categories = list(set(p.category for p in products))
        
        return {
            "totalProducts": total_products,
            "totalValue": total_value,
            "lowStockCount": low_stock_count,
            "categories": categories
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"獲取統計數據失敗: {str(e)}"
        )

@router.post("/seed")
async def seed_products():
    """生成100個測試產品數據"""
    try:
        # 清空現有產品
        await Product.find_all().delete()
        
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
        
        products = []
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
            
            product = Product(
                name=name,
                description=f"高品質的{category}產品，適合各種使用場景",
                category=category,
                price=float(price),
                stock=stock,
                min_stock=min_stock,
                supplier=supplier
            )
            products.append(product)
        
        # 批量插入產品
        await Product.insert_many(products)
        
        return {"message": f"成功生成 {len(products)} 個產品數據"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"生成測試數據失敗: {str(e)}"
        )

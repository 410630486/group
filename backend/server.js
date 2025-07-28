const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// 中間件
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// 內存中的產品資料
let products = [];
let nextId = 1;

// 生成測試數據
function generateSampleProducts() {
  const categories = ['電子產品', '服裝', '食品', '家居用品', '運動用品', '書籍', '玩具', '美妝'];
  const statuses = ['有庫存', '缺貨', '停產'];
  const suppliers = ['供應商A', '供應商B', '供應商C', '供應商D', '供應商E'];
  
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    products.push({
      id: i,
      name: `商品${i.toString().padStart(3, '0')}`,
      description: `這是商品${i}的詳細描述`,
      category: category,
      price: Math.floor(Math.random() * 1000) + 10,
      quantity: status === '缺貨' ? 0 : Math.floor(Math.random() * 100) + 1,
      sku: `SKU${i.toString().padStart(6, '0')}`,
      supplier: supplier,
      status: status,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }
  nextId = 101;
}

// 初始化測試數據
generateSampleProducts();

// API 路由

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: "存貨管理系統 API",
    version: "1.0.0",
    endpoints: {
      "GET /api/products/": "獲取所有產品",
      "GET /api/products/{id}": "獲取單個產品",
      "POST /api/products/": "創建新產品",
      "PUT /api/products/{id}": "更新產品",
      "DELETE /api/products/{id}": "刪除產品",
      "GET /api/products/stats/inventory": "獲取庫存統計",
      "POST /api/products/seed": "生成測試數據"
    }
  });
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 獲取所有產品
app.get('/api/products/', (req, res) => {
  res.json(products);
});

// 獲取單個產品
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: "產品未找到" });
  }
  
  res.json(product);
});

// 創建新產品
app.post('/api/products/', (req, res) => {
  const productData = req.body;
  
  const newProduct = {
    id: nextId++,
    ...productData,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 更新產品
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: "產品未找到" });
  }
  
  products[productIndex] = {
    ...products[productIndex],
    ...req.body,
    id: id,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  res.json(products[productIndex]);
});

// 刪除產品
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: "產品未找到" });
  }
  
  products.splice(productIndex, 1);
  res.json({ message: "產品已刪除" });
});

// 獲取庫存統計
app.get('/api/products/stats/inventory', (req, res) => {
  const totalProducts = products.length;
  const inStock = products.filter(p => p.status === '有庫存').length;
  const outOfStock = products.filter(p => p.status === '缺貨').length;
  const discontinued = products.filter(p => p.status === '停產').length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 10).length;
  
  res.json({
    totalProducts,
    inStock,
    outOfStock,
    discontinued,
    totalValue,
    lowStock
  });
});

// 重新生成測試數據
app.post('/api/products/seed', (req, res) => {
  products = [];
  nextId = 1;
  generateSampleProducts();
  
  res.json({
    message: "測試數據已重新生成",
    productsCount: products.length
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`伺服器正在 http://localhost:${PORT} 運行`);
  console.log(`API 文檔: http://localhost:${PORT}/`);
  console.log(`健康檢查: http://localhost:${PORT}/health`);
  console.log(`產品列表: http://localhost:${PORT}/api/products/`);
});

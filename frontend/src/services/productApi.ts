import { Product, ProductFormData, InventoryStats } from '../types/Product'

const API_BASE_URL = 'http://localhost:8000/api'

// 模擬數據 - 作為後端無法連接時的備用方案
const generateMockData = (): Product[] => {
  const categories = ['電子產品', '服裝', '食品', '家居用品', '運動用品', '書籍', '玩具', '美妝'];
  const statuses = ['有庫存', '缺貨', '停產'];
  const suppliers = ['供應商A', '供應商B', '供應商C', '供應商D', '供應商E'];
  
  const products: Product[] = [];
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const stock = status === '缺貨' ? 0 : Math.floor(Math.random() * 100) + 1;
    
    products.push({
      id: i.toString(),
      name: `商品${i.toString().padStart(3, '0')}`,
      description: `這是商品${i}的詳細描述`,
      category: category,
      price: Math.floor(Math.random() * 1000) + 10,
      stock: stock,
      minStock: 10,
      sku: `SKU${i.toString().padStart(6, '0')}`,
      supplier: supplier,
      status: status,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
  }
  return products;
};

let mockProducts = generateMockData();

export const productApi = {
  // 獲取所有產品
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // 轉換 MongoDB 的 _id 和日期格式
      return data.map((product: any) => ({
        ...product,
        id: product._id || product.id,
        createdAt: product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料:', error)
      // 返回模擬數據作為備用方案
      return mockProducts
    }
  },

  // 根據 ID 獲取產品
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const product = await response.json()
      
      return {
        ...product,
        id: product._id || product.id,
        createdAt: product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料:', error)
      // 從模擬數據中查找
      const product = mockProducts.find(p => p.id === id)
      return product || null
    }
  },

  // 創建新產品
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const product = await response.json()
      return {
        ...product,
        id: product._id || product.id,
        createdAt: product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料操作:', error)
      // 模擬創建新產品
      const newProduct: Product = {
        ...productData,
        id: (mockProducts.length + 1).toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      mockProducts.push(newProduct)
      return newProduct
    }
  },

  // 更新產品
  updateProduct: async (id: string, productData: ProductFormData): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const product = await response.json()
      return {
        ...product,
        id: product._id || product.id,
        createdAt: product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        updatedAt: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料操作:', error)
      // 模擬更新產品
      const productIndex = mockProducts.findIndex(p => p.id === id)
      if (productIndex === -1) {
        throw new Error('產品未找到')
      }
      
      const updatedProduct: Product = {
        ...mockProducts[productIndex],
        ...productData,
        id: id,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      mockProducts[productIndex] = updatedProduct
      return updatedProduct
    }
  },

  // 刪除產品
  deleteProduct: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料操作:', error)
      // 模擬刪除產品
      const productIndex = mockProducts.findIndex(p => p.id === id)
      if (productIndex === -1) {
        throw new Error('產品未找到')
      }
      mockProducts.splice(productIndex, 1)
    }
  },

  // 獲取庫存統計
  getInventoryStats: async (): Promise<InventoryStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/stats/inventory`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('無法連接到後端，使用模擬資料計算統計:', error)
      // 模擬統計計算
      const totalProducts = mockProducts.length
      const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
      const lowStockCount = mockProducts.filter(p => p.stock < p.minStock).length
      const categories = [...new Set(mockProducts.map(p => p.category))]
      
      return {
        totalProducts,
        totalValue,
        lowStockCount,
        categories
      }
    }
  },

  // 生成測試數據
  seedProducts: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/seed`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result.message
    } catch (error) {
      console.error('無法連接到後端，重新生成模擬資料:', error)
      // 重新生成模擬數據
      mockProducts = generateMockData()
      return '已重新生成100個測試產品（模擬模式）'
    }
  }
}

import { useState, useEffect } from 'react'
import './App.css'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import Dashboard from './components/Dashboard'
import { Product, ProductFormData, InventoryStats } from './types/Product'
import { productApi } from './services/productApi'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    categories: []
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // 載入產品列表
  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productApi.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('載入產品失敗:', error)
      alert('載入產品失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  // 載入統計數據
  const loadStats = async () => {
    try {
      const data = await productApi.getInventoryStats()
      setStats(data)
    } catch (error) {
      console.error('載入統計數據失敗:', error)
    }
  }

  useEffect(() => {
    loadProducts()
    loadStats()
  }, [])

  // 創建產品
  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      setLoading(true)
      await productApi.createProduct(productData)
      await Promise.all([loadProducts(), loadStats()])
      setShowForm(false)
      alert('產品創建成功！')
    } catch (error) {
      console.error('創建產品失敗:', error)
      alert('創建產品失敗，請檢查輸入信息')
    } finally {
      setLoading(false)
    }
  }

  // 更新產品
  const handleUpdateProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return
    
    try {
      setLoading(true)
      await productApi.updateProduct(editingProduct.id, productData)
      await Promise.all([loadProducts(), loadStats()])
      setEditingProduct(null)
      setShowForm(false)
      alert('產品更新成功！')
    } catch (error) {
      console.error('更新產品失敗:', error)
      alert('更新產品失敗，請檢查輸入信息')
    } finally {
      setLoading(false)
    }
  }

  // 刪除產品
  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true)
      await productApi.deleteProduct(id)
      await Promise.all([loadProducts(), loadStats()])
      alert('產品刪除成功！')
    } catch (error) {
      console.error('刪除產品失敗:', error)
      alert('刪除產品失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  // 開始編輯產品
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  // 取消表單
  const handleCancelForm = () => {
    setEditingProduct(null)
    setShowForm(false)
  }

  // 生成測試數據
  const handleSeedProducts = async () => {
    if (!window.confirm('這將清除現有數據並生成100個測試產品。確定要繼續嗎？')) {
      return
    }
    
    try {
      setLoading(true)
      const message = await productApi.seedProducts()
      await Promise.all([loadProducts(), loadStats()])
      alert(message)
    } catch (error) {
      console.error('生成測試數據失敗:', error)
      alert('生成測試數據失敗，請檢查後端服務是否正常運行')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-100" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: 0, padding: 0 }}>
      {/* 導航欄 */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100" style={{ margin: 0, padding: '0.5rem' }}>
        <div className="w-100 d-flex justify-content-between align-items-center">
          <a className="navbar-brand" href="#" style={{ margin: 0 }}>
            <i className="bi bi-boxes me-2"></i>
            存貨管理系統
          </a>
          <div className="navbar-nav">
            <span className="navbar-text">
              <i className="bi bi-person-circle me-1"></i>
              管理員
            </span>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="w-100" style={{ padding: '0.5rem', margin: 0 }}>
        {/* 載入指示器 */}
        {loading && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 9999 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">載入中...</span>
            </div>
          </div>
        )}

        {/* 儀表板 */}
        <Dashboard stats={stats} />

        {/* 操作按鈕 */}
        <div className="w-100 mb-4">
          <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowForm(true)}
              disabled={loading}
            >
              <i className="bi bi-plus-lg me-2"></i>
              新增產品
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => {
                loadProducts()
                loadStats()
              }}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              重新整理
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={handleSeedProducts}
              disabled={loading}
            >
              <i className="bi bi-database-fill me-2"></i>
              生成測試數據 (100個產品)
            </button>
          </div>
        </div>

        {/* 產品列表 */}
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* 產品表單模態框 */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  )
}

export default App

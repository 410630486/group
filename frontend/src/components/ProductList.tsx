import React, { useState } from 'react'
import { Product } from '../types/Product'

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // 篩選產品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // 獲取所有類別
  const categories = [...new Set(products.map(p => p.category))]

  // 格式化價格
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(price)
  }

  // 獲取庫存狀態樣式
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { class: 'text-danger', text: '缺貨', icon: 'bi-x-circle-fill' }
    if (stock <= minStock) return { class: 'text-warning', text: '庫存不足', icon: 'bi-exclamation-triangle-fill' }
    return { class: 'text-success', text: '庫存充足', icon: 'bi-check-circle-fill' }
  }

  return (
    <div className="card w-100">
      <div className="card-header">
        <div className="d-flex flex-wrap align-items-center" style={{ gap: '1rem' }}>
          <div className="flex-shrink-0">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>產品列表
              <span className="badge bg-primary ms-2">{filteredProducts.length}</span>
            </h5>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
              <div className="flex-fill" style={{ minWidth: '200px' }}>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="搜尋產品名稱或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-fill" style={{ minWidth: '150px' }}>
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">所有類別</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h5 className="text-muted mt-3">沒有找到產品</h5>
            <p className="text-muted">請嘗試調整搜尋條件或新增產品</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>產品資訊</th>
                  <th>類別</th>
                  <th>價格</th>
                  <th>庫存狀態</th>
                  <th>供應商</th>
                  <th>更新日期</th>
                  <th style={{ width: '120px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product.stock, product.minStock)
                  return (
                    <tr key={product.id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">{product.description}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{product.category}</span>
                      </td>
                      <td>
                        <strong>{formatPrice(product.price)}</strong>
                      </td>
                      <td>
                        <div className={stockStatus.class}>
                          <i className={`bi ${stockStatus.icon} me-1`}></i>
                          <span className="fw-bold">{product.stock}</span>
                          <small className="d-block">{stockStatus.text}</small>
                        </div>
                      </td>
                      <td>{product.supplier}</td>
                      <td>
                        <small className="text-muted">{product.updatedAt}</small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => onEdit(product)}
                            title="編輯產品"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              if (window.confirm(`確定要刪除產品「${product.name}」嗎？`)) {
                                onDelete(product.id)
                              }
                            }}
                            title="刪除產品"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList

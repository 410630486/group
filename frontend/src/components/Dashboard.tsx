import React from 'react'
import { InventoryStats } from '../types/Product'

interface DashboardProps {
  stats: InventoryStats
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // 格式化金額
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(amount)
  }

  return (
    <div className="d-flex flex-wrap w-100 mb-4" style={{ gap: '0.5rem' }}>
      <div className="flex-fill" style={{ minWidth: '200px' }}>
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-0">總產品數</h6>
                <h2 className="mb-0">{stats.totalProducts}</h2>
              </div>
              <div className="display-6">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-fill" style={{ minWidth: '200px' }}>
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-0">庫存總價值</h6>
                <h2 className="mb-0" style={{ fontSize: '1.5rem' }}>
                  {formatCurrency(stats.totalValue)}
                </h2>
              </div>
              <div className="display-6">
                <i className="bi bi-currency-dollar"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-fill" style={{ minWidth: '200px' }}>
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-0">庫存不足</h6>
                <h2 className="mb-0">{stats.lowStockCount}</h2>
              </div>
              <div className="display-6">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-fill" style={{ minWidth: '200px' }}>
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title mb-0">產品類別</h6>
                <h2 className="mb-0">{stats.categories.length}</h2>
              </div>
              <div className="display-6">
                <i className="bi bi-grid-3x3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

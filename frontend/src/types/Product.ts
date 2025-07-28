export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  minStock: number
  supplier: string
  sku: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  description: string
  category: string
  price: number
  stock: number
  minStock: number
  supplier: string
  sku: string
  status: string
}

export interface InventoryStats {
  totalProducts: number
  totalValue: number
  lowStockCount: number
  categories: string[]
}

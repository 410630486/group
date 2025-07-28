import axios from 'axios'
import { User } from '../types/User'

// 創建 axios 實例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log('發送請求:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('請求錯誤:', error)
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    console.log('收到響應:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('響應錯誤:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

// 用戶相關 API
export const userApi = {
  // 獲取所有用戶
  getAllUsers: () => api.get<User[]>('/users'),
  
  // 根據 ID 獲取用戶
  getUserById: (id: number) => api.get<User>(`/users/${id}`),
  
  // 創建用戶
  createUser: (user: Omit<User, 'id'>) => api.post<User>('/users', user),
  
  // 更新用戶
  updateUser: (id: number, user: Omit<User, 'id'>) => 
    api.put<User>(`/users/${id}`, user),
  
  // 刪除用戶
  deleteUser: (id: number) => api.delete(`/users/${id}`),
}

export default api

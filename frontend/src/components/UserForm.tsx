import { useState, useEffect } from 'react'
import { User } from '../types/User'

interface UserFormProps {
  user?: User | null
  onSubmit: (user: Omit<User, 'id'>) => void
  onCancel: () => void
}

const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // 當用戶數據變化時更新表單
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
      })
    }
    setErrors({})
  }, [user])

  // 表單驗證
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能為空'
    } else if (formData.name.length < 2) {
      newErrors.name = '姓名至少需要2個字符'
    }

    if (!formData.email.trim()) {
      newErrors.email = '郵箱不能為空'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '郵箱格式不正確'
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = '電話號碼不能超過20個字符'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除對應字段的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined
      })
    }
  }

  return (
    <div className="user-form">
      <h2>{user ? '編輯用戶' : '新增用戶'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">姓名 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">郵箱 *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">電話</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {user ? '更新' : '創建'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm

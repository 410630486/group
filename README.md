# 前後端分離專案

這是一個前後端分離的全端應用程式，使用現代化的技術架構。

## 專案結構

```
group/
├── frontend/          # React + TypeScript 前端應用
├── backend/           # Python FastAPI 後端 API
├── docker-compose.yml # MongoDB 資料庫配置
└── README.md
```

## 技術架構

### 前端 (Frontend)
- **框架**: React 18 + TypeScript
- **建構工具**: Vite
- **樣式**: CSS3 + 響應式設計
- **HTTP 客戶端**: Fetch API

### 後端 (Backend)
- **框架**: Python FastAPI
- **資料庫**: MongoDB (Docker)
- **ORM**: Motor (異步 MongoDB 驅動)
- **API 文檔**: Swagger UI (自動生成)

### 資料庫
- **主資料庫**: MongoDB
- **管理介面**: Mongo Express
- **部署方式**: Docker 容器化

## 快速開始

### 1. 啟動資料庫
```bash
docker-compose up -d
```

### 2. 啟動後端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. 啟動前端
```bash
cd frontend
npm install
npm run dev
```

## 開發說明

- **前端開發服務器**: http://localhost:5173
- **後端 API 服務器**: http://localhost:8000
- **API 文檔**: http://localhost:8000/docs
- **MongoDB 管理介面**: http://localhost:8081

## API 端點

- `GET /users` - 獲取所有用戶
- `POST /users` - 創建新用戶
- `GET /users/{id}` - 獲取特定用戶
- `PUT /users/{id}` - 更新用戶
- `DELETE /users/{id}` - 刪除用戶

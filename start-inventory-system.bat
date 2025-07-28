@echo off
echo 正在啟動存貨管理系統...
echo.

echo 1. 啟動 MongoDB 資料庫...
cd /d "%~dp0"
docker-compose up -d
if errorlevel 1 (
    echo MongoDB 啟動失敗，請檢查 Docker 是否正在運行
    pause
    exit /b 1
)
echo MongoDB 已啟動

echo.
echo 2. 啟動後端 API 服務...
cd backend
start "存貨管理系統後端" cmd /k "pip install -r requirements.txt >nul 2>&1 && uvicorn inventory_main:app --reload --port 8000"

echo.
echo 3. 等待後端服務啟動...
timeout /t 5 >nul

echo.
echo 4. 啟動前端開發服務器...
cd ..\frontend
start "存貨管理系統前端" cmd /k "npm install >nul 2>&1 && npm run dev"

echo.
echo ================================
echo 🚀 存貨管理系統已啟動！
echo.
echo 📊 前端界面: http://localhost:5173
echo 🔗 後端 API: http://localhost:8000
echo 📖 API 文檔: http://localhost:8000/docs
echo 🗃️  MongoDB 管理: http://localhost:8081
echo.
echo 💡 提示：首次使用可點擊"生成測試數據"按鈕創建100個產品
echo ================================
echo.
pause

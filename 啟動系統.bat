@echo off
title 存貨管理系統啟動器
color 0A

echo ================================
echo      存貨管理系統啟動中...
echo ================================
echo.

echo [1/4] 檢查 Docker 服務...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安裝或未啟動，請先安裝 Docker Desktop
    pause
    exit /b 1
)
echo ✅ Docker 服務正常

echo.
echo [2/4] 啟動 MongoDB 資料庫...
cd /d "%~dp0"
docker-compose up -d
if errorlevel 1 (
    echo ❌ MongoDB 啟動失敗
    pause
    exit /b 1
)
echo ✅ MongoDB 已啟動

echo.
echo [3/4] 安裝並啟動後端服務...
cd backend
pip install fastapi uvicorn >nul 2>&1
echo ✅ 後端依賴已安裝
start "後端API服務" cmd /k "python simple_api.py"
echo ✅ 後端服務已啟動

echo.
echo [4/4] 啟動前端服務...
cd ..\frontend
start "前端開發服務器" cmd /k "npm run dev"
echo ✅ 前端服務已啟動

echo.
echo ================================
echo      🎉 系統啟動完成！
echo ================================
echo.
echo 📊 前端界面: http://localhost:5173
echo 🔗 後端 API: http://localhost:8000  
echo 📖 API 文檔: http://localhost:8000/docs
echo 🗃️  資料庫管理: http://localhost:8081
echo.
echo 💡 首次使用請點擊"生成測試數據"按鈕
echo    來創建100個產品進行測試
echo.
echo ❗ 請等待 10-15 秒讓所有服務完全啟動
echo.
pause

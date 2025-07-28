# 存貨管理系統啟動腳本
Write-Host "================================" -ForegroundColor Green
Write-Host "     存貨管理系統啟動中..." -ForegroundColor Green  
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 啟動後端服務
Write-Host "[1/2] 啟動後端 API 服務..." -ForegroundColor Yellow
Set-Location "backend"
Start-Process powershell -ArgumentList "-Command", "python simple_api.py" -WindowStyle Normal
Write-Host "✅ 後端服務啟動命令已執行" -ForegroundColor Green

# 等待一下
Start-Sleep -Seconds 3

# 啟動前端服務  
Write-Host "[2/2] 啟動前端開發服務器..." -ForegroundColor Yellow
Set-Location "..\frontend"
Start-Process powershell -ArgumentList "-Command", "npm run dev" -WindowStyle Normal
Write-Host "✅ 前端服務啟動命令已執行" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "      🎉 系統啟動完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 前端界面: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 後端 API: http://localhost:8000" -ForegroundColor Cyan  
Write-Host "📖 API 文檔: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🗃️  資料庫管理: http://localhost:8081" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 首次使用請點擊 '生成測試數據' 按鈕創建100個產品" -ForegroundColor Yellow  
Write-Host ""
Write-Host "❗ 請等待 10-15 秒讓所有服務完全啟動" -ForegroundColor Red
Write-Host ""

# 等待用戶按鍵
Read-Host "Press Enter to continue..."

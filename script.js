// 存貨管理系統 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 頁面導航處理
    initNavigation();
    
    // 初始化模態框
    initModals();
    
    // 初始化工具提示
    initTooltips();
    
    // 初始化搜尋功能
    initSearch();
    
    // 初始化快速操作
    initQuickActions();
});

// 頁面導航初始化
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活躍狀態
            navLinks.forEach(nl => nl.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('d-none'));
            
            // 添加活躍狀態到點擊的連結
            this.classList.add('active');
            
            // 顯示對應的內容區域
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('d-none');
            }
        });
    });
}

// 模態框初始化
function initModals() {
    // 新增商品按鈕事件
    const addProductBtns = document.querySelectorAll('[data-bs-target="#addProductModal"]');
    addProductBtns.forEach(btn => {
        btn.setAttribute('data-bs-toggle', 'modal');
        btn.setAttribute('data-bs-target', '#addProductModal');
    });
    
    // 快速操作 - 新增商品
    const quickAddBtn = document.querySelector('.quick-action-btn:first-child');
    if (quickAddBtn) {
        quickAddBtn.setAttribute('data-bs-toggle', 'modal');
        quickAddBtn.setAttribute('data-bs-target', '#addProductModal');
    }
}

// 工具提示初始化
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// 搜尋功能初始化
function initSearch() {
    const searchInput = document.querySelector('input[placeholder="請輸入商品名稱或代碼"]');
    const searchBtn = document.querySelector('.input-group .btn');
    
    if (searchInput && searchBtn) {
        // 搜尋按鈕點擊事件
        searchBtn.addEventListener('click', performSearch);
        
        // 輸入框 Enter 鍵事件
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 即時搜尋（輸入時）
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                debounce(performSearch, 500)();
            }
        });
    }
}

// 執行搜尋
function performSearch() {
    const searchTerm = document.querySelector('input[placeholder="請輸入商品名稱或代碼"]').value;
    const category = document.querySelector('select').value;
    const status = document.querySelectorAll('select')[1].value;
    
    console.log('搜尋條件:', {
        searchTerm,
        category,
        status
    });
    
    // 這裡可以添加實際的搜尋邏輯
    showSearchResults(searchTerm, category, status);
}

// 顯示搜尋結果
function showSearchResults(searchTerm, category, status) {
    const tbody = document.querySelector('.table tbody');
    
    // 添加載入效果
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <div class="loading me-2"></div>
                搜尋中...
            </td>
        </tr>
    `;
    
    // 模擬 API 呼叫延遲
    setTimeout(() => {
        // 模擬搜尋結果
        const mockResults = generateMockResults(searchTerm, category, status);
        displayResults(mockResults);
    }, 1000);
}

// 生成模擬搜尋結果
function generateMockResults(searchTerm, category, status) {
    const allProducts = [
        {
            code: 'PRD001',
            name: 'iPhone 14 Pro',
            category: '電子產品',
            stock: 125,
            safetyStock: 50,
            price: 36900,
            status: '庫存充足',
            statusClass: 'success'
        },
        {
            code: 'PRD002',
            name: 'MacBook Air M2',
            category: '電子產品',
            stock: 15,
            safetyStock: 20,
            price: 37900,
            status: '庫存不足',
            statusClass: 'warning'
        },
        {
            code: 'PRD003',
            name: 'AirPods Pro',
            category: '電子產品',
            stock: 0,
            safetyStock: 30,
            price: 7490,
            status: '缺貨',
            statusClass: 'danger'
        },
        {
            code: 'PRD004',
            name: 'iPad Pro 12.9"',
            category: '電子產品',
            stock: 45,
            safetyStock: 25,
            price: 35900,
            status: '庫存充足',
            statusClass: 'success'
        },
        {
            code: 'PRD005',
            name: 'Apple Watch Series 8',
            category: '電子產品',
            stock: 8,
            safetyStock: 15,
            price: 12900,
            status: '庫存不足',
            statusClass: 'warning'
        }
    ];
    
    // 根據搜尋條件過濾
    let filteredResults = allProducts;
    
    if (searchTerm && searchTerm.length > 0) {
        filteredResults = filteredResults.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (category && category !== '全部類別') {
        filteredResults = filteredResults.filter(product => product.category === category);
    }
    
    if (status && status !== '全部狀態') {
        filteredResults = filteredResults.filter(product => product.status === status);
    }
    
    return filteredResults;
}

// 顯示搜尋結果
function displayResults(results) {
    const tbody = document.querySelector('.table tbody');
    
    if (results.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="bi bi-search fs-1 d-block mb-2"></i>
                    沒有找到符合條件的商品
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = results.map(product => `
        <tr>
            <td><code>${product.code}</code></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td><span class="badge bg-${product.statusClass}">${product.stock}</span></td>
            <td>${product.safetyStock}</td>
            <td>NT$ ${product.price.toLocaleString()}</td>
            <td><span class="badge bg-${product.statusClass}">${product.status}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="編輯" onclick="editProduct('${product.code}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-success" title="入庫" onclick="stockIn('${product.code}')">
                        <i class="bi bi-arrow-up"></i>
                    </button>
                    <button class="btn btn-outline-warning" title="出庫" onclick="stockOut('${product.code}')" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="bi bi-arrow-down"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 快速操作初始化
function initQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            switch(index) {
                case 0: // 新增商品
                    // 已在 initModals 中處理
                    break;
                case 1: // 入庫作業
                    showStockInModal();
                    break;
                case 2: // 出庫作業
                    showStockOutModal();
                    break;
                case 3: // 庫存報表
                    generateReport();
                    break;
            }
        });
    });
}

// 商品操作函數
function editProduct(productCode) {
    console.log('編輯商品:', productCode);
    showNotification('info', '編輯功能開發中...');
}

function stockIn(productCode) {
    console.log('商品入庫:', productCode);
    const quantity = prompt('請輸入入庫數量:');
    if (quantity && !isNaN(quantity) && quantity > 0) {
        showNotification('success', `商品 ${productCode} 入庫 ${quantity} 件成功！`);
        // 這裡可以調用 API 更新庫存
        updateStock(productCode, parseInt(quantity), 'in');
    }
}

function stockOut(productCode) {
    console.log('商品出庫:', productCode);
    const quantity = prompt('請輸入出庫數量:');
    if (quantity && !isNaN(quantity) && quantity > 0) {
        showNotification('warning', `商品 ${productCode} 出庫 ${quantity} 件成功！`);
        // 這裡可以調用 API 更新庫存
        updateStock(productCode, parseInt(quantity), 'out');
    }
}

// 更新庫存
function updateStock(productCode, quantity, type) {
    // 模擬 API 調用
    console.log(`更新庫存: ${productCode}, 數量: ${quantity}, 類型: ${type}`);
    
    // 這裡可以添加實際的 API 調用邏輯
    // fetch('/api/inventory/update', { ... })
}

// 顯示入庫模態框
function showStockInModal() {
    showNotification('info', '入庫作業功能開發中...');
}

// 顯示出庫模態框
function showStockOutModal() {
    showNotification('info', '出庫作業功能開發中...');
}

// 生成報表
function generateReport() {
    showNotification('info', '正在生成庫存報表...');
    
    // 模擬報表生成延遲
    setTimeout(() => {
        showNotification('success', '庫存報表已成功生成並下載！');
    }, 2000);
}

// 顯示通知
function showNotification(type, message) {
    const alertClass = {
        'success': 'alert-success',
        'warning': 'alert-warning',
        'danger': 'alert-danger',
        'info': 'alert-info'
    };
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass[type]} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 90px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // 自動消失
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 統計數據更新
function updateDashboardStats() {
    // 模擬統計數據更新
    const stats = {
        totalProducts: Math.floor(Math.random() * 1000) + 1000,
        inStock: Math.floor(Math.random() * 800) + 800,
        lowStock: Math.floor(Math.random() * 50) + 20,
        outOfStock: Math.floor(Math.random() * 20) + 5
    };
    
    // 更新統計卡片
    const statCards = document.querySelectorAll('.stat-info h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = stats.totalProducts.toLocaleString();
        statCards[1].textContent = stats.inStock.toLocaleString();
        statCards[2].textContent = stats.lowStock;
        statCards[3].textContent = stats.outOfStock;
    }
}

// 定期更新統計數據
setInterval(updateDashboardStats, 30000);

// 導出功能
function exportData() {
    showNotification('info', '正在準備匯出數據...');
    
    // 模擬匯出延遲
    setTimeout(() => {
        showNotification('success', '數據匯出完成！');
    }, 2000);
}

// 為匯出按鈕添加事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.querySelector('button:contains("匯出")');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
});

// 響應式處理
function handleResize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // 移動端優化
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

window.addEventListener('resize', debounce(handleResize, 250));
handleResize(); // 初始調用

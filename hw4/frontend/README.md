# 辦公咖啡廳清單 - 前端

這是一個使用 React + TypeScript + Vite 建立的地圖導向咖啡廳管理應用程式。

## 功能特色

- ☕ **咖啡廳管理**：瀏覽、新增、編輯、刪除咖啡廳資訊
- 🗺️ **地圖視圖**：地圖與列表雙向互動（階段3會整合 Google Maps）
- 📝 **到訪記錄**：記錄已去過的咖啡廳和評分
- ♥️ **願望清單**：收藏想去的咖啡廳
- 🔐 **使用者認證**：登入後才能進行 CRUD 操作

## 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **路由**: React Router v6
- **樣式**: TailwindCSS
- **HTTP 客戶端**: Axios（階段4會使用）

## 安裝與執行

1. 安裝依賴：
```bash
npm install
```

2. 設定環境變數：
```bash
# 複製 .env.example 並填入實際的 API Keys
cp .env.example .env
```

3. 啟動開發伺服器：
```bash
npm run dev
```

應用程式將在 http://localhost:5173 上運行。

## 專案結構

```
src/
├── pages/              # 頁面組件
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── CafeDetailPage.tsx
│   ├── CafeFormPage.tsx
│   ├── VisitsPage.tsx
│   └── WishlistPage.tsx
├── components/         # 共用組件
│   ├── MapView.tsx
│   └── CafeList.tsx
├── context/           # React Context
│   └── AppContext.tsx
├── types.ts           # TypeScript 型別定義
├── mockData.ts        # 假資料（階段1）
├── App.tsx            # 主應用程式
└── main.tsx           # 應用程式入口
```

## 開發階段

### 階段1 ✅（當前完成）
- 完成前端頁面（使用假資料）
- 頁面可操作、導覽正確
- UI 美觀且響應式

### 階段2 ⏳（待完成）
- 實作後端 + SQLite + Auth
- 密碼雜湊
- RESTful API

### 階段3 ⏳（待完成）
- 串接 Google Maps API
- 地圖顯示與互動
- Geocoding / Places / Directions

### 階段4 ⏳（待完成）
- 前端串接後端（使用 Axios）
- 完整流程可運作
- 登入後可 CRUD

### 階段5 ⏳（待完成）
- 文件撰寫
- 從零可重現

## 環境變數

請參考 `.env.example` 檔案：

- `VITE_GOOGLE_MAPS_JS_KEY`: Google Maps JavaScript API Key（Browser Key）
- `VITE_API_BASE_URL`: 後端 API 位址

## 注意事項

- 目前使用假資料，所有操作只在前端記憶體中進行
- 刷新頁面會重置所有資料
- 地圖視圖為示意圖，階段3會整合真實的 Google Maps

# 辦公咖啡廳共享清單

> 類似 Cafeting ，讓使用者之間可以共享的辦公咖啡廳清單
> 允許使用者各自儲存願望清單與到訪心得

## 📋 專案概述

這是一個完整的全端應用程式，讓使用者可以：

- ☕ **建立/瀏覽/編輯/刪除咖啡廳**（Place CRUD）
- 📝 **記錄「已去過」的到訪**（Visit）
- ♥️ **收藏「想去」清單**（Wishlist）
- 🗺️ **在地圖與列表之間雙向互動**
  - 列表點某間店，地圖定位
  - 點地圖新增店家
  - 搜尋地點並新增咖啡廳

## 🏗️ 技術架構

### 前端（Frontend）
- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **路由**: React Router v6
- **UI 框架**: TailwindCSS
- **HTTP 客戶端**: Axios
- **地圖**: Google Maps JavaScript API
- **狀態管理**: React Context

### 後端（Backend）
- **框架**: Node.js + Express + TypeScript
- **資料庫**: SQLite
- **認證**: JWT Token
- **密碼加密**: bcrypt
- **Google Maps 整合**: Geocoding / Places / Directions API
- **CORS**: 支援跨域請求

## 📂 專案結構

```
hw4/
├── frontend/              # React 前端
│   ├── src/
│   │   ├── pages/        # 頁面組件
│   │   ├── components/   # 共用組件
│   │   ├── context/      # React Context
│   │   ├── services/     # API 服務
│   │   ├── types.ts      # 型別定義
│   │   └── utils/        # 工具函數
│   ├── .env.example      # 環境變數範例
│   └── package.json
├── backend/              # Express 後端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 業務邏輯
│   │   ├── middleware/   # 中介軟體
│   │   ├── database.ts   # 資料庫設定
│   │   └── app.ts        # 應用程式入口
│   ├── .env.example
│   └── package.json
├── GOOGLE_MAPS_SETUP.md  # Google Maps API 設定指南
├── VERIFY_API_KEY.md     # API Key 驗證指南
└── README.md             # 本檔案
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝前端依賴
cd frontend
npm install

# 安裝後端依賴
cd ../backend
npm install
```

### 2. 設定環境變數

**後端**：
```bash
cd backend
cp .env.example .env
# 編輯 .env 檔案，設定必要的環境變數
```

**前端**：
```bash
cd frontend
cp .env.example .env
# 編輯 .env 檔案，設定 Google Maps API Key
```

> **重要**: `.env` 檔案包含敏感資訊，不得上傳到版本控制系統。專案已提供 `.env.example` 範例檔案供參考。

### 3. 設定 Google Maps API

請參考 [GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md) 詳細設定指南。

**必要設定**：
- 建立 Google Cloud 專案
- 啟用 Maps JavaScript API、Geocoding API、Places API
- 建立 Browser Key（前端）和 Server Key（後端）
- 設定適當的 API 限制

### 4. 啟動應用

**終端機 1 - 啟動後端**：
```bash
cd backend
npm run dev
# 後端運行在 http://localhost:3000
```

**終端機 2 - 啟動前端**：
```bash
cd frontend
npm run dev
# 前端運行在 http://localhost:5173
```

### 5. 開始使用

1. 開啟瀏覽器訪問 http://localhost:5173
2. 註冊新帳號或使用測試帳號：
   - Email: `test@example.com`
   - 密碼: `password123`
3. 開始使用辦公咖啡廳清單！

## 🔐 認證與安全性

### 認證機制
本專案使用 **JWT (JSON Web Token)** 進行使用者認證。

**JWT 認證流程**：
1. 使用者登入時，後端驗證 email/password
2. 驗證成功後，後端產生 JWT Token（包含 userId、email 等資訊）
3. 前端將 Token 儲存在 localStorage 中
4. 每次 API 請求時，在 Authorization header 中攜帶 `Bearer <token>`
5. 後端驗證 Token 有效性和過期時間
6. Token 預設有效期為 7 天

**安全性特點**：
- ✅ **帳號欄位**: email + password
- ✅ **密碼雜湊**: bcrypt（10 rounds）
- ✅ **認證機制**: JWT Token（7天有效期）
- ✅ **CORS 設定**: 允許 localhost:5173 和 127.0.0.1:5173
- ✅ **輸入驗證**: 所有欄位（前端+後端雙重驗證）
- ✅ **權限控管**: 使用者只能修改/刪除自己的資料
- ✅ **Token 管理**: localStorage + Axios 攔截器
- ✅ **自動登出**: 401 錯誤時自動清除認證狀態

## 🗺️ Google Maps 功能

### 已實作功能
- ✅ **地圖顯示**: Google Maps JavaScript API
- ✅ **咖啡廳標記**: 根據地址自動定位
- ✅ **雙向互動**: 列表與地圖同步
- ✅ **搜尋功能**: Places API 自動完成
- ✅ **地圖點擊**: 新增咖啡廳
- ✅ **視覺效果**: 自定義圖標（愛心/星星）
- ✅ **懸停效果**: 地圖標記動畫

### 地圖標記說明
- ❤️ **紅色愛心**: 願望清單中的咖啡廳
- ⭐ **橘色星星**: 一般咖啡廳

## 📝 功能特色

### 核心功能
- ✅ **咖啡廳管理**: 完整的 CRUD 操作
- ✅ **到訪記錄**: 記錄造訪時間和評分
- ✅ **願望清單**: 收藏想去的咖啡廳
- ✅ **搜尋篩選**: 依名稱、地址、設施篩選
- ✅ **地圖整合**: 視覺化位置和互動
- ✅ **響應式設計**: 支援各種螢幕尺寸

### 設施與環境標記
- 📶 WiFi
- 🔌 電源插座
- ⏰ 無限時
- 🔇 安靜
- 💡 光線佳
- 💺 有座位

## 🧪 測試

### API 測試
使用測試帳號登入後，可以測試以下功能：

1. **咖啡廳管理**
   - 新增咖啡廳
   - 編輯咖啡廳資訊
   - 刪除咖啡廳
   - 瀏覽咖啡廳列表

2. **地圖功能**
   - 地圖載入和顯示
   - 咖啡廳標記定位
   - 搜尋地點
   - 點擊地圖新增咖啡廳

3. **使用者功能**
   - 記錄到訪
   - 管理願望清單
   - 搜尋和篩選

### 測試帳號
- **Email**: `test@example.com`
- **密碼**: `password123`

## 🔧 開發說明

### 資料庫 Schema
- **users**: 使用者資訊
- **cafes**: 咖啡廳資料
- **visits**: 到訪記錄
- **wishlist**: 願望清單

### API 端點
- **認證**: `/auth/register`, `/auth/login`, `/auth/me`
- **咖啡廳**: `/api/cafes/*` (公開操作)
- **到訪記錄**: `/api/visits/*` (需認證)
- **願望清單**: `/api/wishlist/*` (需認證)
- **地圖服務**: `/api/maps/*` (Google Maps API 代理)

### 環境變數
**後端 (.env.example)**:
```bash
# 伺服器設定
PORT=3000

# CORS 設定
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# 資料庫設定
DATABASE_URL=file:./dev.db

# JWT 認證設定
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google Maps API 設定
GOOGLE_MAPS_SERVER_KEY=your_google_maps_server_key_here
```

**前端 (.env.example)**:
```bash
# 後端 API 位址
VITE_API_BASE_URL=http://localhost:3000

# Google Maps JavaScript API Key (Browser Key)
VITE_GOOGLE_MAPS_JS_KEY=your_google_maps_browser_key_here
```

> **注意**: 請複製 `.env.example` 為 `.env` 並填入實際值。`.env` 檔案不得上傳到版本控制系統。

## 📄 授權

本專案為 Web Programming 課程作業。
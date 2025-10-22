# 辦公咖啡廳清單 - 地圖導向應用

> 一個類似 Cafeting 的咖啡廳地圖管理應用，採用前後端分離架構（React + Node/Express）

## 📋 專案概述

這是一個完整的全端應用程式，讓使用者可以：

- ☕ **建立/瀏覽/編輯/刪除咖啡廳**（Place CRUD）
- 📝 **記錄「已去過」的到訪**（Visit）
- ♥️ **收藏「想去」清單**（Wishlist）
- 🗺️ **在地圖與列表之間雙向互動**
  - 列表點某間店，地圖定位
  - 點地圖新增店家

## 🏗️ 技術架構

### 前端（Frontend）
- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **路由**: React Router v6
- **UI 框架**: TailwindCSS
- **HTTP 客戶端**: Axios
- **地圖**: Google Maps JavaScript API

### 後端（Backend）- 待實作
- **框架**: Node.js + Express + TypeScript
- **資料庫**: SQLite
- **認證**: JWT / Session + Cookie
- **密碼加密**: bcrypt
- **Google Maps 整合**: Geocoding / Places / Directions API

## 📂 專案結構

```
hw4/
├── frontend/              # React 前端
│   ├── src/
│   │   ├── pages/        # 頁面組件
│   │   ├── components/   # 共用組件
│   │   ├── context/      # React Context
│   │   ├── types.ts      # 型別定義
│   │   └── mockData.ts   # 假資料（階段1）
│   ├── .env.example      # 環境變數範例
│   └── README.md
├── backend/              # Express 後端（待建立）
│   ├── src/
│   ├── .env.example
│   └── README.md
└── README.md             # 本檔案
```

## 🚀 開發階段

### ✅ 階段 1：完成前端頁面（先用假資料）
**目標**: 前端可操作、頁面導覽正確

已完成功能：
- ✅ 使用者登入/註冊頁面（假登入）
- ✅ 主頁面（地圖 + 列表雙視圖）
- ✅ 咖啡廳詳情頁面
- ✅ 新增/編輯咖啡廳表單
- ✅ 我的到訪記錄頁面
- ✅ 願望清單頁面
- ✅ 受保護路由（需登入）
- ✅ 搜尋和篩選功能
- ✅ 假資料 CRUD 操作
- ✅ .env.example 檔案

**驗收方式**: 前端可操作、頁面導覽正確 ✅

---

### ✅ 階段 2：實作後端 + SQLite + Auth（含密碼雜湊）
**目標**: 以 `curl` 或 `.http` 測試 API

已完成：
- ✅ Express + TypeScript 專案設定
- ✅ SQLite 資料庫設計（4個資料表）
- ✅ 使用者認證（註冊/登入/登出）
- ✅ 密碼雜湊（bcrypt, 10 rounds）
- ✅ JWT Token 機制（7天有效期）
- ✅ RESTful API（19個端點）：
  - `/auth/*` - 認證相關（3個）
  - `/api/cafes/*` - 咖啡廳 CRUD（5個）
  - `/api/visits/*` - 到訪記錄（5個）
  - `/api/wishlist/*` - 願望清單（6個）
- ✅ 完整的輸入驗證
- ✅ 統一的錯誤處理
- ✅ CORS 設定

**驗收方式**: 以 `curl` 或 `.http` 測試 API ✅ 已測試通過

---

### ⏳ 階段 3：串接 Google APIs
**目標**: 驗回傳結果（記錄範例與說明）

待實作：
- [ ] Google Maps JavaScript API（前端地圖顯示）
- [ ] Geocoding API（地址 ↔ 座標轉換）
- [ ] Places API（地點搜尋與詳情）
- [ ] Directions API（路線規劃，可選）
- [ ] 地圖標記與互動
- [ ] 點擊地圖新增咖啡廳

**驗收方式**: 驗回傳結果（記錄範例與說明）

---

### ✅ 階段 4：前端串接後端（Axios）
**目標**: 完整流程可運作（登入後可 CRUD）

已完成：
- ✅ 建立 API 服務層（5個服務檔案）
- ✅ 使用 Axios 進行 HTTP 請求
- ✅ 實作認證流程（Token 管理）
- ✅ Token 自動儲存到 localStorage
- ✅ 請求/回應攔截器
- ✅ 錯誤處理與使用者回饋
- ✅ 載入狀態處理
- ✅ 完整的 CRUD 操作
- ✅ 資料持久化
- ✅ 權限控管

**驗收方式**: 完整流程可運作（登入後可 CRUD）✅ 已完成

---

### ⏳ 階段 5：文件撰寫（README + .env.example）
**目標**: 從零可重現

待實作：
- [ ] 完整的 README 文件
- [ ] API 文件
- [ ] 資料庫 Schema 說明
- [ ] 環境變數說明
- [ ] 安裝與部署指南
- [ ] 測試範例

**驗收方式**: 從零可重現

---

## 💻 快速開始

### 完整應用啟動（階段4）

#### 1. 安裝依賴

```bash
# 安裝前端依賴
cd frontend
npm install

# 安裝後端依賴
cd ../backend
npm install
```

#### 2. 設定環境變數

**後端**：
```bash
cd backend
cp .env.example .env
# 編輯 .env 檔案，設定 JWT_SECRET
```

**前端**：
```bash
cd frontend
cp .env.example .env
# 編輯 .env 檔案，VITE_API_BASE_URL 已預設為 http://localhost:3000
```

#### 3. 啟動應用

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

#### 4. 開始使用

1. 開啟瀏覽器訪問 http://localhost:5173
2. 註冊新帳號
3. 開始使用辦公咖啡廳清單！

## 🔐 認證與安全性要求

- ✅ 帳號欄位：email + password
- ✅ 密碼雜湊：bcrypt（10 rounds）
- ✅ 認證機制：JWT Token（7天有效期）
- ✅ .env.example：前後端都已建立
- ✅ CORS 設定：允許 localhost:5173 和 127.0.0.1:5173
- ✅ 輸入驗證：所有欄位（前端+後端雙重驗證）
- ✅ 權限控管：使用者只能修改/刪除自己的資料
- ✅ Token 自動管理：localStorage + Axios 攔截器
- ✅ 401 錯誤自動登出

## 🗺️ Google Maps API 設定

### 前端 Key（Browser Key）
- **限制類型**: HTTP 網域
- **允許清單**: 
  - `http://localhost:5173/*`
  - `http://127.0.0.1:5173/*`
- **啟用 API**: Maps JavaScript API

### 後端 Key（Server Key）
- **限制類型**: IP 位址（開發階段暫無限制，需在 README 標註安全風險）
- **啟用 API**: 
  - Geocoding API
  - Places API
  - Directions API

## 📝 功能特色

### 已實作（階段1-4）
- ✅ 使用者介面完整
- ✅ 頁面路由與導覽
- ✅ 咖啡廳列表與搜尋
- ✅ 咖啡廳 CRUD 表單
- ✅ 到訪記錄管理
- ✅ 願望清單功能
- ✅ 響應式設計
- ✅ 美觀的 UI（TailwindCSS）
- ✅ **真實的使用者認證（JWT）**
- ✅ **資料庫持久化（SQLite）**
- ✅ **前後端整合（Axios）**
- ✅ **權限控管**
- ✅ **錯誤處理**

### 待實作（階段3）
- ⏳ Google Maps 整合
- ⏳ 地圖標記與互動
- ⏳ 地址自動完成（Places API）
- ⏳ 地址轉座標（Geocoding API）
- ⏳ 路線規劃（Directions API，可選）

## 📸 截圖

（階段1完成後可補充）

## 🧪 測試

### 前端測試（階段1）
1. 訪問 http://localhost:5173
2. 使用任意 email/密碼註冊或登入
3. 測試以下功能：
   - 瀏覽咖啡廳列表
   - 搜尋和篩選咖啡廳
   - 查看咖啡廳詳情
   - 新增咖啡廳
   - 編輯咖啡廳
   - 刪除咖啡廳
   - 記錄到訪
   - 加入/移除願望清單
   - 切換地圖/列表視圖

## 👥 作者

Hannah

## 📄 授權

本專案為 Web Programming 課程作業。


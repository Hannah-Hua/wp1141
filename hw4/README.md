# 辦公咖啡廳清單 🍵

一個基於地圖的咖啡廳管理應用，採用前後端分離架構，整合 Google Maps API 提供完整的地圖導向功能。

## 🚀 功能特色

- **地圖導向介面**：直觀的地圖與列表雙向互動
- **咖啡廳管理**：新增、編輯、刪除咖啡廳資訊
- **個人記錄**：記錄到訪歷史與願望清單
- **智能搜尋**：Google Places API 自動完成搜尋
- **環境標記**：記錄時間限制、噪音、光線、座位等環境資訊
- **用戶認證**：JWT 認證系統，保護個人資料

## 🛠 技術棧

### 前端
- **React 18** + **TypeScript**
- **Vite** 建置工具
- **TailwindCSS** UI 框架
- **React Router** 路由管理
- **Axios** HTTP 客戶端
- **Google Maps JavaScript API**

### 後端
- **Node.js** + **Express**
- **TypeScript** 開發
- **SQLite** 資料庫
- **JWT** 認證
- **bcrypt** 密碼加密
- **Google Maps APIs** (Geocoding/Places/Directions)

## 📋 環境需求

- Node.js 18+
- npm 或 yarn
- Google Cloud Platform 帳號

## 🔑 Google Maps API 設定

### 必要 API 服務
請在 Google Cloud Console 中啟用以下 API：

1. **Maps JavaScript API** → 建立 Browser Key
2. **Geocoding API** → 使用 Server Key
3. **Places API** → 使用 Server Key  
4. **Directions API** → 使用 Server Key

### API Key 限制設定

**Browser Key (前端)**
- 限制類型：HTTP 網域
- 允許清單：`http://localhost:5173/*`, `http://127.0.0.1:5173/*`

**Server Key (後端)**
- 限制類型：IP 位址 (開發階段可設為無限制)
- 啟用服務：Geocoding API, Places API, Directions API

## ⚙️ 安裝與設定

### 1. 複製專案
```bash
git clone <repository-url>
cd hw4
```

### 2. 設定環境變數

**⚠️ 重要：請替換為您自己的 API Key**

#### 前端設定 (`frontend/.env`)
```bash
# 複製範例檔案
cp frontend/.env.example frontend/.env

# 編輯 .env 檔案，替換 YOUR_BROWSER_KEY
VITE_GOOGLE_MAPS_JS_KEY=YOUR_BROWSER_KEY
VITE_API_BASE_URL=http://localhost:3000
```

#### 後端設定 (`backend/.env`)
```bash
# 複製範例檔案
cp backend/.env.example backend/.env

# 編輯 .env 檔案，替換 YOUR_SERVER_KEY
GOOGLE_MAPS_SERVER_KEY=YOUR_SERVER_KEY
PORT=3000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=file:./dev.db
```

### 3. 安裝依賴
```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

### 4. 啟動應用

**終端機 1 - 後端服務**
```bash
cd backend
npm run dev
```

**終端機 2 - 前端服務**
```bash
cd frontend
npm run dev
```

### 5. 訪問應用
- 前端：http://localhost:5173
- 後端 API：http://localhost:3000

## 📖 API 文件

### 認證端點
- `POST /auth/register` - 用戶註冊
- `POST /auth/login` - 用戶登入
- `GET /auth/me` - 獲取當前用戶資訊

### 咖啡廳端點
- `GET /api/cafes` - 獲取咖啡廳列表
- `GET /api/cafes/:id` - 獲取單一咖啡廳
- `POST /api/cafes` - 新增咖啡廳 (公開)
- `PUT /api/cafes/:id` - 更新咖啡廳 (公開)
- `DELETE /api/cafes/:id` - 刪除咖啡廳 (公開)

### 個人記錄端點 (需認證)
- `GET /api/visits` - 獲取到訪記錄
- `POST /api/visits` - 新增到訪記錄
- `PUT /api/visits/:id` - 更新到訪記錄
- `DELETE /api/visits/:id` - 刪除到訪記錄

### 願望清單端點 (需認證)
- `GET /api/wishlist` - 獲取願望清單
- `POST /api/wishlist` - 新增到願望清單
- `DELETE /api/wishlist/:id` - 從願望清單移除

### Google Maps 端點
- `GET /api/maps/geocode` - 地址轉座標
- `GET /api/maps/reverse-geocode` - 座標轉地址
- `GET /api/maps/nearby` - 附近地點搜尋
- `GET /api/maps/search` - 地點搜尋
- `GET /api/maps/place/:placeId` - 地點詳細資訊
- `GET /api/maps/directions` - 路線規劃

## 🔐 認證機制

本專案使用 **JWT (JSON Web Token)** 進行用戶認證：

1. **註冊/登入**：用戶提供 email 和密碼
2. **密碼加密**：使用 bcrypt 雜湊儲存
3. **Token 生成**：登入成功後生成 JWT token
4. **自動附加**：前端自動在請求標頭附加 token
5. **權限驗證**：後端驗證 token 有效性

### 權限設計
- **公開功能**：咖啡廳的 CRUD 操作
- **個人功能**：到訪記錄、願望清單 (需登入)

## 🗄 資料庫結構

### 用戶表 (users)
- id, username, email, password_hash, created_at

### 咖啡廳表 (cafes)
- id, name, description, address, rating, price_level
- has_wifi, has_power_outlets, has_time_limit, is_noisy
- has_good_lighting, has_available_seats
- created_by, created_at, updated_at

### 到訪記錄表 (visits)
- id, cafe_id, user_id, visit_date, notes, rating, created_at

### 願望清單表 (wishlist)
- id, cafe_id, user_id, notes, created_at

## 🎯 使用說明

### 基本操作
1. **註冊/登入**：建立帳號或使用測試帳號 (`test@example.com` / `password123`)
2. **瀏覽咖啡廳**：在地圖上查看所有咖啡廳位置
3. **新增咖啡廳**：點擊地圖或使用搜尋功能新增
4. **記錄到訪**：標記已去過的咖啡廳
5. **管理願望清單**：收藏想去的咖啡廳

### 地圖功能
- **雙向互動**：點擊列表項目聚焦地圖，點擊地圖標記查看詳情
- **智能搜尋**：輸入地點名稱自動完成搜尋
- **視覺標記**：愛心圖標表示願望清單，星星圖標表示一般咖啡廳
- **懸停效果**：滑鼠懸停時標記會放大

## 🧪 測試帳號

```
Email: test@example.com
Password: password123
```

## 📝 開發注意事項

### 環境變數安全
- `.env` 檔案包含敏感資訊，請勿提交到版本控制
- 使用 `.env.example` 作為範本
- 生產環境請設定適當的 API Key 限制

### API Key 管理
- Browser Key 用於前端地圖顯示
- Server Key 用於後端地理編碼和地點搜尋
- 開發階段可設定較寬鬆的限制，生產環境請嚴格限制

### 資料庫
- 使用 SQLite 檔案資料庫 (`dev.db`)
- 每次重啟後端會自動重置測試資料
- 生產環境建議使用 PostgreSQL 或 MySQL

## 🚨 故障排除

### 常見問題

**1. 地圖無法載入**
- 檢查 `VITE_GOOGLE_MAPS_JS_KEY` 是否正確設定
- 確認 Browser Key 的限制設定包含 `http://localhost:5173/*`

**2. 搜尋功能失效**
- 檢查 `GOOGLE_MAPS_SERVER_KEY` 是否正確設定
- 確認 Server Key 已啟用 Places API

**3. 認證失敗**
- 檢查 JWT token 是否過期
- 確認後端認證中間件正常運作

**4. 資料庫錯誤**
- 刪除 `backend/dev.db` 重新建立
- 檢查 SQLite 檔案權限

## 📄 授權

本專案僅供學習用途，請勿用於商業用途。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案。

---

**⚠️ 評分者注意**：請將 `YOUR_BROWSER_KEY` 和 `YOUR_SERVER_KEY` 替換為您自己的 Google Maps API Key 後再啟動應用，否則地圖功能將無法正常運作。
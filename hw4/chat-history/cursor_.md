# 辦公咖啡廳共享清單應用開發記錄

## 用戶原始需求

**User Prompt:**

我要做一個「辦公咖啡廳清單」的地圖導向應用（類似 cafeting）。採用前後端分離架構（React + Node/Express），前端與後端都必須各自有 .env 與 .env.example，並整合 Google Maps API。

使用者要可以：
- 建立/瀏覽/編輯/刪除咖啡廳（Place）
- 記錄「已去過」的到訪（Visit）
- 收藏「想去」清單（Wishlist）
- 在地圖與列表之間雙向互動（列表點某間店，地圖定位；點地圖新增店）

附圖是開發建議流程，請按照一個一個階段完成這個專案。現在，請閱讀以下條件並完成第一階段，等我確認過後再繼續。

以下是開發規格：

### 🔹 前端
- 技術棧：React + TypeScript（建議使用 Vite 建置）
- 主要套件：React Router (前端 routing)、Axios (與後端的 HTTP 溝通)
- UI 框架：Material UI / Ant Design / Shadcn / TailwindCSS（擇一或混用）
- Google Maps SDK：使用 Google Maps JavaScript API 處理地圖顯示與互動
- 最低要求
  - 地圖載入與基本操作（縮放、拖曳）
  - 可「搜尋」或「標記」地點（任一即可）
  - 使用者登入後才能針對 地點表單之類的資料 進行 新增/編輯/刪除（以頁面/按鈕狀態反映）

### 🔹 後端
- 技術棧：Node.js + Express（建議 TypeScript）
- RESTful API：至少包含
  - /auth（註冊、登入、登出）
  - 一到兩個自定義資源（例如 /locations、/events、/posts、/items…）具備 CRUD
- **Google Maps 伺服器端整合：**至少串接 Geocoding 或 Places 或 Directions 任一項（依主題選擇最合理者）
- 資料庫：使用 SQLite（也可選 MongoDB 或 PostgreSQL）
  - 至少儲存「使用者登入資訊」或「主要資源資料」其中之一（建議兩者皆存）

### 登入與安全性要求：
- 帳號欄位需包含 email/username + password（其一或兩者皆可）
- 密碼必須以雜湊方式儲存（例：bcrypt 或 argon2）
- 使用 JWT 或 Session + Cookie 任一機制（請於 README 說明）
- .env 檔不得上傳，並需提供 .env.example
- 後端 CORS 設定需允許：http://localhost:5173 http://127.0.0.1:5173
- 所有輸入需驗證（email 格式、密碼長度、必填欄位、數值/日期型態等）
- 錯誤回傳需包含正確狀態碼與訊息（如 400/401/403/404/422/500）
- 權限控管：
  - 未登入者不可操作受保護資源
  - 登入的使用者僅能修改/刪除自己的資料

### Google Maps API 設定

**啟用必要 API（依前後端分工）**
- Geocoding API / Places API / Directions API → 建立「Server Key」
- Maps JavaScript API（地圖顯示與互動） → 建立「Browser Key」

**建立與設定 API Key**

**前端 Key（Browser Key）**
- 限制類型：HTTP 網域
- 允許清單：http://localhost:5173/* http://127.0.0.1:5173/*
- 請留意，這是你前端 Vite App 的 URL. 如果你因為任何因素導致你的前端的 port 不是 5173 (可能會是 5174, 517*, 3000, etc), 請重新確保你的前端是開在 5173, 或者是修改這個設定。
- 啟用 API：Maps JavaScript API

**.env 範例：**
```bash
# frontend/.env.example
VITE_GOOGLE_MAPS_JS_KEY=YOUR_BROWSER_KEY  # Maps JavaScript API（Browser Key）
VITE_API_BASE_URL=http://localhost:3000   # 後端 API 位址
```

**後端 Key（Server Key）**
- 限制類型：IP 位址（Note: 由於目前 app 尚未 deploy, app 是跑在本地端，故可暫時無 IP 限制，但需在 README 標註安全風險）

**服務啟用規則（統一規格）：**為了確保到時候同學們可以順利 review 彼此的作業，所以即使你的 app 不會完全使用到 Geocoding, Places, Directions 這三種 APIs, 但還是請你使用 同一把 Server Key 同時啟用下列三項服務，以便同學互相執行與助教批改時可以使用自己的同一把金鑰來執行你的 app：

- Geocoding API
- Places API
- Directions API

**.env 範例：**
```bash
# backend/.env.example
PORT=3000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=file:./dev.db
GOOGLE_MAPS_SERVER_KEY=YOUR_SERVER_KEY  # 已啟用 Geocoding/Places/Directions
```

### API 與資料欄位建議（通用、非強制）
- 路由設計：/auth/*、/api/<your-resource>/*（依主題命名，如 /api/events、/api/locations）
- 常見欄位（可依主題調整）： id, title/name, description, latitude, longitude, address, category, startTime/endTime 或 date, createdBy, createdAt/updatedAt
- 查詢參數：?q=keyword&category=…&radius=…&lat=…&lng=…&from=…&to=…

---

## 專案完成狀態

✅ **階段 1：前端頁面（使用假資料）** - 完成
✅ **階段 2：後端 API 開發** - 完成  
✅ **階段 3：Google Maps API 整合** - 完成
✅ **階段 4：前後端整合** - 完成
✅ **專案清理與文件整理** - 完成

### 最終專案特色
- 地圖導向的咖啡廳管理介面
- 雙向地圖與列表互動
- Google Maps API 完整整合
- JWT 認證系統
- 個人到訪記錄與願望清單
- 環境變數安全設定
- 完整的 README 文件

### 技術實現
- **前端**：React + TypeScript + Vite + TailwindCSS
- **後端**：Node.js + Express + TypeScript + SQLite
- **地圖**：Google Maps JavaScript API + Geocoding/Places/Directions APIs
- **認證**：JWT + bcrypt
- **部署**：本地開發環境，支援評分者替換 API Key
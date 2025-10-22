# 辦公咖啡廳清單 - 後端 API

這是一個使用 Express + TypeScript + SQLite 建立的 RESTful API，提供咖啡廳管理、使用者認證、到訪記錄和願望清單功能。

## 技術棧

- **框架**: Express.js
- **語言**: TypeScript
- **資料庫**: SQLite (better-sqlite3)
- **認證**: JWT (JSON Web Token)
- **密碼加密**: bcrypt
- **開發工具**: tsx, nodemon

## 功能特色

### ✅ 使用者認證
- 註冊（密碼雜湊）
- 登入（JWT Token）
- 取得使用者資訊

### ✅ 咖啡廳管理
- 瀏覽所有咖啡廳（公開）
- 搜尋和篩選
- 新增咖啡廳（需認證）
- 更新咖啡廳（需認證，僅建立者）
- 刪除咖啡廳（需認證，僅建立者）

### ✅ 到訪記錄
- 查看我的到訪記錄
- 新增到訪記錄
- 更新到訪記錄
- 刪除到訪記錄

### ✅ 願望清單
- 查看我的願望清單
- 加入願望清單
- 移除願望清單
- 檢查咖啡廳是否在願望清單中

## 安裝與執行

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並填入實際值：

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=./dev.db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_SERVER_KEY=YOUR_SERVER_KEY
```

⚠️ **重要**：請務必修改 `JWT_SECRET` 為你自己的密鑰！

### 3. 啟動開發伺服器

```bash
npm run dev
```

伺服器將在 http://localhost:3000 上運行。

### 4. 建置生產版本

```bash
npm run build
npm start
```

## API 端點

### 認證 API

#### 註冊
```http
POST /auth/register
Content-Type: application/json

{
  "username": "使用者名稱",
  "email": "user@example.com",
  "password": "password123"
}
```

**回應**：
```json
{
  "message": "註冊成功",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "使用者名稱",
    "email": "user@example.com",
    "createdAt": "2025-10-22T..."
  }
}
```

#### 登入
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**回應**：
```json
{
  "message": "登入成功",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### 取得當前使用者
```http
GET /auth/me
Authorization: Bearer {token}
```

### 咖啡廳 API

#### 取得所有咖啡廳
```http
GET /api/cafes?q=搜尋關鍵字&category=類別
```

#### 取得單一咖啡廳
```http
GET /api/cafes/:id
```

#### 新增咖啡廳（需認證）
```http
POST /api/cafes
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "咖啡廳名稱",
  "description": "描述",
  "address": "地址",
  "category": "辦公友善",
  "rating": 4.5,
  "priceLevel": 2,
  "hasWifi": true,
  "hasPowerOutlets": true,
  "hasTimeLimit": false,
  "isNoisy": false,
  "hasGoodLighting": true,
  "hasAvailableSeats": true
}
```

#### 更新咖啡廳（需認證，僅建立者）
```http
PUT /api/cafes/:id
Authorization: Bearer {token}
Content-Type: application/json

{ 
  "name": "更新後的名稱",
  "rating": 5.0
}
```

#### 刪除咖啡廳（需認證，僅建立者）
```http
DELETE /api/cafes/:id
Authorization: Bearer {token}
```

### 到訪記錄 API（全部需認證）

#### 取得我的到訪記錄
```http
GET /api/visits
Authorization: Bearer {token}
```

#### 新增到訪記錄
```http
POST /api/visits
Authorization: Bearer {token}
Content-Type: application/json

{
  "cafeId": 1,
  "visitDate": "2025-10-22",
  "notes": "備註",
  "rating": 5
}
```

#### 更新到訪記錄
```http
PUT /api/visits/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "更新後的備註",
  "rating": 4
}
```

#### 刪除到訪記錄
```http
DELETE /api/visits/:id
Authorization: Bearer {token}
```

### 願望清單 API（全部需認證）

#### 取得我的願望清單
```http
GET /api/wishlist
Authorization: Bearer {token}
```

#### 檢查咖啡廳是否在願望清單
```http
GET /api/wishlist/check/:cafeId
Authorization: Bearer {token}
```

#### 加入願望清單
```http
POST /api/wishlist
Authorization: Bearer {token}
Content-Type: application/json

{
  "cafeId": 1,
  "notes": "想去的原因"
}
```

#### 從願望清單移除
```http
DELETE /api/wishlist/:id
Authorization: Bearer {token}
```

或使用咖啡廳 ID：
```http
DELETE /api/wishlist/cafe/:cafeId
Authorization: Bearer {token}
```

## 資料庫 Schema

### users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,  -- bcrypt 雜湊後的密碼
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
)
```

### cafes 表
```sql
CREATE TABLE cafes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  rating REAL,
  priceLevel INTEGER,
  hasWifi INTEGER NOT NULL DEFAULT 1,
  hasPowerOutlets INTEGER NOT NULL DEFAULT 1,
  hasTimeLimit INTEGER NOT NULL DEFAULT 0,
  isNoisy INTEGER NOT NULL DEFAULT 0,
  hasGoodLighting INTEGER NOT NULL DEFAULT 1,
  hasAvailableSeats INTEGER NOT NULL DEFAULT 1,
  createdBy INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
)
```

### visits 表
```sql
CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cafeId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  visitDate TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)
```

### wishlist 表
```sql
CREATE TABLE wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cafeId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(cafeId, userId)
)
```

## 測試 API

### 使用 VS Code REST Client

1. 安裝 [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 擴充套件
2. 開啟 `test-api.http` 檔案
3. 點擊每個請求上方的 "Send Request" 按鈕

### 使用 curl

#### 註冊
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"測試","email":"test@example.com","password":"password123"}'
```

#### 登入
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 取得咖啡廳列表
```bash
curl http://localhost:3000/api/cafes
```

#### 新增咖啡廳（需要 Token）
```bash
curl -X POST http://localhost:3000/api/cafes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"測試咖啡廳","description":"很棒的地方","address":"台北市信義區","category":"辦公友善","hasWifi":true,"hasPowerOutlets":true,"hasTimeLimit":false,"isNoisy":false,"hasGoodLighting":true,"hasAvailableSeats":true}'
```

## 錯誤處理

API 使用標準 HTTP 狀態碼：

- `200 OK` - 請求成功
- `201 Created` - 資源建立成功
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 未認證
- `403 Forbidden` - 無權限
- `404 Not Found` - 資源不存在
- `409 Conflict` - 資源衝突（如 Email 已存在）
- `422 Unprocessable Entity` - 驗證失敗
- `500 Internal Server Error` - 伺服器錯誤

錯誤回應格式：
```json
{
  "error": "錯誤訊息"
}
```

## 安全性

### 密碼加密
- 使用 `bcrypt` 進行密碼雜湊
- Salt rounds: 10

### JWT 認證
- Token 有效期：7 天（可在 `.env` 調整）
- Token 格式：`Bearer {token}`

### 權限控管
- 未登入者無法新增/修改/刪除資料
- 使用者僅能修改/刪除自己建立的咖啡廳
- 使用者僅能管理自己的到訪記錄和願望清單

### CORS 設定
- 僅允許指定來源訪問（預設：localhost:5173）
- 可在 `.env` 中設定 `CORS_ORIGINS`

## 專案結構

```
backend/
├── src/
│   ├── routes/          # API 路由
│   │   ├── auth.ts      # 認證路由
│   │   ├── cafes.ts     # 咖啡廳路由
│   │   ├── visits.ts    # 到訪記錄路由
│   │   └── wishlist.ts  # 願望清單路由
│   ├── middleware/      # 中間件
│   │   └── auth.ts      # JWT 認證中間件
│   ├── types.ts         # TypeScript 型別定義
│   ├── database.ts      # 資料庫初始化
│   └── app.ts           # 應用程式入口
├── test-api.http        # API 測試檔案
├── .env.example         # 環境變數範例
├── tsconfig.json        # TypeScript 設定
└── package.json         # 專案設定
```

## 注意事項

1. **資料庫檔案**：`dev.db` 會在第一次啟動時自動建立
2. **環境變數**：請勿將 `.env` 檔案提交到版本控制
3. **JWT Secret**：生產環境請務必使用強密鑰
4. **Google Maps Key**：開發階段無 IP 限制，部署時需設定

## Google Maps API（階段3會使用）

後端 API Key 設定：
- **限制類型**：IP 位址（開發階段暫無限制）
- **啟用服務**：
  - Geocoding API
  - Places API
  - Directions API

⚠️ **安全警告**：開發階段無 IP 限制，請勿將此 Key 用於生產環境！

## 授權

本專案為 Web Programming 課程作業。


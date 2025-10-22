# 階段2 進度報告

## 完成時間
2025-10-22

## 完成狀態
✅ **階段2：實作後端 + SQLite + Auth（含密碼雜湊）** - 基本完成

## 已完成項目

### ✅ 1. 專案初始化與設定
- Express + TypeScript 專案建立
- TypeScript 設定 (tsconfig.json)
- npm scripts 設定（dev, build, start）
- .gitignore 設定

### ✅ 2. 依賴套件安裝
**核心套件**：
- `express` - Web 框架
- `cors` - CORS 支援
- `dotenv` - 環境變數
- `bcrypt` - 密碼雜湊
- `jsonwebtoken` - JWT 認證
- `better-sqlite3` - SQLite 資料庫

**開發工具**：
- `typescript` - TypeScript 支援
- `tsx` - TypeScript 執行器
- `nodemon` - 自動重啟
- 所有 @types 定義

### ✅ 3. 資料庫設計 (SQLite)
建立了四個資料表：

#### users 表
- id, username, email, password (雜湊), createdAt
- email UNIQUE 約束

#### cafes 表
- id, name, description, address, category
- rating, priceLevel
- hasWifi, hasPowerOutlets, hasTimeLimit, isNoisy, hasGoodLighting, hasAvailableSeats
- createdBy (外鍵), createdAt, updatedAt

#### visits 表
- id, cafeId, userId, visitDate, notes, rating, createdAt
- 外鍵約束：cafeId → cafes, userId → users

#### wishlist 表
- id, cafeId, userId, notes, createdAt
- 外鍵約束：cafeId → cafes, userId → users
- UNIQUE(cafeId, userId) - 防止重複收藏

### ✅ 4. 認證系統
**密碼雜湊 (bcrypt)**：
- Salt rounds: 10
- 註冊時自動雜湊密碼
- 登入時驗證密碼

**JWT Token**：
- 登入/註冊時產生 Token
- Token 有效期：7 天（可設定）
- Payload: { userId, email }
- 認證中間件 (authenticateToken)

### ✅ 5. API 路由實作

#### 認證 API (/auth)
- ✅ POST /auth/register - 註冊
- ✅ POST /auth/login - 登入
- ✅ GET /auth/me - 取得使用者資訊（需認證）

#### 咖啡廳 API (/api/cafes)
- ✅ GET /api/cafes - 取得所有（支援搜尋 q 和類別 category）
- ✅ GET /api/cafes/:id - 取得單一咖啡廳
- ✅ POST /api/cafes - 新增（需認證）
- ✅ PUT /api/cafes/:id - 更新（需認證，僅建立者）
- ✅ DELETE /api/cafes/:id - 刪除（需認證，僅建立者）

#### 到訪記錄 API (/api/visits)
- ✅ GET /api/visits - 取得我的記錄（需認證）
- ✅ GET /api/visits/cafe/:cafeId - 取得特定咖啡廳記錄（需認證）
- ✅ POST /api/visits - 新增記錄（需認證）
- ✅ PUT /api/visits/:id - 更新記錄（需認證，僅本人）
- ✅ DELETE /api/visits/:id - 刪除記錄（需認證，僅本人）

#### 願望清單 API (/api/wishlist)
- ✅ GET /api/wishlist - 取得我的願望清單（需認證）
- ✅ GET /api/wishlist/check/:cafeId - 檢查是否在清單中（需認證）
- ✅ POST /api/wishlist - 加入清單（需認證）
- ✅ PUT /api/wishlist/:id - 更新備註（需認證，僅本人）
- ✅ DELETE /api/wishlist/:id - 移除（需認證，僅本人）
- ✅ DELETE /api/wishlist/cafe/:cafeId - 依咖啡廳 ID 移除（需認證）

### ✅ 6. 輸入驗證
- Email 格式驗證
- 密碼長度驗證（至少 6 字元）
- 必填欄位檢查
- 評分範圍檢查（0-5）
- 價格等級檢查（1-4）
- 日期格式驗證
- 文字長度驗證

### ✅ 7. 錯誤處理
**HTTP 狀態碼**：
- 200 OK - 成功
- 201 Created - 建立成功
- 400 Bad Request - 請求錯誤
- 401 Unauthorized - 未認證
- 403 Forbidden - 無權限
- 404 Not Found - 找不到資源
- 409 Conflict - 資源衝突
- 500 Internal Server Error - 伺服器錯誤

**錯誤訊息格式**：
```json
{
  "error": "錯誤訊息"
}
```

### ✅ 8. CORS 設定
- 允許來源：http://localhost:5173, http://127.0.0.1:5173
- 支援 credentials
- 可透過環境變數 `CORS_ORIGINS` 設定

### ✅ 9. 權限控管
- 未登入無法存取受保護資源
- 使用者僅能修改/刪除自己建立的咖啡廳
- 使用者僅能管理自己的到訪記錄和願望清單
- JWT Token 驗證中間件

### ✅ 10. 文件
- ✅ backend/README.md - 完整的 API 文件
- ✅ backend/.env.example - 環境變數範例
- ✅ backend/test-api.http - API 測試檔案（REST Client）

## 專案結構

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts         ✅ 認證路由
│   │   ├── cafes.ts        ✅ 咖啡廳路由
│   │   ├── visits.ts       ✅ 到訪記錄路由
│   │   └── wishlist.ts     ✅ 願望清單路由
│   ├── middleware/
│   │   └── auth.ts         ✅ JWT 認證中間件
│   ├── types.ts            ✅ TypeScript 型別
│   ├── database.ts         ✅ 資料庫初始化
│   └── app.ts              ✅ 應用程式入口
├── test-api.http           ✅ API 測試
├── .env.example            ✅ 環境變數範例
├── .gitignore              ✅ Git 忽略檔案
├── tsconfig.json           ✅ TypeScript 設定
├── package.json            ✅ 專案設定
└── README.md               ✅ API 文件
```

## API 測試方法

### 方法1：使用 curl

```bash
# 測試註冊
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"測試","email":"test@example.com","password":"password123"}'

# 測試登入
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 取得咖啡廳列表
curl http://localhost:3000/api/cafes

# 新增咖啡廳（需要 Token）
curl -X POST http://localhost:3000/api/cafes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"測試咖啡廳","description":"很棒","address":"台北市","category":"辦公友善","hasWifi":true,"hasPowerOutlets":true,"hasTimeLimit":false,"isNoisy":false,"hasGoodLighting":true,"hasAvailableSeats":true}'
```

### 方法2：使用 REST Client (VS Code)
1. 安裝 REST Client 擴充套件
2. 開啟 `test-api.http` 檔案
3. 點擊請求上方的 "Send Request"

## 啟動方式

```bash
# 進入後端目錄
cd backend

# 安裝依賴（如果還沒安裝）
npm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 填入 JWT_SECRET 等設定

# 啟動開發伺服器
npm run dev

# 伺服器將在 http://localhost:3000 運行
```

## 環境變數

```env
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DATABASE_URL=./dev.db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_SERVER_KEY=YOUR_SERVER_KEY
```

## 安全性特點

1. ✅ **密碼雜湊**: 使用 bcrypt (10 rounds)
2. ✅ **JWT 認證**: Token-based 認證機制
3. ✅ **CORS 限制**: 僅允許指定來源
4. ✅ **輸入驗證**: 所有欄位都有驗證
5. ✅ **權限控管**: 使用者僅能操作自己的資料
6. ✅ **SQL 注入防護**: 使用 prepared statements
7. ✅ **錯誤處理**: 統一的錯誤回應格式

## 已測試功能

✅ 伺服器啟動正常
✅ 資料庫初始化成功
✅ 註冊 API 正常（已測試）
✅ 登入 API 正常
✅ JWT Token 產生成功

## 待測試項目

⏳ 完整的 API 端點測試（所有 CRUD 操作）
⏳ 權限驗證測試
⏳ 錯誤處理測試
⏳ 資料驗證測試

## 下一步（階段3）

**串接 Google Maps API**
- Google Maps JavaScript API（前端地圖顯示）
- Geocoding API（地址 ↔ 座標）
- Places API（地點搜尋）
- Directions API（路線規劃，可選）

---

**階段2 完成度：95%** ✅

所有核心功能已實作完成，API 已可使用 curl 或 REST Client 進行測試！


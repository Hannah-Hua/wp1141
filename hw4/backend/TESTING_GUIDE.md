# 階段2 測試指南

## 前置準備

### 1. 確認後端正在運行

```bash
# 開啟終端機，進入後端目錄
cd /Users/hannah/wp1141/hw4/backend

# 啟動後端伺服器
npm run dev

# 你應該看到：
# ✅ 資料庫初始化完成
# 🚀 伺服器運行在 http://localhost:3000
# 📝 API 文件: http://localhost:3000/
# 🌍 CORS 允許來源: http://localhost:5173, http://127.0.0.1:5173
```

### 2. 測試伺服器是否運行

開新的終端機視窗：

```bash
curl http://localhost:3000
```

如果看到 JSON 回應，表示伺服器正常運行！✅

---

## 測試方法

### 🌟 方法1：REST Client (VS Code) - 最推薦

#### 安裝步驟

1. 在 VS Code 中按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows)
2. 搜尋 "REST Client"
3. 安裝 "REST Client" by Huachao Mao
4. 重啟 VS Code

#### 使用步驟

1. **開啟測試檔案**
   ```
   /Users/hannah/wp1141/hw4/backend/test-api.http
   ```

2. **執行測試**
   - 在每個測試區塊上方，會看到 "Send Request" 連結
   - 點擊即可執行並查看結果

3. **測試需要認證的 API**
   - 先執行「2.1 註冊新使用者」或「2.2 登入」
   - 複製回傳的 `token` 值
   - 在檔案第 4 行找到：
     ```
     @token = YOUR_JWT_TOKEN_HERE
     ```
   - 把 Token 貼上去：
     ```
     @token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - 現在可以測試需要認證的 API 了！

#### 測試流程範例

```
1. 點擊「2.1 註冊新使用者」的 Send Request
2. 複製回傳的 token
3. 更新第 4 行的 @token
4. 點擊「3.4 新增咖啡廳」的 Send Request
5. 查看右側的回應結果
```

---

### 🚀 方法2：使用測試腳本 - 最快速

```bash
# 確保後端在運行，然後執行：
cd /Users/hannah/wp1141/hw4/backend
./test-api.sh
```

這個腳本會自動執行所有測試並顯示結果！

---

### 💻 方法3：使用 curl 指令 - 手動測試

#### 基本測試流程

**1. 測試伺服器**
```bash
curl http://localhost:3000
```

**2. 註冊新使用者**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "你的名字",
    "email": "your@email.com",
    "password": "password123"
  }'
```

**回應範例：**
```json
{
  "message": "註冊成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "你的名字",
    "email": "your@email.com"
  }
}
```

**複製這個 token，接下來會用到！**

**3. 登入（如果已註冊）**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "password123"
  }'
```

**4. 新增咖啡廳（需要 Token）**
```bash
# 把 YOUR_TOKEN 替換成你的 token
TOKEN="YOUR_TOKEN"

curl -X POST http://localhost:3000/api/cafes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "我的測試咖啡廳",
    "description": "這是一間很棒的咖啡廳",
    "address": "台北市大安區",
    "category": "辦公友善",
    "rating": 4.5,
    "priceLevel": 2,
    "hasWifi": true,
    "hasPowerOutlets": true,
    "hasTimeLimit": false,
    "isNoisy": false,
    "hasGoodLighting": true,
    "hasAvailableSeats": true
  }'
```

**5. 取得所有咖啡廳（公開）**
```bash
curl http://localhost:3000/api/cafes
```

**6. 新增到訪記錄**
```bash
TOKEN="YOUR_TOKEN"

curl -X POST http://localhost:3000/api/visits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cafeId": 1,
    "visitDate": "2025-10-22",
    "notes": "環境很棒！",
    "rating": 5
  }'
```

**7. 取得我的到訪記錄**
```bash
TOKEN="YOUR_TOKEN"

curl http://localhost:3000/api/visits \
  -H "Authorization: Bearer $TOKEN"
```

**8. 加入願望清單**
```bash
TOKEN="YOUR_TOKEN"

curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cafeId": 1,
    "notes": "想去試試看"
  }'
```

**9. 取得我的願望清單**
```bash
TOKEN="YOUR_TOKEN"

curl http://localhost:3000/api/wishlist \
  -H "Authorization: Bearer $TOKEN"
```

---

### 🌐 方法4：使用瀏覽器 - 最簡單（僅限 GET）

**只能測試不需要認證的 GET 請求**

1. 開啟瀏覽器
2. 訪問以下網址：

```
# API 首頁
http://localhost:3000

# 取得咖啡廳列表
http://localhost:3000/api/cafes

# 取得單一咖啡廳（假設 ID 為 1）
http://localhost:3000/api/cafes/1

# 搜尋咖啡廳
http://localhost:3000/api/cafes?q=測試

# 依類別篩選
http://localhost:3000/api/cafes?category=辦公友善
```

---

## 完整測試流程

### 📋 測試檢查表

按照順序測試以下功能：

#### 階段 1：認證功能
- [ ] 1. 註冊新使用者
- [ ] 2. 登入
- [ ] 3. 取得使用者資訊（需 Token）

#### 階段 2：咖啡廳 CRUD
- [ ] 4. 取得所有咖啡廳（公開）
- [ ] 5. 新增咖啡廳（需 Token）
- [ ] 6. 取得單一咖啡廳（公開）
- [ ] 7. 更新咖啡廳（需 Token）
- [ ] 8. 刪除咖啡廳（需 Token）

#### 階段 3：到訪記錄
- [ ] 9. 新增到訪記錄（需 Token）
- [ ] 10. 取得我的到訪記錄（需 Token）
- [ ] 11. 更新到訪記錄（需 Token）
- [ ] 12. 刪除到訪記錄（需 Token）

#### 階段 4：願望清單
- [ ] 13. 加入願望清單（需 Token）
- [ ] 14. 取得我的願望清單（需 Token）
- [ ] 15. 檢查咖啡廳是否在清單中（需 Token）
- [ ] 16. 從願望清單移除（需 Token）

#### 階段 5：錯誤處理
- [ ] 17. 測試未認證訪問（應回傳 401）
- [ ] 18. 測試無效 Token（應回傳 403）
- [ ] 19. 測試缺少必填欄位（應回傳 400）

---

## 常見問題

### Q1: curl 指令太長，有更簡單的方法嗎？

**A:** 使用 REST Client (方法1) 或測試腳本 (方法2)！

---

### Q2: 如何讓 JSON 回應更好閱讀？

**A:** 加上 `| python3 -m json.tool`：

```bash
curl http://localhost:3000/api/cafes | python3 -m json.tool
```

或使用 `jq`：
```bash
curl http://localhost:3000/api/cafes | jq
```

---

### Q3: Token 放在哪裡？

**A:** 放在 `Authorization` header 中：

```bash
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Q4: 如何重置資料庫？

**A:** 刪除資料庫檔案並重啟：

```bash
cd /Users/hannah/wp1141/hw4/backend
rm dev.db
npm run dev
```

資料庫會自動重新建立！

---

### Q5: 後端沒有在運行怎麼辦？

**A:** 啟動後端：

```bash
cd /Users/hannah/wp1141/hw4/backend
npm run dev
```

如果看到錯誤，檢查：
1. port 3000 是否被佔用
2. .env 檔案是否存在
3. node_modules 是否已安裝

---

## 測試技巧

### 💡 技巧1：使用變數儲存 Token

```bash
# 登入並儲存 Token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# 現在可以直接使用 $TOKEN
curl http://localhost:3000/api/visits \
  -H "Authorization: Bearer $TOKEN"
```

### 💡 技巧2：美化 JSON 輸出

在所有 curl 指令後面加上：
```bash
| python3 -m json.tool
```

### 💡 技巧3：查看 HTTP 狀態碼

```bash
curl -i http://localhost:3000/api/cafes
```

`-i` 會顯示 HTTP headers，包括狀態碼！

---

## 推薦測試工具

1. **REST Client (VS Code)** ⭐⭐⭐⭐⭐
   - 最方便、最視覺化
   - 可以儲存測試歷史
   - 支援變數和環境

2. **測試腳本** ⭐⭐⭐⭐
   - 自動化測試
   - 快速驗證所有功能

3. **curl** ⭐⭐⭐
   - 內建工具，不需安裝
   - 靈活但需要手動輸入

4. **Postman** ⭐⭐⭐⭐
   - 功能強大
   - 需要額外安裝
   - 適合複雜的 API 測試

---

## 開始測試吧！

**推薦流程：**

1. **第一次測試** → 使用 REST Client
2. **快速驗證** → 使用測試腳本
3. **除錯/實驗** → 使用 curl

祝測試順利！🎉

如有問題，參考 `backend/README.md` 或 `STAGE2_TEST_RESULTS.md`！


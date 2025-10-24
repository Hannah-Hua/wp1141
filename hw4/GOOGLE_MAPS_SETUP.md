# Google Maps API 設定指南

## 📋 需要建立的 API Keys

您需要建立 **2 把** API Keys：

1. **Browser Key** - 給前端使用（地圖顯示）
2. **Server Key** - 給後端使用（Geocoding/Places/Directions）

---

## 🔧 Google Cloud 設定步驟

### 步驟1：建立專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊左上角的專案選擇器
3. 點擊「新增專案」
4. 輸入專案名稱：`cafe-map-app`（或任意名稱）
5. 點擊「建立」

---

### 步驟2：啟用 API

1. 在左側選單找到「API 和服務」→「程式庫」
2. 搜尋並啟用以下 **4 個 API**：

   **前端使用**：
   - ✅ 不限制金鑰

   **後端使用**（統一規格）：
   - ✅ Geocoding API
   - ✅ Places API
   - ✅ Directions API

3. 每個都點擊「啟用」

---

### 步驟3：建立 Browser Key（前端用）

1. 前往「API 和服務」→「憑證」
2. 點擊「建立憑證」→「API 金鑰」
3. API 金鑰建立完成後，點擊「編輯 API 金鑰」

4. **設定金鑰限制**：
   - 名稱：`Browser Key - Cafe Map Frontend`
   - 應用程式限制：選擇「**HTTP 參照網址 (網站)**」
   - 網站限制：新增以下兩個網址：
     ```
     http://localhost:5173/*
     http://127.0.0.1:5173/*
     ```
   
5. **API 限制**：
   - 選擇「**限制金鑰**」
   - 只選擇：「**Maps JavaScript API**」

6. 點擊「儲存」

7. **複製這個 API Key** - 這是你的 **Browser Key**

---

### 步驟4：建立 Server Key（後端用）

1. 再次點擊「建立憑證」→「API 金鑰」
2. 點擊「編輯 API 金鑰」

3. **設定金鑰限制**：
   - 名稱：`Server Key - Cafe Map Backend`
   - 應用程式限制：選擇「**IP 位址**」
   - ⚠️ **開發階段**：暫時**不新增任何 IP**（留空）
     - 這樣本地開發時才能使用
     - **注意**：這有安全風險，部署時需要設定 IP 限制

4. **API 限制**：
   - 選擇「**限制金鑰**」
   - 選擇以下 **3 個 API**：
     - ✅ Geocoding API
     - ✅ Places API
     - ✅ Directions API

5. 點擊「儲存」

6. **複製這個 API Key** - 這是你的 **Server Key**

---

## 📝 設定環境變數

### 前端 (.env)

```bash
cd /Users/hannah/wp1141/hw4/frontend

# 編輯 .env 檔案
nano .env
```

填入：
```env
VITE_GOOGLE_MAPS_JS_KEY=你的_Browser_Key_這裡
VITE_API_BASE_URL=http://localhost:3000
```

### 後端 (.env)

```bash
cd /Users/hannah/wp1141/hw4/backend

# 編輯 .env 檔案（已存在）
nano .env
```

在最後一行加入或修改：
```env
GOOGLE_MAPS_SERVER_KEY=你的_Server_Key_這裡
```

---

## ✅ 驗證設定

### 測試 Browser Key

在瀏覽器訪問（替換成你的 Key）：
```
https://maps.googleapis.com/maps/api/js?key=YOUR_BROWSER_KEY&callback=console.log
```

如果沒有錯誤訊息，表示設定正確！

### 測試 Server Key

在終端機執行（替換成你的 Key）：
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=台北101&key=YOUR_SERVER_KEY"
```

如果回傳 JSON 資料（包含座標），表示設定正確！

---

## 🚨 重要注意事項

### ⚠️ 安全警告

**Server Key 無 IP 限制的風險**：
- 任何人都可以使用這個 Key
- 可能導致配額被濫用
- **僅限開發環境使用**
- 部署到生產環境時，**務必設定 IP 限制**

### 💰 配額限制

Google Maps API 有免費額度：
- 每月 $200 美金的免費額度
- 開發測試通常足夠
- 注意不要過度呼叫 API

### 🔒 金鑰安全

- ✅ `.env` 檔案已在 `.gitignore` 中
- ✅ 不會被提交到 Git
- ❌ 不要將 Key 分享給他人
- ❌ 不要將 Key 提交到公開 Repository

---

## 📚 API 用途說明

### Maps JavaScript API（Browser Key）
- **用途**：在前端顯示地圖
- **使用位置**：`frontend/src/components/MapView.tsx`
- **功能**：地圖顯示、標記、互動

### Geocoding API（Server Key）
- **用途**：地址 ↔ 座標轉換
- **使用位置**：`backend/src/routes/cafes.ts`
- **功能**：新增咖啡廳時自動取得座標

### Places API（Server Key）
- **用途**：地點搜尋、詳細資訊
- **使用位置**：`backend/src/routes/cafes.ts`
- **功能**：搜尋附近咖啡廳、自動完成

### Directions API（Server Key）
- **用途**：路線規劃
- **使用位置**：`backend/src/routes/cafes.ts`（可選）
- **功能**：規劃到咖啡廳的路線

---

## ⏭️ 完成設定後

當您完成 Google Cloud 設定並填入 API Keys 後，告訴我：

「我已經設定好 Google Maps API Keys 了！」

然後我會繼續實作地圖整合功能！🗺️

---

## 🆘 需要幫助？

如果在設定過程中遇到問題，請告訴我：
- 哪個步驟卡住了
- 看到什麼錯誤訊息
- 我會協助您解決！


# 驗證 Google Maps API Key

## 🔍 您遇到的 400 錯誤

您看到的 Google 400 錯誤通常是因為：
1. API Key 格式不正確
2. 請求 URL 有誤
3. API 尚未啟用

讓我們一步一步驗證！

---

## ✅ 驗證步驟

### 步驟1：檢查 Server Key 是否正確

在終端機執行以下指令（**記得替換成你的 Key**）：

```bash
# 測試 Geocoding API
curl "https://maps.googleapis.com/maps/api/geocode/json?address=台北101&key=YOUR_SERVER_KEY_HERE"
```

**正確的回應範例**：
```json
{
  "results": [
    {
      "formatted_address": "110台灣台北市信義區信義路五段7號",
      "geometry": {
        "location": {
          "lat": 25.0339639,
          "lng": 121.5644722
        }
      }
    }
  ],
  "status": "OK"
}
```

**如果看到錯誤**：
```json
{
  "error_message": "...",
  "status": "REQUEST_DENIED"
}
```

表示 API Key 有問題或 API 未啟用。

---

### 步驟2：檢查是否啟用所需的 API

前往 [Google Cloud Console - API 程式庫](https://console.cloud.google.com/apis/library)

確認以下 API 都已啟用（顯示綠色勾勾）：
- ✅ Geocoding API
- ✅ Places API  
- ✅ Directions API
- ✅ Maps JavaScript API

如果沒有，點擊進去並按「啟用」。

---

### 步驟3：檢查 API Key 限制設定

前往 [Google Cloud Console - 憑證](https://console.cloud.google.com/apis/credentials)

#### Server Key 檢查：

1. 點擊你的 Server Key
2. 確認設定：
   - **應用程式限制**：IP 位址
   - **IP 位址**：暫時留空（開發用）
   - **API 限制**：限制金鑰
   - **選取的 API**：
     - ✅ Geocoding API
     - ✅ Places API
     - ✅ Directions API

#### Browser Key 檢查：

1. 點擊你的 Browser Key
2. 確認設定：
   - **應用程式限制**：HTTP 參照網址
   - **網站限制**：
     - `http://localhost:5173/*`
     - `http://127.0.0.1:5173/*`
   - **API 限制**：限制金鑰
   - **選取的 API**：
     - ✅ Maps JavaScript API

---

### 步驟4：使用我們的測試工具

#### 測試後端 API

1. **確保 Server Key 已設定在 .env**
   ```bash
   cd /Users/hannah/wp1141/hw4/backend
   cat .env | grep GOOGLE_MAPS_SERVER_KEY
   ```
   
   應該看到：
   ```
   GOOGLE_MAPS_SERVER_KEY=你的_Key
   ```

2. **執行測試腳本**
   ```bash
   ./test-google-maps.sh
   ```

#### 測試前端地圖

1. **確保 Browser Key 已設定在 .env**
   ```bash
   cd /Users/hannah/wp1141/hw4/frontend
   cat .env | grep VITE_GOOGLE_MAPS_JS_KEY
   ```
   
   應該看到：
   ```
   VITE_GOOGLE_MAPS_JS_KEY=你的_Key
   ```

2. **重啟前端伺服器**
   ```bash
   # 停止目前的 (Ctrl+C)
   npm run dev
   ```

3. **訪問前端**
   ```
   http://localhost:5173
   ```
   
   登入後應該看到真實的 Google Maps！

---

## 🆘 常見問題

### Q1: 看到「API key not valid」錯誤？

**原因**：API Key 格式不正確或已被刪除

**解決**：
1. 重新複製 API Key（確保沒有多餘空格）
2. 檢查 Key 是否仍存在於 Google Cloud Console
3. 嘗試建立新的 API Key

---

### Q2: 看到「This API project is not authorized」錯誤？

**原因**：API 限制設定不正確

**解決**：
- Server Key：確認已選取 Geocoding、Places、Directions API
- Browser Key：確認已選取 Maps JavaScript API

---

### Q3: 看到「REQUEST_DENIED」錯誤？

**原因**：API 未啟用

**解決**：
1. 前往 API 程式庫
2. 搜尋並啟用所需的 API
3. 等待 1-2 分鐘讓設定生效

---

### Q4: 看到「OVER_QUERY_LIMIT」錯誤？

**原因**：超過免費配額

**解決**：
1. 檢查 [Google Cloud Console - 配額](https://console.cloud.google.com/apis/dashboard)
2. 可能需要啟用計費（但每月有 $200 免費額度）
3. 減少測試次數

---

## 🧪 最簡單的測試方法

### 測試 Server Key

複製以下指令，**替換 YOUR_KEY** 後執行：

```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=台北101&key=YOUR_SERVER_KEY"
```

**成功**：看到 `"status": "OK"` 和座標資料  
**失敗**：看到 `"status": "REQUEST_DENIED"` 或 400 錯誤

### 測試 Browser Key

在瀏覽器網址列輸入（**替換 YOUR_KEY**）：

```
https://maps.googleapis.com/maps/api/js?key=YOUR_BROWSER_KEY&callback=console.log
```

**成功**：頁面載入（可能是空白，但沒有錯誤）  
**失敗**：看到錯誤訊息

---

## 📝 正確設定後的預期行為

### 後端測試
```bash
cd backend
./test-google-maps.sh
```

應該看到：
```json
{
  "success": true,
  "data": {
    "latitude": 25.0339639,
    "longitude": 121.5644722,
    "formattedAddress": "110台灣台北市信義區信義路五段7號",
    "placeId": "..."
  }
}
```

### 前端測試

訪問 http://localhost:5173，登入後應該看到：
- ✅ 真實的 Google Maps 地圖
- ✅ 可以縮放、拖曳
- ✅ 咖啡廳標記顯示在地圖上
- ✅ 點擊標記顯示資訊視窗

---

## 🔧 除錯建議

1. **先測試 Server Key**：使用 curl 指令
2. **再測試 Browser Key**：在瀏覽器測試
3. **檢查 .env 檔案**：確保沒有多餘空格
4. **重啟伺服器**：修改 .env 後需要重啟

---

需要協助嗎？告訴我您看到的具體錯誤訊息，我會幫您解決！🔧


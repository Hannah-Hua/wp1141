# 疑難排解指南

本指南協助解決常見的錯誤和問題。

## 📋 目錄

1. [OpenAI API 配額用盡](#openai-api-配額用盡)
2. [MongoDB 連線失敗](#mongodb-連線失敗)
3. [LINE Webhook 驗證失敗](#line-webhook-驗證失敗)
4. [其他常見問題](#其他常見問題)

---

## OpenAI API 配額用盡

### 錯誤訊息

```
429 You exceeded your current quota, please check your plan and billing details.
```

### 原因

- OpenAI 免費額度（$5）已用完
- 需要設定付款方式才能繼續使用

### 解決方案 1：切換到 Google Gemini（推薦，完全免費）

#### 步驟 1：取得 Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 使用 Google 帳號登入
3. 點選 **"Create API Key"**
4. 複製 API Key

#### 步驟 2：更新 `.env.local`

```env
# 啟用 Gemini（僅當你真的想使用時）
LLM_PROVIDER=gemini
ENABLE_GEMINI=true
GOOGLE_GEMINI_API_KEY=AIzaSyBxBChTjEHzqXuSi7vZanJr-0fT3gswI8o

# 建議仍保留 OpenAI 作為備援
# OPENAI_API_KEY=sk-...
```

#### 步驟 3：測試 Gemini 連線

```bash
node scripts/test-gemini.js
```

#### 步驟 4：重新啟動開發伺服器

```bash
# 停止目前的伺服器（Ctrl+C）
# 重新啟動
npm run dev
```

### 解決方案 2：設定 OpenAI 付款方式

如果你仍想使用 OpenAI：

1. 前往 [OpenAI Billing](https://platform.openai.com/account/billing)
2. 新增付款方式（信用卡或 PayPal）
3. 設定使用上限（建議）
4. 等待幾分鐘後重試

### 解決方案 3：等待配額重置

- 某些免費額度可能會定期重置
- 但通常需要設定付款方式

---

## MongoDB 連線失敗

### 錯誤訊息

```
MongoServerSelectionError: connect ECONNREFUSED
```

### 原因

- IP 地址未加入白名單
- 連線字串錯誤
- 使用者名稱或密碼錯誤

### 解決方法

1. **檢查 IP 白名單**：
   - 前往 [MongoDB Atlas Network Access](https://cloud.mongodb.com/v2#/security/network/whitelist)
   - 確認你的 IP 已加入，或允許所有 IP（`0.0.0.0/0`）

2. **檢查連線字串**：
   - 確認 `MONGODB_URI` 格式正確
   - 確認使用者名稱和密碼正確
   - 如果密碼包含特殊字元，需要 URL 編碼

3. **參考詳細指南**：
   - 查看 [MONGODB_SETUP.md](./MONGODB_SETUP.md)

---

## LINE Webhook 驗證失敗

### 錯誤訊息

```
Invalid signature
```

### 原因

- `LINE_CHANNEL_SECRET` 錯誤
- Webhook URL 設定錯誤
- ngrok URL 已變更

### 解決方法

1. **檢查 Channel Secret**：
   - 前往 [LINE Developers Console](https://developers.line.biz/console/)
   - 確認 `LINE_CHANNEL_SECRET` 與 `.env.local` 中的一致

2. **檢查 Webhook URL**：
   - 確認 ngrok URL 是否正確
   - 確認 URL 格式：`https://xxx.ngrok.io/api/line/webhook`

3. **重新驗證 Webhook**：
   - 在 LINE Developers Console 點選 "Verify"
   - 確認顯示 "Success"

---

## 其他常見問題

### 問題：`npm install` 失敗

**解決方法：**
```bash
# 清除快取
npm cache clean --force

# 刪除 node_modules
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### 問題：埠號 3000 已被占用

**解決方法：**
```bash
# 檢查占用埠號的程式
lsof -i :3000

# 關閉占用程式，或使用其他埠號
PORT=3001 npm run dev
```

### 問題：環境變數讀取不到

**解決方法：**
1. 確認 `.env.local` 檔案在專案根目錄
2. 確認檔案名稱正確（`.env.local`，不是 `env.local`）
3. 確認變數格式正確（`變數名稱=值`，無空格）
4. 重新啟動開發伺服器

### 問題：遊戲流程卡住

**可能原因：**
- LLM API 失敗
- 資料庫連線問題
- 程式碼錯誤

**解決方法：**
1. 檢查終端機錯誤訊息
2. 確認 LLM API 連線正常
3. 確認資料庫連線正常
4. 查看 ngrok Web Interface 的請求日誌

---

## 快速診斷指令

### 檢查所有環境變數

```bash
node -e "require('dotenv').config({ path: '.env.local' }); console.log('MongoDB:', process.env.MONGODB_URI ? '✅' : '❌'); console.log('LINE Token:', process.env.LINE_CHANNEL_ACCESS_TOKEN ? '✅' : '❌'); console.log('LINE Secret:', process.env.LINE_CHANNEL_SECRET ? '✅' : '❌'); console.log('LLM Provider:', process.env.LLM_PROVIDER || 'openai'); console.log('Gemini Key:', process.env.GOOGLE_GEMINI_API_KEY ? '✅' : '❌'); console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? '✅' : '❌');"
```

### 測試所有連線

```bash
# 測試 MongoDB
node scripts/test-mongodb.js

# 測試 LLM（根據設定）
if [ "$LLM_PROVIDER" = "gemini" ]; then
  node scripts/test-gemini.js
else
  node scripts/test-openai.js
fi
```

---

## 📚 相關資源

- [MongoDB 設定指南](./MONGODB_SETUP.md)
- [OpenAI 設定指南](./OPENAI_SETUP.md)
- [免費 LLM 替代方案](./FREE_LLM_ALTERNATIVES.md)
- [本地測試指南](./LOCAL_TESTING.md)


# 專案設定指南

## 📋 快速開始檢查清單

### 1. 環境變數設定

建立 `.env.local` 檔案並填入以下變數：

> 💡 **詳細步驟**：請參考 **[ENV_SETUP.md](./ENV_SETUP.md)** 文件，包含完整的建立步驟和注意事項。

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://ziyenhua_db_user:AgSMi49CxhCDQDE9@hw6.wkp7fji.mongodb.net/?appName=hw6

# LINE Bot (從 LINE Developers Console 取得)
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret

# LLM 設定（使用 OpenAI）
OPENAI_API_KEY=sk-your_openai_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **重要**：第一行的 `MONGODB_URI=` 是必需的，不要遺漏變數名稱！

### 2. 安裝依賴

```bash
npm install
```

### 3. 測試連線

在啟動開發伺服器前，建議先測試連線：

```bash
# 測試 MongoDB 連線
node scripts/test-mongodb.js

# 測試 LLM API
node scripts/test-openai.js
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

> 💡 **詳細測試步驟**：請參考 **[LOCAL_TESTING.md](./LOCAL_TESTING.md)** 文件，包含完整的本地測試指南。

### 4. 設定 LINE Webhook

#### 開發環境（使用 ngrok）

1. 安裝 ngrok：`brew install ngrok` (macOS) 或從 [ngrok.com](https://ngrok.com/) 下載
2. 啟動 ngrok：`ngrok http 3000`
3. 複製 HTTPS URL（例如：`https://abc123.ngrok.io`）
4. 在 LINE Developers Console 設定 Webhook URL：`https://abc123.ngrok.io/api/line/webhook`

#### 生產環境（Vercel）

1. 部署到 Vercel
2. 取得部署 URL（例如：`https://your-app.vercel.app`）
3. 在 LINE Developers Console 設定 Webhook URL：`https://your-app.vercel.app/api/line/webhook`
4. 啟用 Webhook

### 5. 測試 Bot

1. 在 LINE 中搜尋你的 Bot
2. 傳送「開始冒險」訊息
3. 按照提示進行遊戲

## 🔧 取得憑證的詳細步驟

### MongoDB Atlas

詳細的 MongoDB Atlas 設定步驟，請參考 **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** 文件。

快速步驟：
1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 建立免費帳號（Free Tier）
3. 建立新的 Cluster
4. 在 Database Access 建立使用者
5. 在 Network Access 允許所有 IP（或加入你的 IP）
6. 在 Clusters 點選 Connect，選擇 "Connect your application"
7. 複製連線字串，替換 `<password>` 為你的密碼

### LINE Developers

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Provider（如果還沒有）
3. 建立新的 Channel，選擇 "Messaging API"
4. 在 Channel settings 取得：
   - Channel Access Token T809YfQLtAXjE4DKo9hSZSznDP1ZvlVNZjSPBGo0oeT5Weq05Us9rdiEyOMAV3fUDMSlhaAVixP1vsCRzrKoc4+28Xf4t7jrsh+Qpq8APxfNsuFgwUXlZSfwagKvk6gnCoPSWWixyGf2fd//Os9V7QdB04t89/1O/w1cDnyilFU=
   - Channel Secret 21cdf2e88ddff0a4e3559ede0896cea2
5. 在 Messaging API setting  設定 Webhook URL
6. 啟用 "Use webhook"

### OpenAI API

詳細的 OpenAI API 設定步驟，請參考 **[OPENAI_SETUP.md](./OPENAI_SETUP.md)** 文件。

快速步驟：
1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 建立帳號並登入
3. 前往 API Keys 頁面
4. 建立新的 API Key
5. 複製 API Key（只會顯示一次，請妥善保存）
6. 設定付款方式（信用卡或 PayPal）

## 🚀 部署到 Vercel

1. 將專案推送到 GitHub
2. 前往 [Vercel](https://vercel.com/)
3. 匯入 GitHub 專案
4. 在 Environment Variables 設定所有環境變數
5. 部署
6. 更新 LINE Webhook URL 為 Vercel 部署 URL

## 📝 測試建議

### 測試遊戲流程

1. **開始遊戲**：傳送「開始冒險」
2. **輸入名稱**：輸入任意名稱（例如：Hannah）
3. **選擇職業**：輸入 1、2 或 3
4. **遊戲進行**：選擇選項推進劇情
5. **重新開始**：傳送「重新開始」測試新遊戲

### 測試錯誤處理

1. 暫時移除 `OPENAI_API_KEY` 環境變數
2. 傳送訊息，應該會收到降級回應
3. 恢復環境變數，確認正常運作

### 測試管理後台

1. 訪問 `http://localhost:3000/admin`
2. 檢視對話紀錄
3. 測試篩選功能（依使用者、日期、階段）

## 🐛 常見問題

### Webhook 驗證失敗

- 確認 `LINE_CHANNEL_SECRET` 正確
- 確認請求簽名驗證邏輯正確

### LLM 回應錯誤

- 確認 `OPENAI_API_KEY` 有效
- 檢查 API 配額是否用盡
- 查看伺服器日誌了解詳細錯誤

### MongoDB 連線失敗

- 確認 `MONGODB_URI` 格式正確
- 確認 Network Access 允許你的 IP
- 確認使用者名稱和密碼正確

### 遊戲狀態不更新

- 檢查 `gameService.ts` 中的更新邏輯
- 確認資料庫連線正常
- 查看伺服器日誌

## 📚 相關文件

- [LINE Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/)
- [OpenAI API 文件](https://platform.openai.com/docs)
- [MongoDB Atlas 文件](https://docs.atlas.mongodb.com/)
- [Next.js 文件](https://nextjs.org/docs)


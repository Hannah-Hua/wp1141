# 本地測試指南

本指南將協助你在本地環境測試 LINE Bot 專案。

## 📋 目錄

1. [前置準備](#前置準備)
2. [安裝與設定](#安裝與設定)
3. [測試資料庫連線](#測試資料庫連線)
4. [測試 LLM API](#測試-llm-api)
5. [啟動開發伺服器](#啟動開發伺服器)
6. [測試管理後台](#測試管理後台)
7. [測試 LINE Bot（使用 ngrok）](#測試-line-bot使用-ngrok)
8. [常見問題](#常見問題)

---

## 前置準備

### 檢查清單

在開始測試前，請確認：

- [ ] Node.js 18+ 已安裝
- [ ] `.env.local` 檔案已建立並設定完成
- [ ] MongoDB Atlas 連線字串已設定
- [ ] LLM API Key 已設定（OpenAI 或 Gemini）
- [ ] LINE Bot 憑證已取得（Channel Access Token 和 Secret）

### 檢查 Node.js 版本

```bash
node --version
# 應該顯示 v18.x.x 或更高版本
```

---

## 安裝與設定

### 步驟 1：進入專案目錄

```bash
cd /Users/hannah/wp1141/hw6
```

### 步驟 2：安裝依賴套件

```bash
npm install
```

這會安裝所有必要的套件，包括：
- Next.js
- MongoDB (Mongoose)
- LINE Bot SDK
- OpenAI / Google Gemini
- 其他依賴

**預期輸出：**
```
added 234 packages, and audited 235 packages in 15s
```

### 步驟 3：確認環境變數

檢查 `.env.local` 檔案是否存在且內容正確：

```bash
# macOS / Linux
cat .env.local

# Windows (PowerShell)
Get-Content .env.local
```

**應該包含：**
```env
MONGODB_URI=mongodb+srv://...
LINE_CHANNEL_ACCESS_TOKEN=...
LINE_CHANNEL_SECRET=...
LLM_PROVIDER=openai  # 預設使用 OpenAI
OPENAI_API_KEY=...   # 建議必填
# ENABLE_GEMINI=true         # 只有想使用 Gemini 時才設為 true
# GOOGLE_GEMINI_API_KEY=...  # 可選：啟用 Gemini 時才需要
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 測試資料庫連線

### 執行 MongoDB 測試腳本

```bash
node scripts/test-mongodb.js
```

**成功輸出應該類似：**
```
🔄 正在連接到 MongoDB...
📍 連線字串：mongodb+srv://...
✅ MongoDB 連線成功！
📊 資料庫名稱：linebot
🌐 主機：hw6.wkp7fji.mongodb.net
🧪 測試寫入資料...
✅ 測試寫入成功！
📝 寫入的資料 ID：...
🧪 測試讀取資料...
✅ 測試讀取成功！
🧹 清理測試資料...
✅ 測試資料已清理
📚 資料庫中的 Collections：...
👋 已斷開連線
🎉 所有測試通過！MongoDB 設定正確。
```

**如果出現錯誤：**
- 檢查 `MONGODB_URI` 是否正確
- 確認 MongoDB Atlas Network Access 已允許你的 IP
- 參考 [MONGODB_SETUP.md](./MONGODB_SETUP.md) 排除問題

---

## 測試 LLM API

### 如果使用 OpenAI

```bash
node scripts/test-openai.js
```

### 如果使用 Google Gemini

專案已提供測試腳本，直接執行：

```bash
node scripts/test-gemini.js
```

**成功輸出應該類似：**
```
🔄 正在測試 Google Gemini API...
✅ Google Gemini API 連線成功！
📝 回應內容：我是 Google 開發的 Gemini AI 助手...
```

---

## 啟動開發伺服器

### 步驟 1：啟動 Next.js 開發伺服器

```bash
npm run dev
```

**預期輸出：**
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 步驟 2：檢查伺服器是否正常運行

在瀏覽器開啟：http://localhost:3000

**應該看到：**
- 專案首頁
- 顯示 "遺失在台大地下室的秘寶"
- Webhook Endpoint 和管理後台連結

### 步驟 3：檢查 API 端點

在瀏覽器開啟：http://localhost:3000/api/line/webhook

**應該看到：**
```json
{"message":"LINE Webhook endpoint is active"}
```

---

## 測試管理後台

### 步驟 1：開啟管理後台

在瀏覽器開啟：http://localhost:3000/admin

### 步驟 2：檢查功能

你應該看到：
- ✅ 統計資訊卡片（總使用者數、會話數等）
- ✅ 篩選器（使用者 ID、日期、遊戲階段）
- ✅ 對話紀錄列表（如果有的話）

### 步驟 3：測試篩選功能

1. 嘗試依日期篩選
2. 嘗試依遊戲階段篩選
3. 檢查分頁功能

**注意：** 如果還沒有對話紀錄，列表會是空的，這是正常的。

---

## 測試 LINE Bot（使用 ngrok）

### 步驟 1：安裝 ngrok

#### macOS

```bash
# 使用 Homebrew
brew install ngrok

# 或下載安裝檔
# https://ngrok.com/download
```

#### Windows

1. 前往 [ngrok 官網](https://ngrok.com/download)
2. 下載並解壓縮
3. 將 `ngrok.exe` 加入 PATH

#### Linux

```bash
# 下載並安裝
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

### 步驟 2：啟動 ngrok

在**新的終端機視窗**執行：

```bash
ngrok http 3000
```

**預期輸出：**
```
Session Status                online
Account                       Your Account
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**重要：** 複製 `Forwarding` 中的 HTTPS URL（例如：`https://abc123.ngrok.io`）

### 步驟 3：設定 LINE Webhook

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 Channel
3. 前往 **"Messaging API"** 設定頁面
4. 在 **"Webhook URL"** 欄位輸入：
   ```
   https://abc123.ngrok.io/api/line/webhook
   ```
   （將 `abc123.ngrok.io` 替換為你的 ngrok URL）
5. 點選 **"Update"** 或 **"Verify"**
6. 啟用 **"Use webhook"**

### 步驟 4：測試 LINE Bot

1. 在 LINE 中搜尋你的 Bot
2. 傳送訊息：**「開始冒險」**
3. 應該收到遊戲開始的回應

### 步驟 5：測試完整遊戲流程

1. **開始遊戲**：傳送「開始冒險」
2. **輸入名稱**：輸入任意名稱（例如：Hannah）
3. **選擇職業**：點選按鈕或輸入 1、2、3
4. **遊戲進行**：選擇選項推進劇情
5. **檢查管理後台**：前往 http://localhost:3000/admin 查看對話紀錄

### 步驟 6：監控請求（可選）

開啟 ngrok Web Interface：http://127.0.0.1:4040

可以查看：
- 所有 HTTP 請求
- 請求/回應內容
- 除錯資訊

---

## 測試檢查清單

完成以下測試項目：

### 基礎測試

- [ ] Node.js 版本正確（18+）
- [ ] 依賴套件安裝成功
- [ ] `.env.local` 檔案存在且正確
- [ ] MongoDB 連線測試通過
- [ ] LLM API 連線測試通過

### 開發伺服器測試

- [ ] Next.js 開發伺服器啟動成功
- [ ] 首頁可以正常訪問（http://localhost:3000）
- [ ] Webhook 端點回應正常（http://localhost:3000/api/line/webhook）
- [ ] 管理後台可以正常訪問（http://localhost:3000/admin）

### LINE Bot 測試

- [ ] ngrok 安裝並啟動成功
- [ ] LINE Webhook URL 設定正確
- [ ] 可以接收 LINE 訊息
- [ ] 遊戲開始流程正常
- [ ] 角色建立流程正常
- [ ] 職業選擇流程正常
- [ ] LLM 劇情生成正常
- [ ] 對話紀錄正確儲存到資料庫

### 管理後台測試

- [ ] 統計資料顯示正常
- [ ] 對話紀錄列表顯示正常
- [ ] 篩選功能正常運作
- [ ] 分頁功能正常運作

---

## 常見問題

### ❌ 問題：`npm install` 失敗

**可能原因：**
- Node.js 版本過舊
- 網路連線問題
- 套件衝突

**解決方法：**
```bash
# 清除快取
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### ❌ 問題：MongoDB 連線失敗

**解決方法：**
1. 檢查 `MONGODB_URI` 是否正確
2. 確認 MongoDB Atlas Network Access 已允許你的 IP
3. 檢查使用者名稱和密碼是否正確
4. 參考 [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### ❌ 問題：LLM API 測試失敗

**解決方法：**
1. 檢查 API Key 是否正確
2. 確認環境變數名稱正確（`OPENAI_API_KEY` 或 `GOOGLE_GEMINI_API_KEY`）
3. 檢查 API 配額是否用盡
4. 參考 [OPENAI_SETUP.md](./OPENAI_SETUP.md) 或 [FREE_LLM_ALTERNATIVES.md](./FREE_LLM_ALTERNATIVES.md)

### ❌ 問題：Next.js 開發伺服器無法啟動

**可能原因：**
- 埠號 3000 已被占用
- 環境變數錯誤

**解決方法：**
```bash
# 檢查埠號是否被占用
lsof -i :3000

# 如果被占用，可以：
# 1. 關閉占用埠號的程式
# 2. 或使用其他埠號
PORT=3001 npm run dev
```

### ❌ 問題：ngrok 無法啟動

**可能原因：**
- ngrok 未安裝
- 需要登入 ngrok 帳號

**解決方法：**
```bash
# 登入 ngrok（首次使用需要）
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 取得 AUTH_TOKEN：
# 1. 前往 https://dashboard.ngrok.com/get-started/your-authtoken
# 2. 複製 AUTH_TOKEN
```

### ❌ 問題：LINE Webhook 驗證失敗

**可能原因：**
- Webhook URL 錯誤
- LINE Channel Secret 錯誤
- ngrok URL 已變更

**解決方法：**
1. 確認 ngrok URL 是否正確
2. 確認 `.env.local` 中的 `LINE_CHANNEL_SECRET` 正確
3. 在 LINE Developers Console 重新驗證 Webhook

### ❌ 問題：遊戲流程卡住

**可能原因：**
- LLM API 回應失敗
- 資料庫連線問題
- 程式碼錯誤

**解決方法：**
1. 檢查終端機的錯誤訊息
2. 檢查 ngrok Web Interface 的請求日誌
3. 確認 LLM API 連線正常
4. 確認資料庫連線正常

---

## 除錯技巧

### 1. 查看終端機日誌

開發伺服器會顯示所有請求的日誌，包括：
- API 請求
- 錯誤訊息
- 資料庫操作

### 2. 使用 ngrok Web Interface

開啟 http://127.0.0.1:4040 查看：
- 所有 HTTP 請求
- 請求/回應內容
- 除錯資訊

### 3. 檢查資料庫

前往 MongoDB Atlas Dashboard：
1. 點選 **"Database"**
2. 點選 **"Browse Collections"**
3. 查看對話紀錄是否正確儲存

### 4. 檢查環境變數

```bash
# 確認環境變數是否正確載入
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.MONGODB_URI ? 'MongoDB: OK' : 'MongoDB: Missing');"
```

---

## 🎉 測試完成！

如果所有測試都通過，你的 LINE Bot 就可以正常運作了！

**下一步：**
1. 繼續測試更多遊戲場景
2. 優化遊戲體驗
3. 準備部署到 Vercel

---

## 📚 相關資源

- [Next.js 開發文件](https://nextjs.org/docs)
- [ngrok 文件](https://ngrok.com/docs)
- [LINE Messaging API 文件](https://developers.line.biz/en/docs/messaging-api/)


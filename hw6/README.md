# 遺失在台大地下室的秘寶 - LINE Bot 遊戲

一個整合 LINE Messaging API 的智慧聊天機器人系統，實作文字冒險 RPG 遊戲。

## 🎮 遊戲簡介

《遺失在台大地下室的秘寶》是一個在 LINE 上進行的文字冒險 RPG 遊戲。玩家扮演台大資管系學生，在平行台大世界中探索地底城，尋找「星光之心」秘寶。

## ✨ 功能特色

### LINE Bot 功能
- ✅ 完整的對話流程設計（文字、按鈕模板）
- ✅ 固定起始流程（角色建立、職業選擇）
- ✅ LLM 驅動的動態劇情生成
- ✅ 遊戲狀態管理（HP、金錢、道具、進度）
- ✅ 上下文對話維持

### 技術實作
- ✅ LINE Messaging API Webhook 整合
- ✅ MongoDB 對話紀錄持久化
- ✅ OpenAI GPT-4o-mini 整合
- ✅ 錯誤處理與降級機制
- ✅ 管理後台（對話紀錄檢視、篩選、統計）

## 🛠️ 技術棧

- **前端框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **資料庫**: MongoDB Atlas + Mongoose
- **LINE SDK**: @line/bot-sdk
- **LLM**: OpenAI GPT-4o-mini
- **部署**: Vercel

## 📋 環境需求

- Node.js 18+
- MongoDB Atlas 帳號（詳細設定請參考 [MONGODB_SETUP.md](./MONGODB_SETUP.md)）
- LINE Developers 帳號（建立 Messaging API Channel）
- LLM API Key（可選）：
  - OpenAI API Key（詳細設定請參考 [OPENAI_SETUP.md](./OPENAI_SETUP.md)）
  - 或 Google Gemini API Key（免費，推薦，詳細說明請參考 [FREE_LLM_ALTERNATIVES.md](./FREE_LLM_ALTERNATIVES.md)）

## 🚀 安裝步驟

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

建立 `.env.local` 檔案並填入以下變數：

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# LINE Bot
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret

# OpenAI (LLM)
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

### 4. 設定 LINE Webhook

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 Channel
3. 在 Webhook settings 中設定 Webhook URL：
   - 開發環境：使用 ngrok 等工具將 `http://localhost:3000/api/line/webhook` 暴露到公網
   - 生產環境：`https://your-domain.vercel.app/api/line/webhook`
4. 啟用 Webhook

## 📁 專案結構

```
hw6/
├── app/
│   ├── api/
│   │   ├── line/
│   │   │   └── webhook/
│   │   │       └── route.ts          # LINE Webhook endpoint
│   │   └── admin/
│   │       ├── conversations/       # 對話紀錄 API
│   │       └── stats/                # 統計資料 API
│   ├── admin/
│   │   └── page.tsx                  # 管理後台頁面
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── mongodb.ts                    # MongoDB 連線
│   ├── gameService.ts                # 遊戲狀態管理
│   ├── llmService.ts                 # LLM 整合服務
│   └── lineService.ts                # LINE Bot 服務
├── models/
│   ├── User.ts                       # 使用者 Model
│   └── Conversation.ts               # 對話 Model
├── types/
│   └── game.ts                       # 遊戲相關型別定義
└── package.json
```

## 🎯 遊戲流程

### 固定起始流程

1. **觸發遊戲**：使用者輸入「開始冒險」
2. **輸入名稱**：使用者輸入角色名稱
3. **選擇職業**：
   - 1️⃣ 程式法師（Coder Mage）
   - 2️⃣ 資料騎士（Data Knight）
   - 3️⃣ 簡報遊俠（Slide Ranger）
4. **開始冒險**：進入 LLM 驅動的動態劇情

### 遊戲規則

- 玩家在平行台大世界中探索
- 透過選擇選項推進劇情
- 收集道具、金錢，對抗 Bug 和錯誤訊息
- 主線進度達到 100% 時完成遊戲

## 🔧 API 端點

### LINE Webhook
- `POST /api/line/webhook` - LINE Messaging API Webhook

### 管理後台 API
- `GET /api/admin/conversations` - 取得對話紀錄列表
- `GET /api/admin/conversations/[id]` - 取得單一對話詳情
- `GET /api/admin/stats` - 取得統計資料

### 管理後台頁面
- `/admin` - 對話紀錄管理後台

## 📝 環境變數說明

| 變數名稱 | 說明 | 取得方式 |
|---------|------|---------|
| `MONGODB_URI` | MongoDB 連線字串 | MongoDB Atlas Dashboard |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Channel Access Token | LINE Developers Console |
| `LINE_CHANNEL_SECRET` | LINE Channel Secret | LINE Developers Console |
| `OPENAI_API_KEY` | OpenAI API Key | OpenAI Platform |
| `NEXT_PUBLIC_APP_URL` | 應用程式 URL | 部署後取得 |

## 🚨 錯誤處理

系統實作了完整的錯誤處理機制：

- **LLM 配額用盡**：顯示友善提示，不中斷服務
- **LLM 超時**：提供降級回應
- **外部服務失效**：使用預設回應，確保 Bot 持續運作

## 📊 管理後台功能

- 檢視所有對話紀錄
- 依使用者 ID、日期、遊戲階段篩選
- 查看統計資料（總使用者數、會話數、訊息數等）
- 檢視遊戲狀態（HP、金錢、道具、進度）

## 🎨 遊戲世界觀

- **地點**：管理學院、資工系館、總圖、椰林大道、體育館、地底城
- **怪物**：Bug、例外錯誤、Deadline 怪、規格變更之靈
- **道具**：卷軸、魔法書、資料寶石、簡報卡
- **目標**：找到「星光之心」，完成主線任務

## 📦 部署到 Vercel

1. 將專案推送到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署完成後，更新 LINE Webhook URL

## 🔒 安全性

- LINE Webhook 簽名驗證
- 環境變數不提交到版本控制
- MongoDB 連線使用 SSL

## 📄 授權

本專案為課程作業專案。

## 🤝 貢獻

歡迎提出 Issue 或 Pull Request！


# 遺失在台大地下室的秘寶 · LINE Bot RPG

一個以 Next.js + MongoDB + OpenAI 打造的 LINE 文字冒險遊戲。玩家扮演台大資管學生，在平行台大的地底城尋找「星光之心」，整個流程（角色建立、職業選擇、劇情推進、結局）都透過 LINE 對話完成，並提供管理後台供助教檢視對話紀錄。

---

## 👾 立即體驗：加入官方帳號
1. 開啟 LINE → 點擊「加入好友」  
2. 搜尋官方帳號 ID：`@624uzxgu`  
3. 加入後，在聊天室輸入 **「開始冒險」**  
4. 依照指示輸入名字、選擇職業，即可展開冒險

> TIP：如果想重玩，直接輸入「重新開始」即可重設角色。

---

## 🛠️ 管理後台怎麼看？
| 環境 | 路徑 | 說明 |
|------|------|------|
| 本機 | `http://localhost:3000/admin` | 啟動開發伺服器後即可瀏覽 |
| 部署 | `https://wp1141-6.vercel.app/admin` | Vercel 自動部署的網址 |

後台功能：
- 對話列表（可依 LINE userId、日期、遊戲階段篩選）
- 對話內容檢視（含 LLM 敘事、玩家選項、遊戲狀態）
- 基礎統計（使用者數、會話數、訊息數等）

---

## ⚙️ 快速開發指南
1. 安裝套件  
   ```bash
   npm install
   ```
2. 建立 `.env.local`（內容如下）
   ```env
   MONGODB_URI=your_mongodb_uri
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   LINE_CHANNEL_SECRET=your_line_channel_secret
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. 本機啟動與測試  
   ```bash
   npm run dev           # 啟動 Next.js
   node scripts/test-mongodb.js
   node scripts/test-openai.js
   ```
4. 設定 LINE Webhook  
   - 開發：使用 ngrok/expose 將 `http://localhost:3000/api/line/webhook` 暴露到公網  
   - 部署：`https://your-vercel-app.vercel.app/api/line/webhook`


---

## 🧱 專案結構
```
hw6/
├── app/
│   ├── api/
│   │   ├── line/webhook/route.ts     # LINE Webhook
│   │   └── admin/...                 # 後台 API
│   ├── admin/page.tsx                # 後台頁面
│   └── page.tsx                      # Landing page
├── lib/                              # MongoDB、LINE、LLM、遊戲邏輯
├── models/                           # User、Conversation
├── scripts/                          # 測試 MongoDB / OpenAI / Gemini
└── README.md
```

---

## 🧠 重要元件
| 檔案 | 職責 |
|------|------|
| `app/api/line/webhook/route.ts` | LINE 事件入口，負責流程控制、錯誤處理 |
| `lib/lineService.ts` | 封裝 LINE 回覆（文字、按鈕、進度條等） |
| `lib/gameService.ts` | 管理遊戲狀態、對話歷史、道具與進度 |
| `lib/llmService.ts` | OpenAI GPT-4o-mini 呼叫與 JSON 解析 |
| `app/admin/page.tsx` | 後台 UI，顯示對話與統計 |

---

## 🔌 技術重點
- Next.js 16 App Router + Server Actions
- Tailwind CSS v4（`@import "tailwindcss"`）
- MongoDB Atlas + Mongoose：持久化使用者、會話、遊戲狀態
- LINE Messaging API：Webhook 驗證、回覆模板訊息
- OpenAI GPT-4o-mini：生成劇情、選項與效果（timeout 與降級機制已實作）
- Vercel 部署：Fluid Compute + Serverless Functions

---

## 🧪 常用指令
| 命令 | 說明 |
|------|------|
| `npm run dev` | 開發伺服器 |
| `npm run build` / `npm run start` | 生產模式 |
| `node scripts/test-mongodb.js` | 測試 MongoDB 連線 |
| `node scripts/test-openai.js` | 測試 OpenAI 回應 |
| `node scripts/test-gemini.js` | 測試 Google Gemini（若有啟用） |

---

## 🧾 遊戲流程概述
1. 使用者輸入「開始冒險」→ 固定開場敘事 & 角色命名  
2. 選擇職業（程式法師 / 資料騎士 / 簡報遊俠）  
3. 之後每個回合皆由 LLM 依照遊戲狀態生成敘事、選項與效果  
4. HP 歸零或主線進度達 100% 會進入結局  
5. 任何 LLM 錯誤（超時、配額、格式）都會回傳純文字降級訊息，確保玩家體驗不中斷
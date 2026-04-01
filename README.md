# wp1141 — NTU Web Programming 114-1


各作業目錄內另有 `README.md`，含執行方式與較細的架構說明。

---

## 各作業一覽

### hw1 — 個人作品集網站

- **主題**：多區塊個人網站（首頁、關於、作品集、部落格、聯絡），強調版面、動畫與響應式。
- **技術棧**：HTML5、CSS3、**TypeScript**（編譯為 JS）、本地靜態伺服器（如 `python3 -m http.server`）；**無 React / 無 Node 後端**。
- **審閱可關注**：語意化標記、CSS 組織、TS 在前端的輕量使用、跨裝置版面。

### hw2 — Doodle Jump 風格跳躍遊戲

- **主題**：鍵盤控制角色跳躍、平台與敵人、計分與重新開始。
- **技術棧**：**React 18**、**Create React App**（`react-scripts`）、TypeScript。
- **審閱可關注**：遊戲狀態與 Canvas/畫面更新邏輯、鍵盤輸入、單頁互動體驗。（純前端，無獨立後端 API。）

### hw3 — K-pop 手燈電商展示與購物流程

- **主題**：商品瀏覽、搜尋與篩選、購物車、訂單與訂單歷史、收藏；資料以 CSV 載入，狀態落地 **localStorage**。
- **技術棧**：**React 18**、**Create React App**、TypeScript、**React Context**、多個自訂 **Hooks**、**MUI（Material UI）**。
- **審閱可關注**：前端狀態設計、表單與流程、元件拆分與可維護性。（同樣無後端服務。）

### hw4 — 辦公咖啡廳共享清單（地圖導向）

- **主題**：共享咖啡廳清單、地圖與列表雙向操作、Google 地點搜尋、個人到訪紀錄與願望清單；**JWT 登入註冊**。
- **技術棧**  
  - **前端**：**React**、**Vite**、TypeScript、**Tailwind CSS**、**React Router**、**Axios**、**Google Maps JavaScript API**。  
  - **後端**：**Node.js**、**Express**、TypeScript、**SQLite**（better-sqlite3）、**JWT**、**bcrypt**；後端代理 Geocoding / Places / Directions 等 Google API。
- **審閱可關注**：前後端分離、REST 設計、認證與權限邊界、第三方地圖 API 整合、環境變數與金鑰分工（Browser Key vs Server Key）。

### hw5 — PULSE 社群網站

- **主題**：類微型社群：OAuth 與自訂 UserID、發文（字數規則、連結／hashtag／mention）、按讚、轉發、遞迴留言、Feed（全部／追蹤中）、個人頁與追蹤、草稿與圖片上傳、**Pusher 即時更新**。
- **技術棧**：**Next.js 16**（App Router）、**React**、TypeScript、**Tailwind CSS**、**NextAuth.js**、**MongoDB** + **Mongoose**、**Pusher**、**Cloudinary**、部署於 **Vercel**（見該目錄 README 之公開網址）。
- **審閱可關注**：`app/api/` 路由與資料模型、`components/` 互動與列表效能、認證與 Session、即時與快取策略（若專案內有文件或註解可一併參考）。

### hw6 — LINE Bot 文字冒險 RPG + 管理後台

- **主題**：透過 LINE 對話進行的劇情遊戲（角色建立、職業、LLM 生成敘事與選項）；**`/admin` 後台**檢視對話與統計。
- **技術棧**：**Next.js 16**（App Router）、**React**、TypeScript、**Tailwind CSS v4**、**MongoDB** + **Mongoose**、**LINE Messaging API**（`@line/bot-sdk`）、**OpenAI**（如 GPT-4o-mini）、**Zod**、**Vercel**；Webhook 入口於 `app/api/line/webhook`。
- **審閱可關注**：Webhook 驗證與錯誤處理、遊戲狀態與 LLM 回應解析、降級與逾時、後台查詢與資料模型。

---

## 技術棧對照（精簡）

| 作業 | 前端 | 後端 / 執行環境 | 資料與整合 |
|------|------|-----------------|------------|
| hw1 | HTML / CSS / TS | 靜態檔 + 本機 HTTP | — |
| hw2 | CRA + React + TS | 開發用 Node（無 API） | — |
| hw3 | CRA + React + TS + MUI | 同上 | localStorage、CSV |
| hw4 | Vite + React + TS | Express + Node + TS | SQLite、Google Maps APIs、JWT |
| hw5 | Next.js + React + TS | Next（API Routes 等） | MongoDB、NextAuth、Pusher、Cloudinary |
| hw6 | Next.js + React + TS | Next（Webhook、Admin API） | MongoDB、LINE、OpenAI |

---

課程原始模板名稱曾為 `wp-repo-template-1141`；實際內容以上述各 `hwN/` 為準。

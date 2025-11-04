# PULSE 社群網站

一個使用 Next.js 建立的社群網站，支援 OAuth 登入、發文、按讚、留言和即時互動功能。

## 功能特色

### 認證系統
- ✅ OAuth 登入支援 (Google/GitHub/Facebook)
- ✅ 自訂 UserID 註冊系統
- ✅ Session 管理 (30天有效期)

### 貼文功能
- ✅ 發表貼文 (280字元限制)
- ✅ 連結自動辨識與計數 (固定23字元)
- ✅ #HashTag 和 @mention 支援 (不計入字數)
- ✅ 草稿儲存功能
- ✅ 刪除貼文 (只能刪除自己的貼文)

### 互動功能
- ✅ 按讚/取消讚
- ✅ 轉發 (Repost)
- ✅ 留言 (遞迴式留言)
- ✅ Pusher 即時更新

### 個人頁面
- ✅ 個人資料展示
- ✅ 編輯個人資料 (姓名、簡介)
- ✅ 追蹤/取消追蹤用戶
- ✅ 顯示個人貼文和按讚的貼文

### Feed 動態
- ✅ All - 顯示所有貼文
- ✅ Following - 顯示追蹤用戶的貼文
- ✅ 按時間排序 (最新到最舊)

## 技術棧

- **前端框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **認證**: NextAuth.js (OAuth)
- **資料庫**: MongoDB + Mongoose
- **即時通訊**: Pusher
- **部署**: Vercel

## 開始使用

### 環境需求

- Node.js 18+
- MongoDB (本機或雲端)
- Pusher 帳號
- OAuth Provider 憑證 (Google/GitHub/Facebook)

### 安裝步驟

1. 複製環境變數範例檔案：
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. 填寫 `.env.local` 中的所有必要環境變數

3. 安裝相依套件：
\`\`\`bash
npm install
\`\`\`

4. 啟動開發伺服器：
\`\`\`bash
npm run dev
\`\`\`

5. 在瀏覽器開啟 http://localhost:3000

### 環境變數設定

請參考 `.env.example` 檔案，需要設定以下環境變數：

- MongoDB 連線字串
- NextAuth URL 和 Secret
- Google OAuth 憑證
- GitHub OAuth 憑證
- Facebook OAuth 憑證
- Pusher 憑證

## 部署到 Vercel

1. 在 Vercel 建立新專案並連結 GitHub repository

2. 在 Vercel 專案設定中加入所有環境變數

3. 部署！Vercel 會自動偵測 Next.js 並進行建置

## 專案結構

\`\`\`
hw5/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # NextAuth 認證
│   │   ├── posts/        # 貼文相關 API
│   │   ├── drafts/       # 草稿相關 API
│   │   └── users/        # 用戶相關 API
│   ├── auth/             # 認證頁面
│   ├── profile/          # 個人頁面
│   ├── post/             # 單篇貼文頁面
│   └── page.tsx          # 首頁
├── components/            # React 組件
├── lib/                   # 工具函式
├── models/               # MongoDB Models
├── types/                # TypeScript 型別定義
└── public/               # 靜態資源
\`\`\`

## UserID 規則

- 長度：3-20 個字元
- 允許字元：字母 (a-z, A-Z)、數字 (0-9)、底線 (_)
- 每個 UserID 在系統中必須唯一
- 同一個人使用不同 OAuth provider 會註冊成不同的 UserID

## 字數計算規則

- 一般文字：每個字元計為 1
- 連結：不論長度，固定計為 23 字元
- #HashTag：不計入字數
- @mention：不計入字數
- 上限：280 字元

## 開發者

Hannah - NTU MIS

## 授權

MIT

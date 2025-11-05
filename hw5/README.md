# PULSE 社群網站

一個使用 Next.js 建立的社群網站，支援 OAuth 登入、發文、按讚、留言和即時互動功能。

## 🌐 線上體驗

**您可以直接訪問線上版本，無需本地安裝：**

👉 **[https://wp1141-1.vercel.app](https://wp1141-1.vercel.app)**

登入方式：
- 輸入您的 UserID 進行登入
- 或選擇 OAuth 提供者（Google/GitHub/Facebook）進行註冊

## 功能特色

### 認證系統
- ✅ OAuth 登入支援 (Google/GitHub/Facebook)
- ✅ 自訂 UserID 註冊系統
- ✅ Session 管理 (JWT-based, 10分鐘有效期)

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

### 🚀 快速開始

**方式一：線上體驗（推薦）**

直接訪問 [https://wp1141-1.vercel.app](https://wp1141-1.vercel.app) 即可使用，無需任何設定！

**方式二：本地開發**

如果您想要在本地環境運行專案，請參考下方的安裝步驟。

---

### 環境需求

- Node.js 18+
- MongoDB (本機或雲端)
- Pusher 帳號
- OAuth Provider 憑證 (Google/GitHub/Facebook)

### 安裝步驟

1. 建立 `.env.local` 檔案並填入所有必要的環境變數（見下方環境變數設定章節）

2. 安裝相依套件：
\`\`\`bash
npm install
\`\`\`

3. 啟動開發伺服器：
\`\`\`bash
npm run dev
\`\`\`

4. 在瀏覽器開啟 http://localhost:3000

### 環境變數設定

請在 `.env.local` 檔案中設定以下環境變數：

#### 資料庫
- `MONGODB_URI` - MongoDB 連線字串

#### NextAuth 認證
- `NEXTAUTH_URL` - 應用程式 URL (開發環境: `http://localhost:3000`, 生產環境: 您的 Vercel URL)
- `NEXTAUTH_SECRET` - NextAuth 密鑰 (可使用 `openssl rand -base64 32` 生成)

#### OAuth 提供者
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GITHUB_CLIENT_ID` - GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth Client Secret
- `FACEBOOK_CLIENT_ID` - Facebook OAuth App ID
- `FACEBOOK_CLIENT_SECRET` - Facebook OAuth App Secret

#### Pusher 即時通訊
- `PUSHER_APP_ID` - Pusher App ID
- `PUSHER_KEY` - Pusher Key
- `PUSHER_SECRET` - Pusher Secret
- `PUSHER_CLUSTER` - Pusher Cluster (例如: `ap1`)
- `NEXT_PUBLIC_PUSHER_KEY` - Pusher Public Key (與 PUSHER_KEY 相同)
- `NEXT_PUBLIC_PUSHER_CLUSTER` - Pusher Public Cluster (與 PUSHER_CLUSTER 相同)

#### Cloudinary 圖片上傳
- `CLOUDINARY_CLOUD_NAME` - Cloudinary Cloud Name
- `CLOUDINARY_API_KEY` - Cloudinary API Key
- `CLOUDINARY_API_SECRET` - Cloudinary API Secret

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
│   │   ├── users/        # 用戶相關 API
│   │   └── upload/       # 圖片上傳 API
│   ├── auth/             # 認證頁面
│   ├── profile/          # 個人頁面
│   ├── post/             # 單篇貼文頁面
│   └── page.tsx          # 首頁
├── components/            # React 組件
├── lib/                   # 工具函式 (MongoDB, Pusher, Cloudinary)
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

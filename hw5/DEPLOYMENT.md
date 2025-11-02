# 部署指南

本文件說明如何將此專案部署到 Vercel。

## 前置準備

### 1. MongoDB Atlas 設定

1. 註冊 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 建立新的 Cluster
3. 建立資料庫用戶（記住帳號密碼）
4. 設定網路訪問權限（允許從任何 IP 連線：0.0.0.0/0）
5. 取得連線字串（Connection String）

連線字串格式：
\`\`\`
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority
\`\`\`

### 2. OAuth Providers 設定

#### Google OAuth
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI：
   - 本機開發：`http://localhost:3000/api/auth/callback/google`
   - 正式環境：`https://your-domain.vercel.app/api/auth/callback/google`
6. 取得 Client ID 和 Client Secret

#### GitHub OAuth
1. 前往 GitHub Settings > Developer settings > OAuth Apps
2. 建立新的 OAuth App
3. 設定 Authorization callback URL：
   - 本機開發：`http://localhost:3000/api/auth/callback/github`
   - 正式環境：`https://your-domain.vercel.app/api/auth/callback/github`
4. 取得 Client ID 和 Client Secret

#### Facebook OAuth
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Facebook Login 產品
4. 設定有效的 OAuth 重新導向 URI：
   - 本機開發：`http://localhost:3000/api/auth/callback/facebook`
   - 正式環境：`https://your-domain.vercel.app/api/auth/callback/facebook`
5. 取得 App ID 和 App Secret

### 3. Pusher 設定

1. 註冊 [Pusher](https://pusher.com/)
2. 建立新的 Channels App
3. 選擇適合的 Cluster（建議選擇離用戶最近的）
4. 取得憑證：
   - App ID
   - Key
   - Secret
   - Cluster

### 4. NextAuth Secret

產生一個隨機的 secret：

\`\`\`bash
openssl rand -base64 32
\`\`\`

## 部署到 Vercel

### 步驟 1: 準備專案

1. 確保專案已經推送到 GitHub repository

2. 確認 `.gitignore` 包含：
\`\`\`
.env*.local
.env
node_modules
.next
\`\`\`

### 步驟 2: 在 Vercel 建立專案

1. 前往 [Vercel](https://vercel.com/)
2. 點擊 "New Project"
3. 導入您的 GitHub repository
4. Vercel 會自動偵測 Next.js 專案

### 步驟 3: 設定環境變數

在 Vercel 專案的 Settings > Environment Variables 中，新增以下環境變數：

\`\`\`
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter-clone

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Pusher
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=your-pusher-cluster

# Pusher (Public)
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=your-pusher-cluster
\`\`\`

**重要提示**：
- 所有環境變數都設定為 Production, Preview, Development
- `NEXT_PUBLIC_*` 開頭的變數會暴露給客戶端，只放入公開資訊

### 步驟 4: 部署

1. 點擊 "Deploy"
2. Vercel 會自動建置並部署您的應用程式
3. 部署完成後，會取得一個 `.vercel.app` 網域

### 步驟 5: 更新 OAuth 設定

部署完成後，記得回到各 OAuth Provider 設定，新增正式環境的 callback URL：

- Google: `https://your-app.vercel.app/api/auth/callback/google`
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`
- Facebook: `https://your-app.vercel.app/api/auth/callback/facebook`

同時更新 `NEXTAUTH_URL` 環境變數為正式網域。

## 本機開發

1. 複製 `.env.example` 為 `.env.local`
2. 填入所有必要的環境變數
3. 執行 `npm install`
4. 執行 `npm run dev`
5. 開啟 http://localhost:3000

## 測試部署

部署完成後，請測試以下功能：

- [ ] OAuth 登入（Google/GitHub/Facebook）
- [ ] 註冊新用戶（設定 UserID）
- [ ] 發表貼文
- [ ] 按讚/取消讚
- [ ] 留言
- [ ] 轉發
- [ ] 編輯個人資料
- [ ] 追蹤/取消追蹤
- [ ] 即時更新（開啟兩個瀏覽器視窗測試）

## 常見問題

### MongoDB 連線失敗
- 檢查連線字串是否正確
- 確認網路訪問權限設定為允許所有 IP (0.0.0.0/0)
- 檢查用戶帳號密碼是否正確

### OAuth 登入失敗
- 確認 callback URL 設定正確
- 檢查 Client ID 和 Secret 是否正確
- 確認 `NEXTAUTH_URL` 設定正確

### Pusher 即時更新不work
- 檢查 Pusher 憑證是否正確
- 確認 `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 有設定
- 檢查 Pusher Dashboard 是否有收到事件

### 部署後頁面空白
- 檢查 Vercel 的 build logs
- 確認所有環境變數都已設定
- 檢查 MongoDB 連線是否正常

## 自訂網域

如果要使用自訂網域：

1. 在 Vercel 專案的 Settings > Domains 新增網域
2. 按照指示設定 DNS 記錄
3. 更新所有 OAuth Provider 的 callback URL
4. 更新 `NEXTAUTH_URL` 環境變數

## 監控與維護

- 在 Vercel Dashboard 可以查看：
  - 部署歷史
  - 流量分析
  - 錯誤日誌
  - 效能指標

- 在 MongoDB Atlas 可以監控：
  - 資料庫使用量
  - 連線數
  - 查詢效能

- 在 Pusher Dashboard 可以查看：
  - 連線數
  - 訊息數量
  - 頻道活動

## 擴充功能建議

未來可以考慮新增：
- 圖片/影片上傳（使用 Cloudinary 或 AWS S3）
- 通知系統
- 私訊功能
- 搜尋功能
- 趨勢標籤
- 用戶驗證徽章
- Dark Mode

祝部署順利！🚀


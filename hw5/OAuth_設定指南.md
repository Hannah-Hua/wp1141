# OAuth 設定指南

是的！和 Google Maps API 類似，您需要為每個 OAuth 提供商進行前置設定。

## 📋 三個 OAuth 提供商設定步驟

### 1️⃣ Google OAuth

**步驟：**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（或選擇現有專案）
3. 在左側選單找到「API 和服務」→「OAuth 同意畫面」
   - 選擇「外部」用戶類型
   - 填寫應用程式名稱、支援電子郵件
   - 加入測試使用者（您的 email）
4. 前往「憑證」→「建立憑證」→「OAuth 用戶端 ID」
   - 應用程式類型：「網頁應用程式」
   - 授權重新導向 URI：
     - 本機：`http://localhost:3000/api/auth/callback/google`
     - 正式：`https://your-app.vercel.app/api/auth/callback/google`
5. 複製「用戶端 ID 332415413803-mh9eh7brivij54fk8d30278jebk9hiut.apps.googleusercontent.com」和「用戶端密鑰 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」

**填入 .env.local：**
```
GOOGLE_CLIENT_ID=你的-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的-client-secret
```

---

### 2️⃣ GitHub OAuth

**步驟：**
1. 登入 GitHub → 右上角頭像 → Settings
2. 左側選單最下方「Developer settings」
3. 點選「OAuth Apps」→「New OAuth App」
4. 填寫資訊：
   - Application name：`X Twitter Clone`（自訂）
   - Homepage URL：`http://localhost:3000`（本機測試用）
   - Authorization callback URL：`http://localhost:3000/api/auth/callback/github`
5. 「Register application」
6. 複製「Client ID」
7. 點選「Generate a new client secret」並複製

**注意：** 正式部署時需要再建立一個 OAuth App，使用正式網址

**填入 .env.local：**
```
GITHUB_CLIENT_ID=你的-github-client-id
GITHUB_CLIENT_SECRET=你的-github-client-secret
```

---

### 3️⃣ Facebook OAuth

**步驟：**
1. 前往 [Facebook for Developers](https://developers.facebook.com/)
2. 右上角「我的應用程式」→「建立應用程式」
3. 選擇「消費者」類型
4. 填寫應用程式名稱和電子郵件
5. 在應用程式儀表板：
   - 左側「設定」→「基本資料」
   - 複製「應用程式編號」（App ID）和「應用程式密鑰」（App Secret）
6. 左側「新增產品」→ 選擇「Facebook 登入」→「設定」
7. 在「有效的 OAuth 重新導向 URI」加入：
   - `http://localhost:3000/api/auth/callback/facebook`
   - `https://your-app.vercel.app/api/auth/callback/facebook`

**填入 .env.local：**
```
FACEBOOK_CLIENT_ID=你的-facebook-app-id
FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret
```

---

## 📝 完整的 .env.local 範例

```bash
# MongoDB（可用 MongoDB Atlas 免費版）
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter-clone

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# GitHub OAuth
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Facebook OAuth
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx

# Pusher（到 https://pusher.com 註冊）
PUSHER_APP_ID=xxx
PUSHER_KEY=xxx
PUSHER_SECRET=xxx
PUSHER_CLUSTER=ap3
NEXT_PUBLIC_PUSHER_KEY=xxx
NEXT_PUBLIC_PUSHER_CLUSTER=ap3
```

---

## 🎯 快速測試建議

**最簡單的測試順序：**
1. **先設定 GitHub**（最簡單，不需要驗證網域）
2. **再設定 Google**
3. **最後設定 Facebook**（審核較嚴格）

可以先只設定一個 OAuth 來測試功能，其他之後再加！

---

## ⚙️ 其他必要設定

### MongoDB Atlas（資料庫）
1. 註冊 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 建立免費 Cluster
3. 「Database Access」→ 建立用戶（記住帳密）
4. 「Network Access」→ 允許所有 IP：`0.0.0.0/0`
5. 「Connect」→ 複製連接字串

### Pusher（即時通訊）
1. 註冊 [Pusher](https://pusher.com/)
2. 建立新的 Channels app
3. 選擇 Cluster（建議選 ap3 - Asia Pacific）
4. 複製所有憑證

### NextAuth Secret
```bash
# macOS/Linux
openssl rand -base64 32
```

---

## 🚀 測試步驟

設定完成後：

```bash
cd hw5
npm install
npm run dev
```

開啟 http://localhost:3000
→ 應該會自動導向登入頁面
→ 選擇您已設定的 OAuth 提供商
→ 第一次登入會要求設定 UserID

---

## ⚠️ 常見問題

**Q: 為什麼需要設定這麼多東西？**
A: OAuth 需要驗證您的應用程式是可信任的，所以每個提供商都要求註冊應用程式。

**Q: 測試階段一定要設定三個嗎？**
A: 不用！可以先只設定 GitHub（最簡單），其他之後再加。

**Q: 部署到 Vercel 後還需要改什麼？**
A: 需要在每個 OAuth 提供商的設定中，加入正式網址的 callback URL。

**Q: NextAuth Secret 是什麼？**
A: 用來加密 JWT token 的密鑰，必須是隨機且保密的字串。

---

## 📚 相關文件

- 完整部署指南：`DEPLOYMENT.md`
- 專案說明：`README.md`
- NextAuth v5 文件：https://authjs.dev/

有問題隨時問我！🙌


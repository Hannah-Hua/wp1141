# Vercel 部署步驟指南

## 📋 部署前檢查清單

### ✅ 步驟 1: 推送代碼到 GitHub
```bash
git push origin main
```

### ✅ 步驟 2: 在 Vercel 創建專案

1. **登入 Vercel**
   - 前往 https://vercel.com
   - 使用 GitHub 帳號登入

2. **建立新專案**
   - 點擊 "New Project" 或 "Add New..." → "Project"
   - 在 GitHub 整合中找到 `wp1141` repository
   - 選擇 `hw5` 目錄（如果 repository 包含多個專案）

3. **專案設定**
   - Framework Preset: Next.js（應該自動偵測）
   - Root Directory: `hw5`（如果需要）
   - Build Command: `npm run build`（預設）
   - Output Directory: `.next`（預設）
   - Install Command: `npm install`（預設）

### ✅ 步驟 3: 設定環境變數

在 Vercel Dashboard 的專案 Settings > Environment Variables 中，新增以下所有環境變數：

#### MongoDB
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority
```

#### NextAuth
```
NEXTAUTH_URL=https://your-app.vercel.app
```
（第一次部署後會獲得網址，可以先填 `https://your-app.vercel.app`，部署後再更新）

```
NEXTAUTH_SECRET=你的隨機密鑰
```
（產生方式：`openssl rand -base64 32`）

#### Google OAuth
```
GOOGLE_CLIENT_ID=你的-google-client-id
GOOGLE_CLIENT_SECRET=你的-google-client-secret
```

#### GitHub OAuth
```
GITHUB_CLIENT_ID=你的-github-client-id
GITHUB_CLIENT_SECRET=你的-github-client-secret
```

#### Facebook OAuth
```
FACEBOOK_CLIENT_ID=你的-facebook-app-id
FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret
```

#### Pusher（伺服器端）
```
PUSHER_APP_ID=你的-pusher-app-id
PUSHER_KEY=你的-pusher-key
PUSHER_SECRET=你的-pusher-secret
PUSHER_CLUSTER=你的-pusher-cluster
```

#### Pusher（客戶端 - 公開變數）
```
NEXT_PUBLIC_PUSHER_KEY=你的-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=你的-pusher-cluster
```

**重要提示**：
- 每個環境變數都要設定適用於 **Production, Preview, Development** 三個環境
- `NEXT_PUBLIC_*` 開頭的變數會暴露給客戶端，確保只放入公開資訊

### ✅ 步驟 4: 初次部署

1. **點擊 "Deploy"**
   - Vercel 會開始建置專案
   - 可以在 Deployments 頁面查看建置進度

2. **等待建置完成**
   - 通常需要 1-3 分鐘
   - 建置成功後會獲得一個 `.vercel.app` 網域

3. **記錄部署網址**
   - 例如：`https://hw5-xxx.vercel.app`
   - 這個網址稍後要用來更新 OAuth callback URLs

### ✅ 步驟 5: 更新 OAuth Provider 設定

部署完成後，取得正式網址，然後更新各 OAuth Provider 的 callback URL：

#### Google OAuth
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 前往 APIs & Services > Credentials
4. 編輯你的 OAuth 2.0 Client ID
5. 在 "Authorized redirect URIs" 中新增：
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. 儲存

#### GitHub OAuth
1. 前往 GitHub Settings > Developer settings > OAuth Apps
2. 編輯你的 OAuth App
3. 在 "Authorization callback URL" 中新增：
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```
4. 儲存

#### Facebook OAuth
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 選擇你的應用程式
3. 前往 Settings > Basic
4. 在 "Valid OAuth Redirect URIs" 中新增：
   ```
   https://your-app.vercel.app/api/auth/callback/facebook
   ```
5. 儲存

### ✅ 步驟 6: 更新 NEXTAUTH_URL

1. 回到 Vercel Dashboard > Settings > Environment Variables
2. 找到 `NEXTAUTH_URL`
3. 更新為你的實際部署網址：
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
4. 儲存後會自動觸發重新部署

### ✅ 步驟 7: 驗證部署

測試以下功能確保一切正常：

- [ ] 首頁可以正常載入
- [ ] OAuth 登入（至少測試一種：Google/GitHub/Facebook）
- [ ] 註冊新用戶（設定 UserID）
- [ ] 發表貼文
- [ ] 按讚/取消讚
- [ ] 留言功能
- [ ] 轉發功能
- [ ] 編輯個人資料
- [ ] 追蹤/取消追蹤用戶
- [ ] 查看個人貼文和按讚的貼文
- [ ] @mention 連結可點擊並導航
- [ ] 即時更新（開啟兩個瀏覽器視窗測試）

## 🔄 後續更新

### 自動部署
- 每次 `git push origin main` 後，Vercel 會自動觸發部署
- 可以在 Vercel Dashboard > Deployments 查看部署歷史

### 手動部署
- 在 Vercel Dashboard 可以點擊 "Redeploy" 手動觸發部署
- 可以選擇重新部署特定的版本

### 查看日誌
- 在 Vercel Dashboard > Deployments > 選擇特定部署 > Logs
- 可以查看建置和運行時期的錯誤

## ❌ 常見問題排解

### 建置失敗
- 檢查 Vercel Dashboard 的建置日誌
- 確認所有環境變數都已正確設定
- 確認 `package.json` 中的依賴都正確

### OAuth 登入失敗
- 確認 callback URL 已正確設定在各 OAuth Provider
- 確認 `NEXTAUTH_URL` 環境變數正確
- 確認 OAuth Client ID 和 Secret 正確

### MongoDB 連線失敗
- 確認 MongoDB Atlas 的網路訪問權限設定為 `0.0.0.0/0`
- 確認連線字串正確
- 確認資料庫用戶帳號密碼正確

### Pusher 即時更新不運作
- 確認所有 Pusher 環境變數都已設定
- 確認 `NEXT_PUBLIC_PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 有設定
- 檢查 Pusher Dashboard 是否有收到事件

### 頁面空白或錯誤
- 檢查瀏覽器開發者工具的 Console 和 Network 標籤
- 檢查 Vercel 的運行時日誌
- 確認所有環境變數都已設定且正確

## 📝 注意事項

1. **環境變數安全性**
   - 不要在代碼中硬編碼敏感資訊
   - 所有敏感資訊都應透過環境變數設定

2. **建置時間**
   - 首次部署可能需要較長時間（3-5 分鐘）
   - 後續更新通常較快（1-2 分鐘）

3. **部署限制**
   - Vercel 免費版有建置時間和頻寬限制
   - 如果超過限制，考慮升級方案

4. **自動部署設定**
   - 預設只有 `main` 分支會觸發 Production 部署
   - 其他分支會產生 Preview 部署

## 🎉 完成！

部署成功後，你的應用程式就可以在網際網路上使用了！

如果有任何問題，請檢查：
1. Vercel Dashboard 的部署日誌
2. 瀏覽器的開發者工具
3. 各服務（MongoDB, OAuth Providers, Pusher）的 Dashboard

祝你部署順利！🚀


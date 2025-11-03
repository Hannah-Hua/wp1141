# Vercel OAuth Callback URL 設定指南

## ⚠️ 錯誤訊息
```
The redirect_uri is not associated with this application.
```

這個錯誤表示 OAuth Provider 還沒有設定 Vercel 的 callback URL。

## 📋 設定步驟

### 步驟 1: 確認你的 Vercel 部署網址

在 Vercel Dashboard：
1. 點擊專案 `wp1141`
2. 點擊 "Domains" 按鈕或前往 Settings > Domains
3. 記錄你的部署網址，格式類似：
   ```
   https://wp1141-gamma.vercel.app
   ```
   （你的實際網址可能不同）

### 步驟 2: 設定 Vercel 環境變數

1. 在 Vercel Dashboard，點擊 Settings > Environment Variables
2. 設定 `NEXTAUTH_URL`：
   ```
   NEXTAUTH_URL=https://你的-vercel-網址.vercel.app
   ```
3. 選擇所有環境（Production、Preview、Development）
4. 儲存

### 步驟 3: 更新 OAuth Provider 的 Callback URLs

根據你使用的 OAuth Provider，執行對應設定：

---

## 🔵 Google OAuth

### 設定步驟：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 前往 **APIs & Services** > **Credentials**
4. 找到你的 OAuth 2.0 Client ID，點擊編輯（鉛筆圖示）
5. 在 **Authorized redirect URIs** 區域，點擊 **+ ADD URI**
6. 新增以下 URL：
   ```
   https://你的-vercel-網址.vercel.app/api/auth/callback/google
   ```
   例如：
   ```
   https://wp1141-gamma.vercel.app/api/auth/callback/google
   ```
7. 點擊 **SAVE**

---

## 🟢 GitHub OAuth

### 設定步驟：
1. 前往 GitHub Settings > [Developer settings](https://github.com/settings/developers)
2. 點擊 **OAuth Apps**
3. 找到你的 OAuth App，點擊編輯
4. 在 **Authorization callback URL** 欄位：
   - 保留原本的 `http://localhost:3000/api/auth/callback/github`
   - 新增一行：
   ```
   https://你的-vercel-網址.vercel.app/api/auth/callback/github
   ```
   例如：
   ```
   https://wp1141-gamma.vercel.app/api/auth/callback/github
   ```
5. 點擊 **Update application**

---

## 🔵 Facebook OAuth

### 設定步驟：
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 選擇你的應用程式
3. 前往 **Settings** > **Basic**
4. 在 **Valid OAuth Redirect URIs** 區域：
   - 保留原本的 `http://localhost:3000/api/auth/callback/facebook`
   - 點擊 **+ Add Platform**（如果需要的話）
   - 新增：
   ```
   https://你的-vercel-網址.vercel.app/api/auth/callback/facebook
   ```
   例如：
   ```
   https://wp1141-gamma.vercel.app/api/auth/callback/facebook
   ```
5. 點擊 **Save Changes**

---

## ✅ 驗證設定

設定完成後：

1. **等待 1-2 分鐘**（讓 OAuth Provider 更新設定）

2. **確認 Vercel 環境變數**：
   - `NEXTAUTH_URL` 已設定為你的 Vercel 網址
   - 所有 OAuth 的 Client ID 和 Secret 都已設定

3. **重新部署**（如果需要）：
   - 在 Vercel Dashboard > Deployments
   - 找到最新的部署
   - 點擊 **"..."** > **Redeploy**

4. **測試登入**：
   - 訪問你的 Vercel 網址
   - 嘗試使用 OAuth 登入
   - 應該不會再看到 redirect_uri 錯誤

---

## 📝 注意事項

- **本機開發 vs 正式環境**：可以同時保留兩個 callback URL：
  - `http://localhost:3000/api/auth/callback/...`（本機開發用）
  - `https://你的-vercel-網址.vercel.app/api/auth/callback/...`（正式環境用）

- **自訂網域**：如果之後設定自訂網域，記得也要新增該網域的 callback URL

- **Facebook 特別注意**：
  - Facebook App 在開發模式下，只有測試用戶可以登入
  - 需要提交審核才能讓所有用戶使用

---

## 🆘 如果還是失敗

1. 確認 `NEXTAUTH_URL` 環境變數設定正確
2. 確認 callback URL 格式完全正確（包含 `https://` 和路徑）
3. 確認 OAuth Client ID 和 Secret 在 Vercel 環境變數中設定正確
4. 清除瀏覽器快取並重新嘗試
5. 檢查 Vercel 的 Logs 查看詳細錯誤訊息


# OAuth 登入錯誤排查指南

## ❌ 常見錯誤

### GitHub 錯誤
```
The redirect_uri is not associated with this application.
```

### Google 錯誤
```
400. 發生錯誤。
伺服器無法處理格式錯誤的要求
```

---

## 🔍 完整排查步驟

### 步驟 1: 確認你的 Vercel 部署網址

**非常重要**：請告訴我你的實際 Vercel 部署網址是什麼？

取得方式：
1. Vercel Dashboard > 專案 `wp1141`
2. 點擊 "Domains" 按鈕
3. 或前往 Settings > Domains
4. 記錄完整的網址（例如：`https://wp1141-gamma.vercel.app`）

---

### 步驟 2: 確認 Vercel 環境變數設定

在 Vercel Dashboard > Settings > Environment Variables，確認：

#### ✅ NEXTAUTH_URL
- **必須完全匹配**你的 Vercel 部署網址
- 格式：`https://你的-網址.vercel.app`（**不要**有 trailing slash `/`）
- 例如：`https://wp1141-gamma.vercel.app`
- ❌ 錯誤：`https://wp1141-gamma.vercel.app/`（多了斜線）
- ✅ 正確：`https://wp1141-gamma.vercel.app`

#### ✅ OAuth 憑證
確認以下變數都已設定：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

---

### 步驟 3: 確認 GitHub OAuth App 設定

1. 前往 [GitHub OAuth Apps](https://github.com/settings/developers)
2. 找到你的 OAuth App，點擊編輯
3. 檢查 **Authorization callback URL** 欄位

**必須包含**（每行一個）：
```
http://localhost:3000/api/auth/callback/github
https://你的-vercel-網址.vercel.app/api/auth/callback/github
```

**重要檢查點**：
- ✅ URL 必須完全正確（大小寫敏感）
- ✅ 必須使用 `https://`（不是 `http://`）
- ✅ 必須包含完整路徑 `/api/auth/callback/github`
- ✅ 沒有 trailing slash
- ❌ 不要有多餘的空格或換行

**範例（正確）**：
```
https://wp1141-gamma.vercel.app/api/auth/callback/github
```

**範例（錯誤）**：
```
https://wp1141-gamma.vercel.app/api/auth/callback/github/
https://wp1141-gamma.vercel.app/api/auth/callback/github 
https://wp1141-Gamma.vercel.app/api/auth/callback/github
```

4. 點擊 **Update application** 儲存

---

### 步驟 4: 確認 Google OAuth 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 前往 **APIs & Services** > **Credentials**
4. 找到你的 OAuth 2.0 Client ID，點擊編輯（鉛筆圖示）
5. 檢查 **Authorized redirect URIs** 區域

**必須包含**（每行一個）：
```
http://localhost:3000/api/auth/callback/google
https://你的-vercel-網址.vercel.app/api/auth/callback/google
```

**重要檢查點**：
- ✅ URL 必須完全正確（大小寫敏感）
- ✅ 必須使用 `https://`（Vercel 使用 HTTPS）
- ✅ 必須包含完整路徑 `/api/auth/callback/google`
- ✅ 沒有 trailing slash
- ✅ 每行一個 URL（不要用逗號分隔）

**範例（正確）**：
```
https://wp1141-gamma.vercel.app/api/auth/callback/google
```

**範例（錯誤）**：
```
https://wp1141-gamma.vercel.app/api/auth/callback/google/
https://wp1141-gamma.vercel.app/api/auth/callback/Google
```

6. 點擊 **SAVE** 儲存

---

### 步驟 5: 確認環境變數已生效

**重要**：修改環境變數後，必須重新部署才能生效！

1. 在 Vercel Dashboard > Settings > Environment Variables
2. 確認所有變數都已儲存
3. 前往 **Deployments** 標籤頁
4. 找到最新的部署，點擊 **"..."** → **Redeploy**
5. 等待部署完成

---

### 步驟 6: 清除快取並測試

1. **清除瀏覽器快取**
   - Chrome/Edge: `Cmd+Shift+Delete` (Mac) 或 `Ctrl+Shift+Delete` (Windows)
   - 選擇清除快取和 Cookie

2. **使用無痕模式測試**
   - 開啟無痕視窗
   - 訪問你的 Vercel 網址
   - 嘗試登入

3. **檢查 Vercel Logs**
   - 在 Vercel Dashboard > Logs
   - 查看是否有錯誤訊息

---

## 🐛 常見問題

### 問題 1: 環境變數設定後沒有重新部署

**解決方案**：
- 修改環境變數後，必須手動觸發 Redeploy
- 環境變數只在新的部署中生效

### 問題 2: Callback URL 格式錯誤

**檢查**：
- 是否有 trailing slash `/`
- 是否使用正確的協議（`https://` 不是 `http://`）
- 大小寫是否正確
- 是否有空格或特殊字符

### 問題 3: NEXTAUTH_URL 與實際網址不匹配

**檢查**：
- `NEXTAUTH_URL` 必須完全匹配你的 Vercel 部署網址
- 如果有多個網域，確保使用正確的 Production 網域

### 問題 4: OAuth Provider 設定尚未生效

**解決方案**：
- 等待 1-2 分鐘讓設定生效
- 重新整理頁面
- 清除瀏覽器快取

---

## 📝 檢查清單

請逐一確認：

- [ ] 已取得正確的 Vercel 部署網址
- [ ] `NEXTAUTH_URL` 環境變數已設定為 Vercel 網址（無 trailing slash）
- [ ] GitHub OAuth App 的 callback URL 已新增 Vercel 網址
- [ ] Google OAuth 的 redirect URI 已新增 Vercel 網址
- [ ] 所有 OAuth 憑證（Client ID 和 Secret）都已設定在 Vercel 環境變數中
- [ ] 修改環境變數後已重新部署
- [ ] 已清除瀏覽器快取
- [ ] 已等待 1-2 分鐘讓 OAuth Provider 設定生效

---

## 🆘 如果還是失敗

請提供以下資訊：
1. 你的 Vercel 部署網址（完整 URL）
2. 你在 GitHub OAuth App 設定中看到的 callback URL（截圖或文字）
3. 你在 Google OAuth 設定中看到的 redirect URI（截圖或文字）
4. Vercel 環境變數中的 `NEXTAUTH_URL` 值
5. Vercel Logs 中的錯誤訊息（如果有）

這樣我可以更精確地幫你找出問題！


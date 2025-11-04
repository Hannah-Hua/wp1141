# Facebook OAuth 完整設定指南

本指南將協助您從頭開始完成 Facebook OAuth 的設定。

## 📋 前置準備

在開始之前，請確保您有：
- ✅ Facebook 帳號
- ✅ 可以訪問 Facebook Developers 平台
- ✅ 專案已經安裝 NextAuth（已確認 ✅）

---

## 🚀 步驟 1: 建立 Facebook 應用程式

### 1.1 前往 Facebook Developers

1. 開啟瀏覽器，前往 [Facebook for Developers](https://developers.facebook.com/)
2. 使用您的 Facebook 帳號登入

### 1.2 建立應用程式

1. 點擊右上角的 **「我的應用程式」** 下拉選單
2. 選擇 **「建立應用程式」**
3. 在彈出的視窗中：
   - **選擇應用程式類型**：選擇 **「消費者」**（Consumer）
   - 點擊 **「下一步」**
4. 填寫應用程式資訊：
   - **應用程式名稱**：例如 `X Twitter Clone` 或您想要的應用程式名稱
   - **應用程式聯絡電子郵件**：輸入您的電子郵件
   - **應用程式用途**：選擇 **「商業用途」** 或 **「其他」**
   - 點擊 **「建立應用程式」**

---

## 🔑 步驟 2: 取得應用程式憑證

### 2.1 查看基本資料

1. 建立應用程式後，您會看到應用程式儀表板
2. 在左側選單中，點擊 **「設定」** → **「基本資料」**
3. 您會看到：
   - **應用程式編號**（App ID）- 這就是您的 `FACEBOOK_CLIENT_ID`
   - **應用程式密鑰**（App Secret）- 點擊 **「顯示」** 按鈕來查看（這就是您的 `FACEBOOK_CLIENT_SECRET`）

⚠️ **重要**：請將這兩個值複製下來，稍後會用到！

---

## 🔐 步驟 3: 新增 Facebook 登入產品

### 3.1 新增產品

1. 在左側選單中，點擊 **「新增產品」** 或 **「產品」** 標籤
2. 找到 **「Facebook 登入」**，點擊右側的 **「設定」** 按鈕
3. 系統會自動將 Facebook 登入產品新增到您的應用程式

### 3.2 設定有效的 OAuth 重新導向 URI

1. 在左側選單中，點擊 **「Facebook 登入」** → **「設定」**
2. 找到 **「有效的 OAuth 重新導向 URI」** 區塊
3. 點擊 **「新增 URI」** 或直接在欄位中輸入以下 URI（每行一個）：

```
http://localhost:3000/api/auth/callback/facebook
```

4. 如果您已經有 Vercel 部署網址，也一併加入：

```
https://your-app.vercel.app/api/auth/callback/facebook
```

5. 點擊 **「儲存變更」**

⚠️ **重要檢查點**：
- ✅ 使用 `http://` 用於本機開發（localhost）
- ✅ 使用 `https://` 用於正式環境（Vercel）
- ✅ URL 必須完全正確，沒有 trailing slash `/`
- ✅ 路徑必須是 `/api/auth/callback/facebook`

---

## 👤 步驟 4: 完成使用案例設定

### 4.1 設定使用案例

Facebook 會要求您完成使用案例設定（在儀表板中會顯示為「必要動作」）：

1. 在應用程式儀表板中，找到 **「使用案例」** 或 **「設定使用案例」** 的提示
2. 點擊 **「開始」** 或 **「設定」**
3. 選擇使用案例類型：
   - 選擇 **「自訂使用 Facebook 登入以驗證用戶並索取資料的使用案例」**
4. 填寫使用案例資訊：
   - **使用案例名稱**：例如 `User Login` 或 `User Authentication`
   - **說明**：簡單描述您的應用程式用途，例如 "允許用戶使用 Facebook 帳號登入應用程式"
5. 選擇所需權限：
   - ✅ **email**（必填）- 用於取得用戶的電子郵件
   - ✅ **public_profile**（必填）- 包含用戶的姓名和頭像
6. 點擊 **「儲存」** 或 **「完成」**

---

## 🧪 步驟 5: 設定測試用戶（開發階段）

### 5.1 了解測試模式

⚠️ **重要**：在開發階段，Facebook 應用程式預設為「開發模式」，只能讓以下用戶登入：
- 應用程式開發者（您自己）
- 測試用戶

### 5.2 將自己加入為測試用戶

1. 在左側選單中，點擊 **「角色」** → **「測試用戶」**
2. 點擊 **「新增」** → **「新增測試用戶」**
3. 或者，直接將您的 Facebook 帳號加入：
   - 在左側選單中，點擊 **「角色」** → **「管理員」**
   - 確認您的帳號已在列表中（建立應用程式時會自動加入）

### 5.3 測試用戶登入

在開發模式下，您可以：
- ✅ 使用自己的 Facebook 帳號登入（如果您是開發者）
- ✅ 使用測試用戶登入

如果要讓所有用戶使用，需要完成「應用程式審查」（App Review），這在開發階段不是必需的。

---

## 📝 步驟 6: 設定環境變數

### 6.1 建立 .env.local 檔案

在專案根目錄（`hw5/`）建立 `.env.local` 檔案：

```bash
cd /Users/hannah/wp1141/hw5
touch .env.local
```

### 6.2 填入 Facebook OAuth 憑證

開啟 `.env.local` 檔案，加入以下內容：

```bash
# Facebook OAuth
FACEBOOK_CLIENT_ID=你的-應用程式編號-App-ID
FACEBOOK_CLIENT_SECRET=你的-應用程式密鑰-App-Secret
```

**範例**：
```bash
FACEBOOK_CLIENT_ID=1234567890123456
FACEBOOK_CLIENT_SECRET=abcdef1234567890abcdef1234567890
```

⚠️ **重要**：
- 將 `你的-應用程式編號-App-ID` 替換為步驟 2.1 中取得的 **應用程式編號**
- 將 `你的-應用程式密鑰-App-Secret` 替換為步驟 2.1 中取得的 **應用程式密鑰**

### 6.3 完整的環境變數範例

如果您的 `.env.local` 檔案中還沒有其他設定，可以參考以下完整範例：

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter-clone

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Facebook OAuth
FACEBOOK_CLIENT_ID=你的-facebook-app-id
FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret

# 如果您還有其他 OAuth 提供商
# GOOGLE_CLIENT_ID=xxx
# GOOGLE_CLIENT_SECRET=xxx
# GITHUB_CLIENT_ID=xxx
# GITHUB_CLIENT_SECRET=xxx
```

---

## 🧪 步驟 7: 測試 Facebook 登入

### 7.1 啟動開發伺服器

```bash
cd /Users/hannah/wp1141/hw5
npm run dev
```

### 7.2 測試登入流程

1. 開啟瀏覽器，前往 `http://localhost:3000`
2. 應該會自動導向登入頁面（`/auth/signin`）
3. 在「註冊區塊」中，點擊 **「使用 Facebook 註冊」** 按鈕
4. 應該會跳轉到 Facebook 登入頁面
5. 使用您的 Facebook 帳號（或測試用戶）登入
6. 授權應用程式存取您的資料
7. 應該會導向註冊頁面，讓您設定 UserID

### 7.3 檢查錯誤

如果遇到錯誤，請檢查：

1. **環境變數是否正確**：
   ```bash
   # 確認 .env.local 檔案存在且內容正確
   cat .env.local
   ```

2. **Facebook 應用程式設定**：
   - 確認 OAuth 重新導向 URI 已正確設定
   - 確認應用程式處於「開發模式」（開發階段）

3. **瀏覽器主控台**：
   - 開啟開發者工具（F12）
   - 查看 Console 和 Network 標籤頁的錯誤訊息

4. **伺服器日誌**：
   - 查看終端機中的 Next.js 日誌輸出

---

## 🚀 步驟 8: 部署到 Vercel（選用）

如果您要部署到 Vercel，需要額外設定：

### 8.1 更新 Facebook 應用程式設定

1. 回到 Facebook Developers 平台
2. 前往 **「Facebook 登入」** → **「設定」**
3. 在 **「有效的 OAuth 重新導向 URI」** 中加入您的 Vercel 網址：

```
https://your-app.vercel.app/api/auth/callback/facebook
```

4. 點擊 **「儲存變更」**

### 8.2 設定 Vercel 環境變數

1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 前往 **Settings** → **Environment Variables**
4. 新增以下環境變數：

```
FACEBOOK_CLIENT_ID=你的-facebook-app-id
FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret
```

5. 確認這些變數適用於 **Production, Preview, Development** 三個環境

### 8.3 重新部署

1. 在 Vercel Dashboard 中，前往 **Deployments** 標籤頁
2. 找到最新的部署，點擊 **"..."** → **Redeploy**
3. 等待部署完成

---

## ⚠️ 常見問題與解決方案

### 問題 1: "Invalid OAuth redirect_uri"

**原因**：Facebook 應用程式中的重新導向 URI 設定不正確

**解決方案**：
1. 確認 URI 完全正確（包括協議、網域、路徑）
2. 確認沒有 trailing slash
3. 確認 URI 已經儲存

### 問題 2: "App Not Setup: This app is still in development mode"

**原因**：應用程式處於開發模式，只能讓開發者和測試用戶使用

**解決方案**：
- 這是正常的！在開發階段，確保您是應用程式的開發者
- 或者建立測試用戶來測試登入

### 問題 3: "Missing required scope: email"

**原因**：未正確設定所需的權限

**解決方案**：
1. 前往 Facebook 登入設定
2. 確認使用案例中已包含 `email` 權限
3. 在 NextAuth 設定中，Facebook provider 會自動請求 `email` 和 `public_profile` 權限

### 問題 4: 環境變數未生效

**原因**：修改環境變數後未重啟開發伺服器

**解決方案**：
1. 停止開發伺服器（Ctrl+C）
2. 重新啟動：`npm run dev`

---

## 📋 檢查清單

請確認以下項目都已完成：

- [ ] Facebook 應用程式已建立
- [ ] 已取得應用程式編號（App ID）和應用程式密鑰（App Secret）
- [ ] Facebook 登入產品已新增
- [ ] 有效的 OAuth 重新導向 URI 已設定（包含 `http://localhost:3000/api/auth/callback/facebook`）
- [ ] 使用案例已設定（包含 `email` 和 `public_profile` 權限）
- [ ] `.env.local` 檔案已建立並填入 Facebook 憑證
- [ ] 開發伺服器已重啟
- [ ] 已測試 Facebook 登入功能
- [ ] （選用）Vercel 環境變數已設定
- [ ] （選用）Vercel 部署網址已加入 Facebook 重新導向 URI

---

## 📚 相關文件

- [OAuth 設定指南](./OAuth_設定指南.md) - 其他 OAuth 提供商的設定
- [OAuth 錯誤排查指南](./OAuth錯誤排查指南.md) - 常見錯誤解決方案
- [Vercel 部署步驟](./VERCEL部署步驟.md) - 完整部署指南
- [NextAuth 官方文件](https://authjs.dev/) - NextAuth v5 文件
- [Facebook Login 文件](https://developers.facebook.com/docs/facebook-login/) - Facebook 官方文件

---

## 🎉 完成！

如果一切順利，您現在應該可以使用 Facebook 帳號登入您的應用程式了！

如果遇到任何問題，請參考：
- 本指南的「常見問題與解決方案」章節
- [OAuth 錯誤排查指南](./OAuth錯誤排查指南.md)
- 或隨時詢問我！

祝您設定順利！🙌


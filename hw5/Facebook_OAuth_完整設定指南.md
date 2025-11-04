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

### 3.1 方法一：從主控板新增產品

1. 在左側選單中，點擊 **「主控板」**（Dashboard）
2. 在主控板頁面中，尋找：
   - **「新增產品」** 按鈕（通常在頁面頂部或中間）
   - 或 **「產品」** 區塊，點擊 **「瀏覽所有產品」**
3. 在產品列表中，找到 **「Facebook 登入」**（Facebook Login）
4. 點擊 **「設定」** 或 **「新增」** 按鈕
5. 系統會自動將 Facebook 登入產品新增到您的應用程式

### 3.2 方法二：從使用案例設定

如果找不到「新增產品」選項，可以透過設定使用案例來啟用：

1. 在左側選單中，點擊 **「使用案例」**（Use Cases）
2. 如果看到 **「設定使用案例」** 或類似的提示，點擊進入
3. 選擇 **「自訂使用 Facebook 登入以驗證用戶並索取資料的使用案例」**
4. 完成使用案例設定後，Facebook 登入產品會自動啟用

### 3.3 方法三：直接使用 URL

如果上述方法都不行，可以直接訪問 Facebook 登入設定頁面：

1. 在瀏覽器網址列中，將您的應用程式 ID 替換到以下 URL：
   ```
   https://developers.facebook.com/apps/你的應用程式編號/fb-login/settings/
   ```
   
   例如，如果您的應用程式編號是 `1764667804301657`，則訪問：
   ```
   https://developers.facebook.com/apps/1764667804301657/fb-login/settings/
   ```

2. 這會直接帶您到 Facebook 登入的設定頁面

### 3.4 設定有效的 OAuth 重新導向 URI

無論使用哪種方法進入設定頁面，接下來都需要設定重新導向 URI：

#### 步驟 1: 找到設定區塊

1. 在 Facebook 登入設定頁面中，向下滾動找到 **「有效的 OAuth 重新導向 URI」**（Valid OAuth Redirect URIs）區塊
2. 這個區塊通常在頁面中間或下方

#### 步驟 2: 新增 URI

1. **找到 URI 輸入欄位**：
   - 您會看到一個文字輸入框或文字區域
   - 這個欄位可能是空的，或已經有一些 URI

2. **輸入 URI**：
   - 在欄位中輸入以下 URI（**每行一個**，不要用逗號分隔）：
   
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```

3. **如果有多個環境**，可以一次加入多個（每行一個）：
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://your-app.vercel.app/api/auth/callback/facebook
   ```

#### 步驟 3: 儲存變更

1. **重要**：輸入 URI 後，**必須點擊頁面下方的「儲存變更」** 或 **「Save Changes」** 按鈕
2. 等待儲存完成（通常會顯示成功訊息）
3. **確認 URI 已儲存**：重新整理頁面，確認 URI 還在清單中

⚠️ **重要檢查點**：
- ✅ 使用 `http://` 用於本機開發（localhost）
- ✅ 使用 `https://` 用於正式環境（Vercel）
- ✅ URL 必須完全正確，沒有 trailing slash `/`
- ✅ 路徑必須是 `/api/auth/callback/facebook`
- ✅ 每行一個 URI（不要用逗號分隔）
- ✅ **必須點擊「儲存變更」按鈕**（這是關鍵！）

#### ⚠️ 如果看到「此重新導向 URI 對此應用程式無效」錯誤

**重要理解**：這個錯誤通常出現在「重新導向 URI 驗證程式」工具中。這個驗證工具**只是用來測試** URI 是否有效，但它**不是**實際設定的地方。

**實際設定 URI 的位置**是在「有效的 OAuth 重新導向 URI」清單中（通常在頁面上方）。

##### 解決步驟：

1. **找到「有效的 OAuth 重新導向 URI」清單**（**不是驗證工具**）：
   - 在 Facebook 登入設定頁面中，**向上滾動**或在頁面上方尋找
   - 找到標題為 **「有效的 OAuth 重新導向 URI」** 或 **「Valid OAuth Redirect URIs」** 的區塊
   - 這是一個**文字輸入框或文字區域**，用來設定實際的有效 URI 清單
   - **注意**：這與下方的「重新導向 URI 驗證程式」是不同的區塊

2. **在「有效的 OAuth 重新導向 URI」清單中輸入 URI**：
   - 在這個欄位中輸入所有需要使用的 URI（**每行一個**）：
     ```
     http://localhost:3000/api/auth/callback/facebook
     https://wp1141-1.vercel.app/api/auth/callback/facebook
     ```
   - **不要**在「重新導向 URI 驗證程式」工具中輸入（那只是用來測試的）
   - **不要**在「客戶端 OAuth 設定」或其他測試欄位中輸入

3. **儲存變更**（**這是最關鍵的步驟！**）：
   - 輸入完成後，**向下滾動**到頁面底部
   - **務必**點擊 **「儲存變更」** 或 **「Save Changes」** 按鈕
   - 等待儲存成功訊息出現（通常會顯示綠色成功提示）
   - **如果沒有點擊儲存，URI 不會生效！**

4. **驗證 URI 已成功加入**：
   - 重新整理頁面（F5 或 Cmd+R）
   - 確認 URI 顯示在「有效的 OAuth 重新導向 URI」清單中
   - 如果沒有顯示，可能是：
     - 沒有點擊「儲存變更」按鈕
     - URI 格式錯誤
     - 需要重新輸入並再次儲存

5. **使用驗證工具測試**（可選）：
   - 儲存後，您可以**選擇性地**使用下方的「重新導向 URI 驗證程式」來測試 URI
   - 如果驗證通過，應該會顯示綠色勾號或成功訊息
   - 如果還是顯示錯誤，請確認：
     - URI 已經正確儲存在上方的清單中
     - 頁面已重新整理
     - URI 格式完全正確

6. **檢查 URI 格式**：
   - ✅ 正確：`https://wp1141-1.vercel.app/api/auth/callback/facebook`
   - ❌ 錯誤：`https://wp1141-1.vercel.app/api/auth/callback/facebook/`（多了斜線）
   - ❌ 錯誤：`https://wp1141-1.vercel.app/api/auth/callback/facebook `（多了空格）
   - ❌ 錯誤：`wp1141-1.vercel.app/api/auth/callback/facebook`（缺少協議）

---

## 👤 步驟 4: 完成使用案例設定

### 4.1 設定使用案例

Facebook 會要求您完成使用案例設定（在儀表板中會顯示為「必要動作」）：

1. **從左側選單進入**：
   - 點擊左側選單中的 **「使用案例」**（Use Cases）
   - 或點擊 **「必要動作」**（Required Actions），查看需要完成的項目

2. **如果尚未新增 Facebook 登入產品**：
   - 在「使用案例」頁面中，點擊 **「新增使用案例」** 或 **「建立使用案例」**
   - 選擇 **「自訂使用 Facebook 登入以驗證用戶並索取資料的使用案例」**
   - 這會自動啟用 Facebook 登入產品

3. **如果已經有使用案例設定頁面**：
   - 點擊 **「開始」** 或 **「設定」** 或 **「編輯」**
   - 選擇使用案例類型：
     - 選擇 **「自訂使用 Facebook 登入以驗證用戶並索取資料的使用案例」**

4. **填寫使用案例資訊**：
   - **使用案例名稱**：例如 `User Login` 或 `User Authentication`
   - **說明**：簡單描述您的應用程式用途，例如 "允許用戶使用 Facebook 帳號登入應用程式"

5. **選擇所需權限**：
   - ✅ **email**（必填）- 用於取得用戶的電子郵件
   - ✅ **public_profile**（必填）- 包含用戶的姓名和頭像
   - 這些權限通常已經預設選取

6. **儲存設定**：
   - 點擊 **「儲存」** 或 **「完成」** 或 **「Submit」**

⚠️ **注意**：完成使用案例設定後，Facebook 登入功能才能正常運作。如果跳過這一步，可能會在登入時遇到權限錯誤。

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

### 問題 1: "Invalid OAuth redirect_uri" 或 "此重新導向 URI 對此應用程式無效"

**原因**：Facebook 應用程式中的重新導向 URI 設定不正確或尚未儲存

**解決方案**：

1. **確認您在正確的設定頁面**：
   - 訪問：`https://developers.facebook.com/apps/你的應用程式編號/fb-login/settings/`
   - 確認您在「Facebook 登入」→「設定」頁面

2. **找到「有效的 OAuth 重新導向 URI」區塊**：
   - 向下滾動頁面，找到這個區塊
   - 確認不是在其他測試欄位中輸入

3. **正確輸入 URI**：
   - 在「有效的 OAuth 重新導向 URI」欄位中輸入：
     ```
     http://localhost:3000/api/auth/callback/facebook
     ```
   - **每行一個 URI**，不要用逗號分隔
   - 確認格式完全正確（沒有空格、沒有 trailing slash）

4. **儲存變更（最重要！）**：
   - 輸入完成後，**必須點擊頁面底部的「儲存變更」或「Save Changes」按鈕**
   - 等待儲存成功訊息出現
   - 如果沒有儲存，URI 不會生效

5. **驗證儲存成功**：
   - 重新整理頁面
   - 確認 URI 顯示在清單中
   - 如果沒有顯示，重新輸入並再次儲存

6. **檢查 URI 格式**：
   - ✅ 正確：`http://localhost:3000/api/auth/callback/facebook`
   - ❌ 錯誤：`http://localhost:3000/api/auth/callback/facebook/`（多了斜線）
   - ❌ 錯誤：`http://localhost:3000/api/auth/callback/facebook `（多了空格）
   - ❌ 錯誤：`localhost:3000/api/auth/callback/facebook`（缺少協議）

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

### 問題 4: 400 錯誤（Failed to load resource: the server responded with a status of 400）

**原因**：這通常表示 OAuth 請求格式錯誤或配置不正確

**⚠️ 如果是在 Vercel 部署環境中遇到 400 錯誤，請優先檢查以下項目：**

#### 🚀 部署環境專用排查（優先檢查）

1. **確認 Vercel 環境變數已設定**：
   - 前往 Vercel Dashboard > 您的專案 > Settings > Environment Variables
   - 確認以下變數都已設定並適用於 **Production** 環境：
     ```
     FACEBOOK_CLIENT_ID=1764667804301657
     FACEBOOK_CLIENT_SECRET=你的-facebook-app-secret
     NEXTAUTH_URL=https://wp1141-1.vercel.app
     NEXTAUTH_SECRET=你的-nextauth-secret
     ```
   - ⚠️ **重要**：`NEXTAUTH_URL` 必須完全匹配您的實際 Vercel 網址（沒有 trailing slash）

2. **確認 Facebook 已加入 Vercel 網址**：
   - 訪問：`https://developers.facebook.com/apps/1764667804301657/fb-login/settings/`
   - 在「有效的 OAuth 重新導向 URI」清單中，確認已包含：
     ```
     https://wp1141-1.vercel.app/api/auth/callback/facebook
     ```
   - 確認已點擊「儲存變更」按鈕
   - ⚠️ **注意**：必須使用 `https://`（不是 `http://`）

3. **重新部署 Vercel**：
   - 修改環境變數後，必須重新部署才會生效
   - Vercel Dashboard > Deployments > 找到最新部署 > "..." > Redeploy
   - 或推送新的 commit 觸發自動部署

4. **檢查 Vercel Logs**：
   - Vercel Dashboard > 您的專案 > Logs
   - 查看是否有錯誤訊息
   - 特別注意是否有 "FACEBOOK_CLIENT_ID is not defined" 之類的錯誤

**常見原因和解決方案**（適用於本機和部署環境）：

#### A. 環境變數未設定或錯誤

1. **檢查 .env.local 檔案**：
   ```bash
   cd /Users/hannah/wp1141/hw5
   cat .env.local
   ```

2. **確認以下變數已正確設定**：
   ```bash
   FACEBOOK_CLIENT_ID=你的-應用程式編號
   FACEBOOK_CLIENT_SECRET=你的-應用程式密鑰
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=你的-nextauth-secret
   ```

3. **如果環境變數未設定**：
   - 建立 `.env.local` 檔案（如果不存在）
   - 填入 Facebook 憑證
   - 重新啟動開發伺服器

#### B. Facebook 重新導向 URI 設定不正確

1. **本機環境**：
   - 訪問：`https://developers.facebook.com/apps/1764667804301657/fb-login/settings/`
   - 確認 `http://localhost:3000/api/auth/callback/facebook` 已在「有效的 OAuth 重新導向 URI」清單中
   - 確認已點擊「儲存變更」按鈕

2. **部署環境（Vercel）**：
   - 訪問：`https://developers.facebook.com/apps/1764667804301657/fb-login/settings/`
   - 確認 `https://wp1141-1.vercel.app/api/auth/callback/facebook` 已在清單中
   - ⚠️ **必須使用 `https://`**（不是 `http://`）
   - 確認已點擊「儲存變更」按鈕

3. **檢查 URI 格式**：
   - ✅ 本機正確：`http://localhost:3000/api/auth/callback/facebook`
   - ✅ 部署正確：`https://wp1141-1.vercel.app/api/auth/callback/facebook`
   - ❌ 錯誤：`http://localhost:3000/api/auth/callback/facebook/`（多了斜線）
   - ❌ 錯誤：`https://localhost:3000/api/auth/callback/facebook`（本機應使用 http）
   - ❌ 錯誤：`http://wp1141-1.vercel.app/api/auth/callback/facebook`（部署應使用 https）

#### C. 使用案例未設定

1. **確認使用案例已設定**：
   - 前往左側選單 → 「使用案例」
   - 確認已設定「自訂使用 Facebook 登入以驗證用戶並索取資料的使用案例」
   - 確認已包含 `email` 和 `public_profile` 權限

#### D. 應用程式處於開發模式

1. **確認您是應用程式開發者**：
   - 前往左側選單 → 「角色」→ 「管理員」
   - 確認您的 Facebook 帳號在列表中

2. **或使用測試用戶**：
   - 前往左側選單 → 「角色」→ 「測試用戶」
   - 建立測試用戶並使用測試用戶登入

#### E. 檢查瀏覽器主控台和網路請求

1. **開啟開發者工具**（F12）
2. **查看 Console 標籤頁**：
   - 查看是否有更詳細的錯誤訊息
   - 記錄任何錯誤訊息

3. **查看 Network 標籤頁**：
   - 找到返回 400 錯誤的請求
   - 點擊該請求，查看「Response」標籤頁
   - 查看錯誤詳情

4. **查看伺服器日誌**：
   - 查看終端機中的 Next.js 日誌
   - 尋找任何錯誤訊息

#### F. 重新啟動開發伺服器

1. **停止開發伺服器**：
   - 在終端機中按 `Ctrl+C`

2. **重新啟動**：
   ```bash
   npm run dev
   ```

3. **清除瀏覽器快取**：
   - 清除瀏覽器快取和 Cookie
   - 或使用無痕模式測試

#### G. 檢查 NextAuth 配置

1. **確認 auth.ts 中的 Facebook provider 配置正確**：
   ```typescript
   Facebook({
     clientId: process.env.FACEBOOK_CLIENT_ID!,
     clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
   })
   ```

2. **確認環境變數名稱正確**：
   - `FACEBOOK_CLIENT_ID`（不是 `FACEBOOK_APP_ID`）
   - `FACEBOOK_CLIENT_SECRET`（不是 `FACEBOOK_APP_SECRET`）

### 問題 5: 環境變數未生效

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


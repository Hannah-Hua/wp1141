# Pusher 即時通訊設定指南

本指南將幫助您設置 Pusher，讓您的應用程式能夠即時更新貼文、按讚等操作。

## 📋 目錄

1. [什麼是 Pusher？](#什麼是-pusher)
2. [註冊 Pusher 帳號](#註冊-pusher-帳號)
3. [建立 Pusher App](#建立-pusher-app)
4. [取得 Pusher 憑證](#取得-pusher-憑證)
5. [設定環境變數](#設定環境變數)
6. [測試 Pusher 連線](#測試-pusher-連線)
7. [Pusher 功能說明](#pusher-功能說明)
8. [常見問題](#常見問題)

---

## 什麼是 Pusher？

Pusher 是一個即時通訊服務，讓您的應用程式能夠：
- ✅ **即時更新貼文**：當有人發布新貼文時，所有用戶的畫面會自動更新
- ✅ **即時按讚**：當有人按讚時，其他用戶會立即看到按讚數變化
- ✅ **即時刪除**：當貼文被刪除時，會自動從所有用戶的畫面中移除
- ✅ **即時轉發**：當有人轉發貼文時，會立即顯示在時間軸上

**不需要 Pusher 也能運作**：如果沒有設定 Pusher，應用程式會正常運作，只是不會有即時更新功能（需要手動重新整理頁面才能看到新內容）。

---

## 註冊 Pusher 帳號

1. 前往 [Pusher 官網](https://pusher.com/)
2. 點擊右上角的 **"Sign up"** 或 **"Get started"**
3. 選擇 **"Sign up with email"** 或使用 GitHub/Google 帳號登入
4. 完成註冊流程

> 💡 **免費方案**：Pusher 提供免費方案，每月有 200,000 次訊息和 100 個同時連線，對測試和中小型應用程式來說已經足夠。

---

## 建立 Pusher App

1. 登入後，點擊 **"Create app"** 或 **"Get started"**
2. **重要：選擇 Channels（不是 Beams）**
   - 您會看到兩個選項：
     - ✅ **Channels**：用於即時通訊（WebSocket）- **選擇這個**
     - ❌ **Beams**：用於推送通知 - **不需要**
   - 我們需要的是即時通訊功能，所以選擇 **Channels**
3. **選擇環境設定**
   - 您會看到 **"Create apps for multiple environments?"** 選項
   - **建議選擇**：**不勾選**（使用單一 App）
   - **原因**：
     - ✅ 免費方案已經足夠測試和開發使用
     - ✅ 一個 App 可以同時用於開發和生產環境
     - ✅ 避免管理多個憑證的複雜度
     - ✅ 如果之後需要，可以隨時建立新的 App
   - **如果您想要分離環境**：
     - 可以勾選此選項，建立兩個 App（開發和生產）
     - 但對於測試階段，一個 App 就足夠了
4. 填寫應用程式資訊：
   - **App name**：輸入您的應用程式名稱（例如：`X-Clone`）
   - **Cluster**：選擇離您最近的區域
     - 🇹🇼 **台灣/亞洲**：建議選擇 `ap3` (Asia Pacific - Singapore) 或 `ap1` (Asia Pacific - Mumbai)
     - 🇺🇸 **美國**：選擇 `us2` (US East) 或 `us3` (US West)
     - 🇪🇺 **歐洲**：選擇 `eu` (Europe - Ireland)
   - **Front-end tech**：選擇 `React`
   - **Back-end tech**：選擇 `Node.js`
5. 點擊 **"Create app"**

> 📝 **說明**：
> - **Channels**：用於即時通訊（當有人發布貼文、按讚時，其他用戶立即看到更新）
> - **Beams**：用於手機推送通知（例如：背景推送通知），我們不需要這個功能
> - **多環境設定**：對於測試和小型專案，一個 App 就足夠了。如果之後需要分離開發和生產環境，可以再建立新的 App

---

## 取得 Pusher 憑證

建立 App 後，您會看到 **"App Keys"** 頁面，包含以下資訊：

### 需要的憑證

1. **App ID** (`app_id`)
   - 例如：`1234567`

2. **Key** (`key`)
   - 例如：`a1b2c3d4e5f6g7h8i9j0`

3. **Secret** (`secret`)
   - 例如：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

4. **Cluster** (`cluster`)
   - 例如：`ap3`（這是在建立 App 時選擇的）

---

## 設定環境變數

### 1. 開啟 `.env.local` 檔案

```bash
cd /Users/hannah/wp1141/hw5
# 如果檔案不存在，會自動建立
```

### 2. 加入 Pusher 環境變數

在 `.env.local` 檔案中加入以下內容：

```bash
# ============================================
# Pusher 即時通訊設定
# ============================================

# 伺服器端設定（後端使用）
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=ap3

# 客戶端設定（前端使用，必須以 NEXT_PUBLIC_ 開頭）
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=ap3
```

### 3. 替換為實際值

將 `your-pusher-app-id`、`your-pusher-key`、`your-pusher-secret` 替換為您在 Pusher 取得的實際值：

```bash
# 範例（請使用您自己的值）
PUSHER_APP_ID=1234567
PUSHER_KEY=a1b2c3d4e5f6g7h8i9j0
PUSHER_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PUSHER_CLUSTER=ap3

NEXT_PUBLIC_PUSHER_KEY=a1b2c3d4e5f6g7h8i9j0
NEXT_PUBLIC_PUSHER_CLUSTER=ap3
```

> ⚠️ **重要**：
> - `PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_KEY` 的值**必須相同**
> - `PUSHER_CLUSTER` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 的值**必須相同**
> - `NEXT_PUBLIC_` 開頭的變數會暴露給前端，所以只放 `KEY` 和 `CLUSTER`，**不要**放 `SECRET` 或 `APP_ID`

### 4. 完整 `.env.local` 範例

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/twitter-clone

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Pusher（即時通訊）
PUSHER_APP_ID=1234567
PUSHER_KEY=a1b2c3d4e5f6g7h8i9j0
PUSHER_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PUSHER_CLUSTER=ap3
NEXT_PUBLIC_PUSHER_KEY=a1b2c3d4e5f6g7h8i9j0
NEXT_PUBLIC_PUSHER_CLUSTER=ap3

# Cloudinary（圖片儲存，可選）
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 測試 Pusher 連線

### 1. 重新啟動開發伺服器

設定環境變數後，需要重新啟動開發伺服器：

```bash
# 停止目前的伺服器（按 Ctrl+C）
# 然後重新啟動
cd /Users/hannah/wp1141/hw5
npm run dev
```

### 2. 開啟瀏覽器開發者工具

1. 開啟 http://localhost:3000
2. 按 `F12` 或 `Cmd+Option+I` 開啟開發者工具
3. 切換到 **"Console"** 分頁

### 3. 檢查 Pusher 連線

如果設定正確，您應該會看到：
- ✅ 沒有錯誤訊息
- ✅ 貼文會即時更新（不需要重新整理頁面）

如果設定錯誤或未設定，應用程式會正常運作，但：
- ⚠️ 不會有即時更新功能
- ⚠️ 需要手動重新整理頁面才能看到新內容

### 4. 測試即時功能

1. 開啟兩個瀏覽器視窗（或使用無痕模式）
2. 在一個視窗中發布新貼文
3. 另一個視窗應該會**自動**顯示新貼文（不需要重新整理）

如果成功，表示 Pusher 設定正確！🎉

---

## Pusher 功能說明

### 目前實作的即時功能

您的應用程式已經整合了以下 Pusher 功能：

#### 1. **即時貼文更新** (`post-created`)
- 當有人發布新貼文時，所有用戶的畫面會自動更新
- 新貼文會出現在時間軸頂部

#### 2. **即時按讚更新** (`post-updated`)
- 當有人按讚或取消按讚時，按讚數會立即更新
- 所有用戶會同時看到最新的按讚數

#### 3. **即時貼文刪除** (`post-deleted`)
- 當貼文被刪除時，會自動從所有用戶的畫面中移除

#### 4. **即時轉發** (`post-created`)
- 當有人轉發貼文時，會立即顯示在時間軸上

### Pusher 頻道和事件

- **頻道名稱**：`posts`
- **事件類型**：
  - `post-created`：新貼文發布
  - `post-updated`：貼文更新（按讚、留言等）
  - `post-deleted`：貼文刪除

---

## 部署到 Vercel 時的設定

### 1. 在 Vercel 設定環境變數

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 進入 **Settings** → **Environment Variables**
4. 加入所有 Pusher 環境變數（與 `.env.local` 相同）

### 2. 確認 Cluster 設定

確保 `PUSHER_CLUSTER` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 設定正確，建議選擇離用戶最近的區域。

---

## Channels vs Beams 說明

### 為什麼選擇 Channels？

您的應用程式需要的是 **Channels**，原因如下：

| 功能 | Channels | Beams |
|------|----------|-------|
| **用途** | 即時通訊（WebSocket） | 推送通知（Push Notifications） |
| **適用場景** | 聊天室、即時更新、協作工具 | 手機應用程式背景推送通知 |
| **技術** | WebSocket、長連線 | APNs、FCM |
| **我們的需求** | ✅ 即時更新貼文、按讚 | ❌ 不需要 |

**我們的應用程式使用**：
- `pusher` (伺服器端套件) - 屬於 Channels
- `pusher-js` (客戶端套件) - 屬於 Channels

這些套件用於：
- 訂閱頻道（`pusher.subscribe('posts')`）
- 監聽事件（`channel.bind('post-created')`）
- 觸發事件（`pusher.trigger()`）

這些都是 **Channels** 的功能，不是 Beams。

---

## 常見問題

### Q1: 應該選擇 Channels 還是 Beams？

**A:** 選擇 **Channels**。因為：
- ✅ 我們需要即時通訊功能（當有人發布貼文時，其他用戶立即看到）
- ✅ 我們的程式碼使用的是 `pusher` 和 `pusher-js` 套件，這些是 Channels 的套件
- ❌ Beams 是用於手機推送通知的，我們不需要

### Q2: Pusher 是免費的嗎？

**A:** Pusher 提供免費方案（Sandbox），包含：
- 每月 200,000 次訊息
- 100 個同時連線
- 無限頻道

對測試和中小型應用程式來說已經足夠。

### Q2: 如果沒有設定 Pusher，應用程式還能運作嗎？

**A:** 可以！應用程式已經設計為**可選的 Pusher 整合**：
- 如果沒有設定 Pusher，應用程式會正常運作
- 只是不會有即時更新功能
- 用戶需要手動重新整理頁面才能看到新內容

### Q3: 如何確認 Pusher 是否正常運作？

**A:** 
1. 開啟瀏覽器開發者工具的 Console
2. 發布新貼文
3. 檢查是否有 Pusher 相關的錯誤訊息
4. 測試即時更新功能（開兩個視窗測試）

### Q4: `PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_KEY` 為什麼要設定兩次？

**A:** 
- `PUSHER_KEY`：用於伺服器端（後端 API）
- `NEXT_PUBLIC_PUSHER_KEY`：用於客戶端（前端 React）
- 兩者的值必須相同，但 Next.js 需要 `NEXT_PUBLIC_` 前綴才能在前端使用

### Q5: 為什麼 `SECRET` 不需要 `NEXT_PUBLIC_` 前綴？

**A:** `SECRET` 是敏感資訊，只能用在伺服器端，絕對不能暴露給前端。所以只設定 `PUSHER_SECRET`，不設定 `NEXT_PUBLIC_PUSHER_SECRET`。

### Q6: 如何選擇正確的 Cluster？

**A:** 選擇離您和用戶最近的區域：
- 🇹🇼 **台灣/亞洲**：`ap3` (Singapore) 或 `ap1` (Mumbai)
- 🇺🇸 **美國**：`us2` (US East) 或 `us3` (US West)
- 🇪🇺 **歐洲**：`eu` (Ireland)
- 🌍 **全球用戶**：選擇 `us2` 或 `eu`

### Q7: Pusher 會影響效能嗎？

**A:** 不會。Pusher 使用 WebSocket 連線，效能很好。而且：
- 只在有更新時才推送訊息
- 不會增加伺服器負擔
- 減少不必要的 API 請求（不需要輪詢）

### Q8: 應該建立多個環境的 App 嗎？

**A:** 對於測試和小型專案，**建議使用單一 App**：
- ✅ 免費方案已經足夠使用
- ✅ 避免管理多個憑證的複雜度
- ✅ 一個 App 可以同時用於開發和生產環境
- ✅ 如果之後需要分離，可以隨時建立新的 App

**如果您想要分離環境**：
- 可以建立兩個 App：
  - `X-Clone-Development`（開發環境）
  - `X-Clone-Production`（生產環境）
- 在不同的環境變數中使用不同的憑證
- 這樣可以分離開發和生產的訊息流量

**建議**：先建立一個 App 測試，如果之後需要再建立第二個 App。

---

## 📚 相關資源

- [Pusher 官方文件](https://pusher.com/docs)
- [Pusher Channels 文件](https://pusher.com/docs/channels)
- [Next.js 環境變數文件](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ 設定檢查清單

完成以下步驟後，Pusher 就設定完成了：

- [ ] 註冊 Pusher 帳號
- [ ] 建立 Pusher App
- [ ] 選擇正確的 Cluster
- [ ] 取得 App ID、Key、Secret、Cluster
- [ ] 在 `.env.local` 設定所有環境變數
- [ ] 確認 `PUSHER_KEY` 和 `NEXT_PUBLIC_PUSHER_KEY` 相同
- [ ] 確認 `PUSHER_CLUSTER` 和 `NEXT_PUBLIC_PUSHER_CLUSTER` 相同
- [ ] 重新啟動開發伺服器
- [ ] 測試即時更新功能
- [ ] 在 Vercel 設定環境變數（部署時）

---

**設定完成後，您的應用程式就具備即時更新功能了！** 🎉


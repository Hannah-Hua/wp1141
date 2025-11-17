# MongoDB Atlas 完整設定指南

本指南將協助你從零開始設定 MongoDB Atlas，並連接到你的 LINE Bot 專案。

## 📋 目錄

1. [建立 MongoDB Atlas 帳號](#1-建立-mongodb-atlas-帳號)
2. [建立 Cluster](#2-建立-cluster)
3. [設定資料庫使用者](#3-設定資料庫使用者)
4. [設定網路存取](#4-設定網路存取)
5. [取得連線字串](#5-取得連線字串)
6. [測試連線](#6-測試連線)
7. [常見問題](#常見問題)

---

## 1. 建立 MongoDB Atlas 帳號

### 步驟 1.1：前往 MongoDB Atlas

1. 開啟瀏覽器，前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 點選右上角的 **"Try Free"** 或 **"Sign Up"** 按鈕

### 步驟 1.2：註冊帳號

1. 選擇註冊方式：
   - **使用 Google 帳號**（推薦，最快速）
   - **使用 GitHub 帳號**
   - **使用 Email 註冊**

2. 填寫基本資訊：
   - 姓名
   - Email（如果使用 Email 註冊）
   - 密碼（如果使用 Email 註冊）

3. 同意服務條款並點選 **"Create your Atlas account"**

### 步驟 1.3：選擇部署類型

1. 選擇 **"Build a Database"**
2. 選擇 **"M0 FREE"**（免費方案）
   - 512 MB 儲存空間
   - 共享 CPU 和 RAM
   - 適合開發和測試使用

---

## 2. 建立 Cluster

### 步驟 2.1：選擇雲端供應商和地區

1. **選擇雲端供應商**：
   - 建議選擇 **AWS**（Amazon Web Services）
   - 或選擇 **Google Cloud** 或 **Azure**

2. **選擇地區（Region）**：
   - 建議選擇離你最近的區域
   - 台灣用戶建議選擇：
     - **AWS / ap-northeast-1 (Tokyo)** - 日本東京（推薦）
     - **AWS / ap-southeast-1 (Singapore)** - 新加坡
     - **Google Cloud / asia-east1 (Taiwan)** - 台灣（如果可用）

3. 點選 **"Create"** 建立 Cluster

### 步驟 2.2：等待 Cluster 建立

- Cluster 建立需要約 **3-5 分鐘**
- 頁面會顯示建立進度
- 建立完成後，你會看到 Cluster 狀態變為 **"Running"**

---

## 3. 設定資料庫使用者

### 步驟 3.1：建立資料庫使用者

1. 在 Cluster 建立完成後，會自動跳出 **"Create Database User"** 視窗
2. 如果沒有自動跳出，可以：
   - 點選左側選單的 **"Database Access"**
   - 點選 **"Add New Database User"** 按鈕

### 步驟 3.2：設定使用者資訊

1. **Authentication Method**：選擇 **"Password"**

2. **Username**：
   - 輸入使用者名稱（例如：`ziyenhua_db_user`）
   - 建議使用有意義的名稱，方便管理

3. **Password**：
   - 點選 **"Autogenerate Secure Password"** 自動產生密碼
   - **或** 自行設定密碼（建議至少 12 個字元，包含大小寫字母、數字、特殊符號）
   - ⚠️ **重要**：請將密碼複製並妥善保存，之後無法再次查看

4. **Database User Privileges**：
   - 選擇 **"Read and write to any database"**（預設選項）
   - 這會給予使用者完整的讀寫權限

5. 點選 **"Add User"** 完成建立

### 步驟 3.3：確認使用者建立成功

- 在 **"Database Access"** 頁面應該會看到你剛建立的使用者
- 狀態應該顯示為 **"Active"**

---

## 4. 設定網路存取

### 步驟 4.1：開啟網路存取設定

1. 點選左側選單的 **"Network Access"**
2. 點選 **"Add IP Address"** 按鈕

### 步驟 4.2：設定 IP 白名單

**選項 A：允許所有 IP（開發階段推薦）**

1. 點選 **"Allow Access from Anywhere"** 按鈕
2. 這會自動填入 `0.0.0.0/0`（允許所有 IP）
3. 點選 **"Confirm"**
4. ⚠️ **注意**：這在開發階段很方便，但生產環境建議限制特定 IP

**選項 B：只允許特定 IP（生產環境推薦）**

1. 在 **"IP Address"** 欄位輸入你的 IP
   - 可以輸入 `0.0.0.0/0` 允許所有 IP（開發用）
   - 或輸入特定 IP（例如：`123.456.789.0/24`）
2. 在 **"Comment"** 欄位輸入註解（例如：`Development` 或 `Vercel Deployment`）
3. 點選 **"Confirm"**

### 步驟 4.3：確認網路存取設定

- 在 **"Network Access"** 頁面應該會看到你新增的 IP 規則
- 狀態應該顯示為 **"Active"**

---

## 5. 取得連線字串

### 步驟 5.1：開啟連線視窗

1. 回到 **"Database"** 頁面（左側選單）
2. 點選你建立的 Cluster 旁邊的 **"Connect"** 按鈕

### 步驟 5.2：選擇連線方式

1. 選擇 **"Connect your application"**（連接應用程式）
2. 不要選擇 "Connect with MongoDB Compass" 或 "Connect with MongoDB Shell"

### 步驟 5.3：取得連線字串

1. **Driver**：選擇 **"Node.js"**
2. **Version**：選擇 **"5.5 or later"**（或最新版本）

3. 你會看到連線字串，格式如下：
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

4. **複製這個連線字串**

### 步驟 5.4：替換連線字串中的資訊

將連線字串中的以下部分替換：

- `<username>` → 你剛才建立的資料庫使用者名稱
- `<password>` → 你剛才建立的資料庫使用者密碼
- `<cluster-name>` → 你的 Cluster 名稱（例如：`hw6-cluster`）
- `<dbname>` → 資料庫名稱（例如：`linebot` 或 `hw6`）

**範例**：
```
mongodb+srv://ziyenhua_db_user:AgSMi49CxhCDQDE9@hw6-cluster.mongodb.net/linebot?retryWrites=true&w=majority
```

### 步驟 5.5：設定到環境變數

1. 在你的專案根目錄建立 `.env.local` 檔案（如果還沒有）

2. 將連線字串設定到 `MONGODB_URI`：
   ```env
   MONGODB_URI=mongodb+srv://ziyenhua_db_user:AgSMi49CxhCDQDE9@hw6-cluster.mongodb.net/linebot?retryWrites=true&w=majority
   ```

3. ⚠️ **重要**：
   - 不要將 `.env.local` 提交到 Git
   - 確保 `.env.local` 已在 `.gitignore` 中

---

## 6. 測試連線

### 步驟 6.1：使用專案提供的測試腳本

專案中已經提供了測試腳本，位於 `scripts/test-mongodb.js`。

### 步驟 6.2：執行測試

```bash
# 確保已安裝 dotenv 套件
npm install

# 執行測試腳本
node scripts/test-mongodb.js
```

**或者**，如果你已經安裝了 `dotenv-cli`：

```bash
npx dotenv -e .env.local -- node scripts/test-mongodb.js
```

### 步驟 6.3：檢查結果

**成功訊息應該類似：**
```
🔄 正在連接到 MongoDB...
✅ MongoDB 連線成功！
📊 資料庫名稱：linebot
🌐 主機：hw6-cluster-shard-00-00.xxxxx.mongodb.net
✅ 測試寫入成功！
🧹 測試資料已清理
👋 已斷開連線
```

**如果出現錯誤，請參考下方「常見問題」章節。**

---

## 常見問題

### ❌ 錯誤：MongoServerSelectionError

**可能原因：**
1. **IP 地址未加入白名單**
   - 解決：前往 Network Access，確認你的 IP 已加入

2. **使用者名稱或密碼錯誤**
   - 解決：檢查 Database Access 中的使用者資訊
   - 如果忘記密碼，需要刪除舊使用者並建立新的

3. **Cluster 名稱錯誤**
   - 解決：檢查連線字串中的 Cluster 名稱是否正確

### ❌ 錯誤：Authentication failed

**可能原因：**
- 使用者名稱或密碼包含特殊字元，需要 URL 編碼
- 解決：將密碼中的特殊字元進行 URL 編碼
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

**範例：**
如果密碼是 `P@ssw0rd#123`，連線字串應該是：
```
mongodb+srv://username:P%40ssw0rd%23123@cluster.mongodb.net/dbname
```

### ❌ 錯誤：Connection timeout

**可能原因：**
- 網路連線問題
- Firewall 阻擋
- 解決：檢查網路連線，或嘗試使用 VPN

### ✅ 如何查看資料庫內容

1. 在 MongoDB Atlas 左側選單點選 **"Database"**
2. 點選 **"Browse Collections"**
3. 選擇你的資料庫和 Collection
4. 即可查看儲存的資料

### ✅ 如何重置密碼

1. 前往 **"Database Access"**
2. 找到你的使用者
3. 點選 **"Edit"**
4. 點選 **"Edit Password"**
5. 設定新密碼
6. 更新 `.env.local` 中的 `MONGODB_URI`

### ✅ 如何刪除測試資料

1. 在 **"Database"** 頁面點選 **"Browse Collections"**
2. 選擇你的資料庫
3. 找到要刪除的 Collection
4. 點選 **"Delete Collection"**

---

## 📝 檢查清單

完成以下項目後，你的 MongoDB Atlas 就設定完成了：

- [ ] 已建立 MongoDB Atlas 帳號
- [ ] 已建立 Cluster（狀態為 Running）
- [ ] 已建立資料庫使用者（狀態為 Active）
- [ ] 已設定網路存取（IP 白名單）
- [ ] 已取得連線字串
- [ ] 已將連線字串設定到 `.env.local`
- [ ] 已測試連線成功

---

## 🎉 完成！

現在你的 MongoDB Atlas 已經設定完成，可以在專案中使用了！

**下一步：**
1. 確認 `.env.local` 中的 `MONGODB_URI` 已正確設定
2. 啟動你的 Next.js 專案：`npm run dev`
3. 測試 LINE Bot 功能，確認資料能正確儲存到 MongoDB

---

## 📚 相關資源

- [MongoDB Atlas 官方文件](https://docs.atlas.mongodb.com/)
- [Mongoose 文件](https://mongoosejs.com/docs/)
- [MongoDB 連線字串格式](https://docs.mongodb.com/manual/reference/connection-string/)


# .env.local 檔案建立指南

本指南將協助你建立 `.env.local` 檔案，這是 Next.js 專案用來儲存環境變數的檔案。

## 📋 目錄

1. [什麼是 .env.local](#什麼是-envlocal)
2. [建立檔案的方法](#建立檔案的方法)
3. [檔案內容範本](#檔案內容範本)
4. [重要注意事項](#重要注意事項)
5. [驗證設定](#驗證設定)

---

## 什麼是 .env.local

`.env.local` 是 Next.js 用來儲存環境變數的檔案，這些變數通常包含：
- 資料庫連線字串
- API 金鑰
- 其他敏感資訊

⚠️ **重要**：這個檔案**絕對不要**提交到 Git，因為它包含敏感資訊。

---

## 建立檔案的方法

### 方法 1：使用終端機（Terminal / Command Line）

#### macOS / Linux

```bash
# 進入專案目錄
cd /Users/hannah/wp1141/hw6

# 建立 .env.local 檔案
touch .env.local

# 使用文字編輯器開啟（例如使用 nano）
nano .env.local
```

#### Windows (PowerShell)

```powershell
# 進入專案目錄
cd C:\path\to\hw6

# 建立 .env.local 檔案
New-Item -Path .env.local -ItemType File

# 使用記事本開啟
notepad .env.local
```

#### Windows (CMD)

```cmd
# 進入專案目錄
cd C:\path\to\hw6

# 建立 .env.local 檔案
type nul > .env.local

# 使用記事本開啟
notepad .env.local
```

### 方法 2：使用 VS Code / Cursor

1. 在 VS Code 或 Cursor 中開啟專案
2. 在左側檔案總管中，點選專案根目錄（`hw6`）
3. 點選「新增檔案」按鈕（或按 `Cmd+N` / `Ctrl+N`）
4. 輸入檔案名稱：`.env.local`
5. 按 Enter 建立檔案

### 方法 3：使用文字編輯器

1. 開啟任何文字編輯器（TextEdit、Notepad、Sublime Text 等）
2. 建立新檔案
3. 儲存為 `.env.local`（注意：檔案名稱前面有**點號**）
4. 儲存位置：專案根目錄（`hw6` 資料夾內）

---

## 檔案內容範本

將以下內容複製到 `.env.local` 檔案中，並替換為你的實際值：

```env
# ============================================
# MongoDB Atlas 連線設定
# ============================================
MONGODB_URI=mongodb+srv://ziyenhua_db_user:AgSMi49CxhCDQDE9@hw6.wkp7fji.mongodb.net/?appName=hw6

# ============================================
# LINE Bot 設定
# 從 LINE Developers Console 取得：
# https://developers.line.biz/console/
# ============================================
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
LINE_CHANNEL_SECRET=your_line_channel_secret_here

# ============================================
# OpenAI API 設定
# 從 OpenAI Platform 取得：
# https://platform.openai.com/api-keys
# ============================================
OPENAI_API_KEY=sk-your_openai_api_key_here

# ============================================
# Next.js 應用程式 URL
# 開發環境：http://localhost:3000
# 生產環境：https://your-domain.vercel.app
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 重要注意事項

### 1. 檔案格式

- ✅ **正確**：每行一個變數，格式為 `變數名稱=值`
- ✅ **正確**：可以使用 `#` 開頭加入註解
- ❌ **錯誤**：不要在等號前後加空格（除非值本身需要空格）
- ❌ **錯誤**：不要用引號包圍值（除非值本身需要引號）

**範例：**
```env
# ✅ 正確
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
OPENAI_API_KEY=sk-1234567890abcdef

# ❌ 錯誤（不要加空格）
MONGODB_URI = mongodb+srv://...

# ❌ 錯誤（不要加引號，除非值本身需要）
MONGODB_URI="mongodb+srv://..."
```

### 2. 密碼包含特殊字元

如果密碼包含特殊字元（如 `@`, `#`, `$`, `%`, `&`, `+`, `=`），需要進行 **URL 編碼**：

| 字元 | URL 編碼 |
|------|----------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |

**範例：**
如果密碼是 `P@ssw0rd#123`，連線字串應該是：
```env
MONGODB_URI=mongodb+srv://username:P%40ssw0rd%23123@cluster.mongodb.net/dbname
```

### 3. 不要提交到 Git

確保 `.env.local` 已在 `.gitignore` 中（專案已包含此設定）。

檢查方法：
```bash
# 檢查 .gitignore 是否包含 .env.local
grep "\.env\.local" .gitignore
```

### 4. 檔案位置

`.env.local` 必須放在**專案根目錄**，與 `package.json` 同一層：

```
hw6/
├── .env.local          ← 這裡
├── package.json
├── next.config.ts
├── app/
├── lib/
└── ...
```

---

## 驗證設定

### 方法 1：檢查檔案是否存在

```bash
# macOS / Linux
ls -la .env.local

# Windows (PowerShell)
Test-Path .env.local

# Windows (CMD)
dir .env.local
```

### 方法 2：檢查檔案內容

```bash
# macOS / Linux
cat .env.local

# Windows (PowerShell)
Get-Content .env.local

# Windows (CMD)
type .env.local
```

### 方法 3：測試環境變數載入

建立測試腳本 `test-env.js`：

```javascript
require('dotenv').config({ path: '.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ 已設定' : '❌ 未設定');
console.log('LINE_CHANNEL_ACCESS_TOKEN:', process.env.LINE_CHANNEL_ACCESS_TOKEN ? '✅ 已設定' : '❌ 未設定');
console.log('LINE_CHANNEL_SECRET:', process.env.LINE_CHANNEL_SECRET ? '✅ 已設定' : '❌ 未設定');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ 已設定' : '❌ 未設定');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ 未設定');
```

執行測試：
```bash
node test-env.js
```

### 方法 4：測試 MongoDB 連線

使用專案提供的測試腳本：

```bash
node scripts/test-mongodb.js
```

---

## 完整範例（根據你的設定）

根據你提供的 MongoDB URI，完整的 `.env.local` 應該是：

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://ziyenhua_db_user:AgSMi49CxhCDQDE9@hw6.wkp7fji.mongodb.net/?appName=hw6

# LINE Bot
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
LINE_CHANNEL_SECRET=your_line_channel_secret_here

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 常見問題

### ❌ 問題：檔案名稱顯示為 `.env.local.txt`

**原因**：Windows 系統預設隱藏已知副檔名，導致建立時變成 `.env.local.txt`

**解決方法**：
1. 在檔案總管中顯示副檔名
2. 重新命名檔案，確保沒有 `.txt` 副檔名
3. 或使用命令列建立：
   ```cmd
   echo. > .env.local
   ```

### ❌ 問題：環境變數讀取不到

**可能原因：**
1. 檔案位置錯誤（不在專案根目錄）
2. 檔案名稱錯誤（應該是 `.env.local`，不是 `env.local`）
3. 變數名稱拼寫錯誤
4. 等號前後有空格

**解決方法：**
- 檢查檔案位置和名稱
- 確認變數名稱正確
- 確認格式正確（`變數名稱=值`，無空格）

### ❌ 問題：MongoDB 連線失敗

**可能原因：**
1. 連線字串格式錯誤
2. 密碼包含特殊字元未編碼
3. IP 未加入白名單

**解決方法：**
- 參考 [MONGODB_SETUP.md](./MONGODB_SETUP.md) 檢查連線字串
- 確認密碼特殊字元已編碼
- 檢查 MongoDB Atlas Network Access 設定

---

## 📝 檢查清單

完成以下項目後，你的 `.env.local` 就設定完成了：

- [ ] 已建立 `.env.local` 檔案（在專案根目錄）
- [ ] 已填入 `MONGODB_URI`（根據你的 MongoDB Atlas 設定）
- [ ] 已填入 `LINE_CHANNEL_ACCESS_TOKEN`（從 LINE Developers Console 取得）
- [ ] 已填入 `LINE_CHANNEL_SECRET`（從 LINE Developers Console 取得）
- [ ] 已填入 `OPENAI_API_KEY`（從 OpenAI Platform 取得）
- [ ] 已填入 `NEXT_PUBLIC_APP_URL`（開發環境：`http://localhost:3000`）
- [ ] 已確認檔案格式正確（無多餘空格、引號）
- [ ] 已確認檔案不會被提交到 Git（已在 `.gitignore` 中）

---

## 🎉 完成！

現在你的 `.env.local` 已經設定完成，可以開始使用專案了！

**下一步：**
1. 確認所有環境變數都已正確設定
2. 執行 `npm install` 安裝依賴
3. 執行 `npm run dev` 啟動開發伺服器
4. 測試 MongoDB 連線：`node scripts/test-mongodb.js`

---

## 📚 相關資源

- [Next.js 環境變數文件](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [MongoDB Atlas 設定指南](./MONGODB_SETUP.md)
- [專案設定指南](./SETUP.md)


# Vercel 設定檢查清單

## ❌ 問題：Deployments 頁面顯示 "No Results"

這通常表示專案設定有問題，需要檢查以下項目：

## ✅ 必須檢查的設定

### 1. Root Directory 設定（最重要！）

**操作步驟：**
1. 在 Vercel Dashboard，點擊專案 `wp1141`
2. 點擊左側選單的 **Settings**
3. 點擊 **General**（第一個選項）
4. 向下滾動找到 **Root Directory**
5. 確認設定為：`hw5`
   - 如果空白或顯示其他值，請：
     - 點擊 **Edit**
     - 輸入：`hw5`
     - 點擊 **Save**
6. **重要**：修改 Root Directory 後，需要重新部署

### 2. Git Repository 連接

**操作步驟：**
1. 在 Settings 頁面，點擊 **Git**
2. 確認顯示：
   - Repository: `HanaHau/wp1141`
   - Production Branch: `main`
3. 如果沒有顯示或顯示錯誤：
   - 可能需要重新連接 GitHub
   - 或檢查 Vercel 的 GitHub 應用程式權限

### 3. Framework Preset

**操作步驟：**
1. 在 Settings → General
2. 確認 **Framework Preset** 顯示為：`Next.js`
3. 如果顯示其他或空白，可能需要：
   - 刪除專案並重新建立
   - 或手動設定

### 4. Build & Development Settings

**操作步驟：**
1. 在 Settings → General
2. 向下滾動找到 **Build & Development Settings**
3. 確認：
   - Build Command: `npm run build`（或空白，使用預設）
   - Output Directory: `.next`（或空白，使用預設）
   - Install Command: `npm install`（或空白，使用預設）

## 🔧 解決方案

### 方案 A：修正 Root Directory 後手動觸發部署

1. 按照上述步驟設定 Root Directory 為 `hw5`
2. 儲存後，前往 **Deployments** 頁面
3. 查看是否有 "Redeploy" 或 "Deploy" 按鈕
4. 如果沒有，建立一個新的空 commit 觸發：
   ```bash
   git commit --allow-empty -m "trigger: 重新觸發 Vercel 部署"
   git push origin main
   ```

### 方案 B：刪除並重新建立專案（如果設定無法修改）

1. 在 Vercel Dashboard，選擇專案
2. 前往 Settings → General
3. 滾動到底部，點擊 **Delete Project**
4. 重新建立專案：
   - 選擇 `HanaHau/wp1141` repository
   - **重要**：在設定頁面，Root Directory 輸入 `hw5`
   - 然後點擊 Deploy

### 方案 C：檢查專案結構

確認 GitHub repository 中的檔案結構是否正確：
- Repository: `HanaHau/wp1141`
- 專案檔案應該在 `hw5/` 資料夾內
- 應該包含：`package.json`, `next.config.ts` 等檔案

## 📋 檢查命令

在本地執行以下命令確認專案結構：

```bash
cd /Users/hannah/wp1141/hw5
ls -la
# 應該看到 package.json, next.config.ts 等檔案
```

## 🎯 預期結果

設定正確後，應該會看到：
1. Deployments 頁面出現新的部署記錄
2. 部署狀態顯示 "Building" → "Deploying" → "Ready"
3. 部署完成後顯示網址：`https://wp1141-gamma.vercel.app`

## ⚠️ 常見錯誤

1. **Root Directory 空白或錯誤**
   - 錯誤：空白或 `./`
   - 正確：`hw5`

2. **Framework 未正確偵測**
   - 如果 Root Directory 錯誤，Next.js 可能無法被偵測

3. **Git Repository 未連接**
   - 需要重新連接 GitHub

## 💡 提示

如果修改了 Root Directory：
- 必須儲存設定
- 通常會自動觸發部署
- 如果沒有，手動推送一次代碼或點擊 Redeploy


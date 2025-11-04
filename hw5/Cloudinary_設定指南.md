# Cloudinary 設定指南

## 📋 概述

專案已整合 Cloudinary 圖片儲存服務，可以將用戶上傳的頭貼和背景圖上傳到 Cloudinary，而不是儲存在 MongoDB 中。

**重要特性：**
- ✅ 自動回退機制：如果 Cloudinary 未設定，會自動使用 Base64 儲存
- ✅ 圖片自動優化：Cloudinary 會自動壓縮和優化圖片
- ✅ CDN 加速：圖片透過 Cloudinary CDN 快速載入

## 🔧 設定步驟

### 步驟 1: 註冊 Cloudinary 帳號

1. 前往 [Cloudinary](https://cloudinary.com/)
2. 點擊 "Sign Up" 註冊免費帳號
3. 登入後，前往 Dashboard

### 步驟 2: 取得憑證

在 Cloudinary Dashboard 中，您可以找到：

- **Cloud Name** - 例如：`dxyz12345`
- **API Key** - 例如：`123456789012345`
- **API Secret** - 例如：`abcdefghijklmnopqrstuvwxyz123456`

### 步驟 3: 設定環境變數

#### 本機開發 (.env.local)

```bash
CLOUDINARY_CLOUD_NAME=你的-cloud-name
CLOUDINARY_API_KEY=你的-api-key
CLOUDINARY_API_SECRET=你的-api-secret
```

#### Vercel 部署

1. 前往 Vercel Dashboard → 您的專案 → Settings → Environment Variables
2. 新增以下三個環境變數：
   ```
   CLOUDINARY_CLOUD_NAME=你的-cloud-name
   CLOUDINARY_API_KEY=你的-api-key
   CLOUDINARY_API_SECRET=你的-api-secret
   ```
3. 設定為適用於 **Production, Preview, Development** 三個環境
4. 重新部署專案

## 🎯 使用方式

### 自動上傳

當用戶在「編輯個人資料」頁面上傳圖片時：

1. 系統會自動嘗試上傳到 Cloudinary
2. 如果 Cloudinary 已設定，圖片會上傳到 Cloudinary 並儲存 URL
3. 如果 Cloudinary 未設定，會自動回退到 Base64 儲存（原有方式）

### 圖片儲存位置

- **頭貼（Avatar）**：`x-clone/avatars/`
- **背景圖（Cover Image）**：`x-clone/cover-images/`

## 📁 檔案結構

```
hw5/
├── lib/
│   └── cloudinary.ts          # Cloudinary 設定和上傳函數
├── app/
│   └── api/
│       └── upload/
│           └── route.ts       # 圖片上傳 API
└── components/
    └── EditProfileModal.tsx   # 已整合 Cloudinary 上傳
```

## 🔍 功能說明

### 1. 自動回退機制

如果 Cloudinary 環境變數未設定，系統會：
- 顯示警告訊息（僅在 Console）
- 自動使用 Base64 儲存（原有方式）
- 不影響現有功能運作

### 2. 圖片優化

Cloudinary 會自動：
- 壓縮圖片以減少檔案大小
- 轉換為最佳格式（WebP 等）
- 提供 CDN 加速載入

### 3. 安全性

- API Secret 只在伺服器端使用
- 不會暴露給客戶端
- 上傳需要登入驗證

## 🧪 測試步驟

### 1. 測試 Cloudinary 上傳

1. 設定 Cloudinary 環境變數
2. 登入並前往個人頁面
3. 點擊 "Edit profile"
4. 上傳新的頭貼或背景圖
5. 檢查資料庫中的 `image` 或 `coverImage` 欄位
   - 應該看到 Cloudinary URL（例如：`https://res.cloudinary.com/...`）
   - 而不是 Base64 字串

### 2. 測試回退機制

1. 移除 Cloudinary 環境變數
2. 重新啟動開發伺服器
3. 上傳圖片
4. 應該會自動使用 Base64 儲存（原有方式）

## ⚠️ 注意事項

### 免費額度限制

Cloudinary 免費方案提供：
- 25 GB 儲存空間
- 25 GB 月流量
- 對於小型專案已經足夠

### 圖片格式

支援的格式：
- JPEG, PNG, GIF, WebP, SVG
- 自動轉換為最佳格式

### 遷移現有圖片

目前沒有自動遷移功能。如果需要將現有的 Base64 圖片遷移到 Cloudinary：

1. 建立一個遷移腳本
2. 讀取資料庫中的 Base64 圖片
3. 上傳到 Cloudinary
4. 更新資料庫中的 URL

## 🐛 故障排除

### 問題：上傳失敗，但使用 Base64 成功

**可能原因：**
- Cloudinary 環境變數未設定
- API 憑證錯誤
- 網路連線問題

**解決方法：**
1. 檢查環境變數是否正確設定
2. 檢查 Cloudinary Dashboard 的憑證
3. 查看 Console 中的錯誤訊息

### 問題：圖片無法顯示

**可能原因：**
- Next.js Image 組件未允許 Cloudinary 域名
- 圖片 URL 格式錯誤

**解決方法：**
- 確認 `next.config.ts` 中已加入 `res.cloudinary.com` 到 `remotePatterns`

## 📚 相關文件

- [Cloudinary 官方文件](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

## ✅ 檢查清單

設定完成後，確認：

- [ ] Cloudinary 帳號已註冊
- [ ] 環境變數已設定（本機和 Vercel）
- [ ] 可以成功上傳圖片
- [ ] 圖片可以正常顯示
- [ ] 回退機制正常運作（未設定時使用 Base64）

---

**所有設定完成！** 🎉


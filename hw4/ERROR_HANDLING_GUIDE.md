# 錯誤提示設計說明

## 📋 概述

本專案在登入和註冊頁面實作了詳細的錯誤提示系統，根據不同的錯誤類型顯示不同的視覺樣式和圖示。

## 🔐 登入頁面錯誤提示

### 錯誤類型與樣式

| 錯誤類型 | 背景顏色 | 邊框顏色 | 文字顏色 | 圖示 | 範例訊息 |
|---------|---------|---------|---------|------|---------|
| 查無此帳號 | 橘色 (`bg-orange-50`) | 橘色 (`border-orange-200`) | 橘色 (`text-orange-700`) | ❓ | 查無此帳號 |
| 密碼錯誤 | 紅色 (`bg-red-50`) | 紅色 (`border-red-200`) | 紅色 (`text-red-700`) | 🔒 | 密碼錯誤 |
| 請填寫所有欄位 | 藍色 (`bg-blue-50`) | 藍色 (`border-blue-200`) | 藍色 (`text-blue-700`) | ℹ️ | 請填寫所有欄位 |
| 伺服器錯誤 | 紫色 (`bg-purple-50`) | 紫色 (`border-purple-200`) | 紫色 (`text-purple-700`) | ⚙️ | 伺服器錯誤，請稍後再試 |
| 其他錯誤 | 紅色 (`bg-red-50`) | 紅色 (`border-red-200`) | 紅色 (`text-red-700`) | ❌ | 網路連線錯誤 |

### 錯誤處理邏輯

```typescript
if (err.response?.status === 401) {
  // 使用後端回傳的具體錯誤訊息
  errorMessage = err.response?.data?.error || '查無此帳號或密碼錯誤';
} else if (err.response?.status === 400) {
  errorMessage = err.response?.data?.error || '請檢查輸入格式';
} else if (err.response?.status >= 500) {
  errorMessage = '伺服器錯誤，請稍後再試';
} else if (err.message) {
  errorMessage = err.message;
} else {
  errorMessage = '網路連線錯誤，請檢查網路連線';
}
```

## 📝 註冊頁面錯誤提示

### 錯誤類型與樣式

| 錯誤類型 | 背景顏色 | 邊框顏色 | 文字顏色 | 圖示 | 範例訊息 |
|---------|---------|---------|---------|------|---------|
| 帳號重複 | 橘色 (`bg-orange-50`) | 橘色 (`border-orange-200`) | 橘色 (`text-orange-700`) | ⚠️ | 此 Email 已被註冊 |
| 密碼問題 | 黃色 (`bg-yellow-50`) | 黃色 (`border-yellow-200`) | 黃色 (`text-yellow-700`) | 🔑 | 密碼不一致 / 密碼長度至少需要 6 個字元 |
| 請填寫所有欄位 | 藍色 (`bg-blue-50`) | 藍色 (`border-blue-200`) | 藍色 (`text-blue-700`) | ℹ️ | 請填寫所有欄位 |
| 其他錯誤 | 紅色 (`bg-red-50`) | 紅色 (`border-red-200`) | 紅色 (`text-red-700`) | ❌ | 註冊失敗 |

### 錯誤處理邏輯

```typescript
// 前端驗證
if (!username || !email || !password || !confirmPassword) {
  setError('請填寫所有欄位');
  return;
}

if (password !== confirmPassword) {
  setError('密碼不一致');
  return;
}

if (password.length < 6) {
  setError('密碼長度至少需要 6 個字元');
  return;
}

// 後端驗證
if (err.response?.status === 400) {
  errorMessage = err.response?.data?.error || '此 Email 已被註冊';
} else if (err.response?.status >= 500) {
  errorMessage = '伺服器錯誤，請稍後再試';
} else if (err.message) {
  errorMessage = err.message;
} else {
  errorMessage = '網路連線錯誤，請檢查網路連線';
}
```

## 🎨 設計原則

### 1. 視覺層次
- 使用不同的顏色來區分錯誤的嚴重程度和類型
- 橘色：警告性錯誤（帳號不存在、帳號重複）
- 紅色：嚴重錯誤（密碼錯誤、系統錯誤）
- 黃色：輸入格式問題（密碼不一致）
- 藍色：資訊提示（請填寫欄位）
- 紫色：系統問題（伺服器錯誤）

### 2. 圖示語意
- ❓ 問號：表示找不到資訊（查無此帳號）
- 🔒 鎖頭：表示認證失敗（密碼錯誤）
- ⚠️ 警告：表示操作衝突（帳號重複）
- 🔑 鑰匙：表示密碼相關問題
- ℹ️ 資訊：表示需要補充資訊
- ⚙️ 齒輪：表示系統問題
- ❌ 叉號：表示一般錯誤

### 3. 使用者體驗
- 錯誤訊息清晰明確，告訴使用者具體問題
- 使用柔和的背景色，避免過於刺眼
- 提供視覺圖示，增強可讀性
- 錯誤訊息即時顯示，不需等待

## 🧪 測試方式

### 登入頁面測試

1. **測試查無此帳號**
   - 輸入不存在的 email
   - 應顯示橘色警告框和 ❓ 圖示

2. **測試密碼錯誤**
   - 使用測試帳號 `test@example.com`
   - 輸入錯誤的密碼
   - 應顯示紅色錯誤框和 🔒 圖示

3. **測試空欄位**
   - 不填寫任何欄位就提交
   - 應顯示藍色資訊框和 ℹ️ 圖示

### 註冊頁面測試

1. **測試帳號重複**
   - 使用已存在的 email `test@example.com`
   - 應顯示橘色警告框和 ⚠️ 圖示

2. **測試密碼不一致**
   - 輸入不同的密碼和確認密碼
   - 應顯示黃色警告框和 🔑 圖示

3. **測試密碼長度**
   - 輸入少於 6 個字元的密碼
   - 應顯示黃色警告框和 🔑 圖示

4. **測試空欄位**
   - 不填寫任何欄位就提交
   - 應顯示藍色資訊框和 ℹ️ 圖示

## 📄 相關檔案

- `/frontend/src/pages/LoginPage.tsx` - 登入頁面
- `/frontend/src/pages/RegisterPage.tsx` - 註冊頁面
- `/backend/src/routes/auth.ts` - 認證 API
- `/frontend/src/context/AppContext.tsx` - 認證上下文

## 🔗 後端錯誤訊息

後端在以下情況會回傳特定錯誤：

- `401` - 查無此帳號 / 密碼錯誤
- `400` - 此 Email 已被註冊 / 輸入格式錯誤
- `500+` - 伺服器錯誤

前端會根據 HTTP 狀態碼和後端回傳的 `error` 欄位來顯示對應的錯誤訊息。


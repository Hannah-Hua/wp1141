# 錯誤提示功能測試

## 🐛 問題診斷

### 問題描述
錯誤提示只會出現一瞬間，頁面就會自動刷新。

### 可能原因
1. ✅ **已修復**: `useEffect` 依賴項問題導致無限循環
2. ✅ **已修復**: `register` 函數拋出的錯誤對象不正確
3. ✅ **已確認正常**: 表單提交時有 `e.preventDefault()`

## 🔧 修復內容

### 1. LoginPage.tsx & RegisterPage.tsx - 錯誤處理邏輯優化

**問題**: 錯誤提示一閃而過，無法持續顯示

**原因**:
1. `setIsLoading(false)` 被放在 `finally` 區塊，在錯誤情況下也會執行
2. 錯誤訊息設置後立即被清除
3. 沒有正確的控制流程順序

**修復前**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');  // ❌ 立即清除錯誤

  if (!email || !password) {
    setError('請填寫所有欄位');
    return;  // ❌ 但 isLoading 沒有重置
  }

  try {
    setIsLoading(true);
    await login(email, password);
    navigate('/');
  } catch (err: any) {
    // ...
    setError(errorMessage);
  } finally {
    setIsLoading(false);  // ❌ 成功和失敗都會執行
  }
};
```

**修復後**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ✅ 前端驗證 - 先不清除錯誤
  if (!email || !password) {
    setError('請填寫所有欄位');
    setIsLoading(false);  // ✅ 確保載入狀態正確
    return;
  }

  // ✅ 通過驗證後才清除舊錯誤並開始載入
  setError('');
  setIsLoading(true);

  try {
    await login(email, password);
    navigate('/');  // ✅ 只有成功才導航
  } catch (err: any) {
    console.log('登入錯誤捕獲:', err);
    // ...
    setError(errorMessage);
    setIsLoading(false);  // ✅ 只在錯誤時重置載入狀態
  }
  // ✅ 移除 finally，成功時不需要重置 isLoading
};
```

**關鍵改進**:
1. ✅ 前端驗證失敗時，不清除錯誤訊息
2. ✅ 前端驗證失敗時，確保 `isLoading` 為 `false`
3. ✅ 只有通過前端驗證後，才清除舊錯誤並開始載入
4. ✅ 移除 `finally` 區塊，只在錯誤時重置 `isLoading`
5. ✅ 成功時會導航，不需要重置 `isLoading`
6. ✅ 添加 console.log 方便除錯

### 2. AppContext.tsx - useEffect 優化

**修復前**:
```typescript
useEffect(() => {
  const { token, user } = authService.getStoredAuth();
  if (token && user) {
    setAuth({ isAuthenticated: true, user });
    loadCafes();  // 可能導致無限循環
    loadVisits();
    loadWishlist();
  }
}, []);
```

**修復後**:
```typescript
useEffect(() => {
  const initAuth = async () => {
    const { token, user } = authService.getStoredAuth();
    if (token && user) {
      setAuth({ isAuthenticated: true, user });
      try {
        const cafesData = await cafeService.getAllCafes();
        setCafes(cafesData);
        
        const visitsData = await visitService.getMyVisits();
        setVisits(visitsData);
        
        const wishlistData = await wishlistService.getMyWishlist();
        setWishlist(wishlistData);
      } catch (err) {
        console.error('初始化載入資料失敗:', err);
      }
    }
  };
  
  initAuth();
}, []);
```

### 2. authService.ts - 使用 publicApi 避免 401 自動重定向

**問題**: 「查無此帳號」和「密碼錯誤」的錯誤提示無法持續顯示

**原因**:
登入和註冊使用的是帶有認證攔截器的 `api` 實例。當收到 401 錯誤時，`api.ts` 中的響應攔截器會自動執行：
```typescript
// api.ts 的攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ❌ 自動清除 token 並重定向，導致錯誤提示消失
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**修復前**:
```typescript
// authService.ts
import api from './api';

// ❌ 使用帶有 401 攔截器的 api
export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function register(username: string, email: string, password: string) {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
}
```

**修復後**:
```typescript
// authService.ts
import api, { publicApi } from './api';

// ✅ 使用不帶認證攔截器的 publicApi
export async function login(email: string, password: string) {
  const response = await publicApi.post('/auth/login', { email, password });
  return response.data;
}

export async function register(username: string, email: string, password: string) {
  const response = await publicApi.post('/auth/register', { username, email, password });
  return response.data;
}
```

**說明**:
- ✅ `publicApi` 沒有 401 自動重定向的攔截器
- ✅ 登入和註冊失敗時，不會觸發頁面重定向
- ✅ 錯誤可以正常被 LoginPage 和 RegisterPage 捕獲
- ✅ `/auth/me` 仍使用 `api`，因為它需要 token 且應該在 401 時登出

### 3. AppContext.tsx - register 函數修復

**修復前**:
```typescript
throw new Error(errorMessage);  // 丟失原始錯誤對象
```

**修復後**:
```typescript
throw err;  // 保持原始錯誤對象，讓 RegisterPage 可以訪問 err.response
```

## 🧪 測試步驟

### 登入頁面測試

1. **測試 "請填寫所有欄位"**
   - 開啟登入頁面
   - 不填寫任何欄位，直接點擊「登入」
   - ✅ 預期結果：顯示藍色提示框，訊息為「請填寫所有欄位」，圖示為 ℹ️
   - ✅ 錯誤提示應該持續顯示，不會自動消失

2. **測試 "查無此帳號"**
   - 輸入不存在的 email: `notexist@example.com`
   - 輸入任意密碼
   - 點擊「登入」
   - ✅ 預期結果：顯示橘色提示框，訊息為「查無此帳號」，圖示為 ❓
   - ✅ 錯誤提示應該持續顯示，不會自動消失

3. **測試 "密碼錯誤"**
   - 輸入測試帳號: `test@example.com`
   - 輸入錯誤密碼: `wrongpassword`
   - 點擊「登入」
   - ✅ 預期結果：顯示紅色提示框，訊息為「密碼錯誤」，圖示為 🔒
   - ✅ 錯誤提示應該持續顯示，不會自動消失

### 註冊頁面測試

1. **測試 "請填寫所有欄位"**
   - 開啟註冊頁面
   - 不填寫任何欄位，直接點擊「註冊」
   - ✅ 預期結果：顯示藍色提示框，訊息為「請填寫所有欄位」，圖示為 ℹ️
   - ✅ 錯誤提示應該持續顯示

2. **測試 "密碼不一致"**
   - 填寫所有欄位
   - 密碼: `password123`
   - 確認密碼: `password456`
   - 點擊「註冊」
   - ✅ 預期結果：顯示黃色提示框，訊息為「密碼不一致」，圖示為 🔑
   - ✅ 錯誤提示應該持續顯示

3. **測試 "密碼長度至少需要 6 個字元"**
   - 填寫所有欄位
   - 密碼和確認密碼都填: `12345`
   - 點擊「註冊」
   - ✅ 預期結果：顯示黃色提示框，訊息為「密碼長度至少需要 6 個字元」，圖示為 🔑
   - ✅ 錯誤提示應該持續顯示

4. **測試 "此 Email 已被註冊"**
   - 使用已存在的 email: `test@example.com`
   - 填寫其他欄位
   - 密碼長度 >= 6，且密碼一致
   - 點擊「註冊」
   - ✅ 預期結果：顯示橘色提示框，訊息為「此 Email 已被註冊」，圖示為 ⚠️
   - ✅ 錯誤提示應該持續顯示

## ✅ 驗證清單

- [ ] 登入頁面 - 空欄位提示正常顯示且不會消失
- [ ] 登入頁面 - 查無此帳號提示正常顯示且不會消失
- [ ] 登入頁面 - 密碼錯誤提示正常顯示且不會消失
- [ ] 註冊頁面 - 空欄位提示正常顯示且不會消失
- [ ] 註冊頁面 - 密碼不一致提示正常顯示且不會消失
- [ ] 註冊頁面 - 密碼長度提示正常顯示且不會消失
- [ ] 註冊頁面 - Email 已被註冊提示正常顯示且不會消失

## 📝 預期行為

### 正常流程
1. 使用者填寫表單
2. 點擊提交按鈕
3. 如果有錯誤，顯示錯誤提示框
4. 錯誤提示框**持續顯示**直到：
   - 使用者重新提交表單（會先清除舊錯誤）
   - 使用者導航到其他頁面

### 異常流程（已修復）
1. ❌ 錯誤提示一閃而過
2. ❌ 頁面自動刷新
3. ❌ 無限循環導致頁面卡住

## 🔍 除錯提示

如果錯誤提示仍然一閃而過，請檢查：

1. **瀏覽器控制台**
   - 是否有無限循環錯誤
   - 是否有 React 警告
   - 是否有網路請求錯誤

2. **React DevTools**
   - 檢查組件是否不斷重新渲染
   - 檢查 state 是否正常更新

3. **網路面板**
   - 檢查是否有重複的 API 請求
   - 檢查 API 回應是否正確

## 📄 相關檔案

- `/frontend/src/pages/LoginPage.tsx` - 登入頁面
- `/frontend/src/pages/RegisterPage.tsx` - 註冊頁面
- `/frontend/src/context/AppContext.tsx` - 應用上下文（已修復）
- `/backend/src/routes/auth.ts` - 認證 API

## 🎯 下一步

請按照上述測試步驟進行驗證，確認錯誤提示是否正常持續顯示。如果仍有問題，請提供：
1. 瀏覽器控制台的錯誤訊息
2. 網路面板的請求詳情
3. 具體的重現步驟

# Unfollow 即時更新測試

## 實現的更新機制

### 1. CustomEvent（同一頁面內即時過濾）
當您在個人頁面 unfollow 某人時，會觸發 `user-unfollowed` 事件，Following 頁面立即過濾掉該用戶的所有貼文。

### 2. localStorage + 路徑監聽（路由跳轉檢測）
當您從個人頁面返回首頁時，系統會檢查 `followingChanged` 標記，如果有變化就重新載入貼文。

### 3. Storage 事件（跨標籤頁）
如果您在不同的瀏覽器標籤頁操作，storage 事件會通知其他標籤頁更新。

## 測試步驟

### 測試 1：同一頁面路由跳轉
1. **開啟首頁**，切換到 "Following" 標籤
2. **點擊某個用戶的頭像**，進入該用戶的個人頁面
3. **點擊 Unfollow 按鈕**
4. **點擊瀏覽器的返回按鈕**，或點擊側邊欄的 "Home"
5. **驗證**：該用戶的貼文應該已經消失

### 測試 2：直接在 Following 頁面（如果已經顯示）
1. **開啟首頁**，切換到 "Following" 標籤
2. **在新標籤頁**開啟某個用戶的個人頁面
3. **點擊 Unfollow 按鈕**
4. **切換回首頁標籤**
5. **驗證**：該用戶的貼文應該會在幾秒內消失（storage 事件觸發）

### 測試 3：檢查 Console 日誌
打開瀏覽器開發者工具的 Console，應該看到：
- `Detected following change, reloading posts...`（當返回首頁時）
- `Storage changed, reloading following posts...`（跨標籤頁時）

## 調試資訊

如果更新沒有生效，請檢查：

1. **Console 日誌**：是否有錯誤訊息
2. **Network 面板**：是否有 `/api/posts?following=true` 請求
3. **localStorage**：檢查 `followingChanged` 的值
4. **sessionStorage**：檢查 `lastFollowingFetch` 的值

在 Console 中執行：
```javascript
console.log('followingChanged:', localStorage.getItem('followingChanged'));
console.log('lastFollowingFetch:', sessionStorage.getItem('lastFollowingFetch'));
```

## 技術細節

### 事件觸發時機
```typescript
// 在 profile 頁面點擊 unfollow 後：
localStorage.setItem('followingChanged', Date.now().toString());
window.dispatchEvent(new CustomEvent('user-unfollowed', { detail: { userId, userDisplayId } }));
```

### Feed 元件監聽
```typescript
// 1. CustomEvent 監聽（即時過濾）
window.addEventListener('user-unfollowed', handleUserUnfollowed);

// 2. 路徑變化監聽（返回首頁時檢查）
useEffect(() => { ... }, [pathname, activeTab]);

// 3. Storage 事件監聽（跨標籤頁）
window.addEventListener('storage', handleStorageChange);
```

## 預期行為

- ✅ Unfollow 後，該用戶的原創貼文立即消失
- ✅ Unfollow 後，該用戶的轉發貼文立即消失
- ✅ 無需手動刷新頁面
- ✅ 支援同一標籤頁和跨標籤頁
- ✅ 支援瀏覽器前進/後退

---

測試日期：2025-11-06




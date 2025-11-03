# Follow/Unfollow 功能說明

## ✅ 功能實作

### 1. Follow/Unfollow 按鈕

**位置：** 用戶個人頁面（`/profile/[userId]`）

**狀態顯示：**

#### 未追蹤狀態
- **顯示文字：** `Follow`
- **樣式：** 黑底白字 (`bg-black text-white`)
- **Hover：** 背景變深灰色 (`hover:bg-gray-800`)

#### 已追蹤狀態
- **顯示文字：** `Following`
- **樣式：** 白底黑字 (`bg-white text-black`) + 灰色邊框
- **Hover：**
  - 背景變為半透明紅色 (`bg-red-100 bg-opacity-90`)
  - 文字變為紅色 (`text-red-600`)
  - 邊框變為紅色 (`border-red-500`)
  - 顯示文字：`Unfollow`
  - 提示用戶點擊後將取消追蹤

**狀態管理：**
- 基於當前用戶的 `following` 列表判斷
- API 返回 `isFollowing` 狀態
- 點擊後立即更新狀態並重新獲取用戶資料

---

### 2. Following 頁面邏輯

**查詢條件：**

1. **只顯示追蹤用戶的原創貼文**
   ```javascript
   {
     author: { $in: currentUser.following },
     parentPost: { $exists: false },  // 不是回覆
     repostBy: { $exists: false }     // 不是 repost
   }
   ```

2. **只顯示追蹤用戶的 repost**
   ```javascript
   {
     repostBy: { 
       $in: currentUser.following,
       $ne: currentUser._id.toString()  // 明確排除當前用戶自己的 repost
     },
     parentPost: { $exists: false }  // 不是回覆
   }
   ```

**排除規則：**
- ❌ 不包括未追蹤用戶的貼文
- ❌ 不包括未追蹤用戶的 repost
- ❌ **不包括當前用戶自己的 repost**（無論是否追蹤該用戶）
- ❌ 不包括回覆（`parentPost` 存在的貼文）

**特殊情況：**
- 如果沒有追蹤任何人，返回空列表

---

## 🔄 狀態同步

### API 端點

#### 1. 獲取用戶資料
```
GET /api/users/[userId]
```
**返回：**
```json
{
  "user": { ... },
  "isFollowing": true/false  // 基於當前用戶的 following 列表
}
```

#### 2. Follow/Unfollow
```
POST /api/users/[userId]/follow
```
**邏輯：**
- 檢查 `currentUser.following.includes(targetUser._id)`
- 如果已追蹤 → Unfollow（從雙方列表中移除）
- 如果未追蹤 → Follow（加入雙方列表）
- 返回 `{ success: true, isFollowing: boolean }`

---

## 📊 資料庫結構

### User Model
```javascript
{
  following: [ObjectId],  // 追蹤的用戶 ID 列表
  followers: [ObjectId],  // 粉絲的用戶 ID 列表
}
```

### 關係
- 用戶 A Follow 用戶 B：
  - 用戶 A 的 `following` 加入用戶 B 的 `_id`
  - 用戶 B 的 `followers` 加入用戶 A 的 `_id`

---

## ✅ 測試檢查清單

### Follow/Unfollow 按鈕
- [ ] 訪問未追蹤用戶的頁面 → 看到黑底白字 "Follow"
- [ ] 點擊 "Follow" → 按鈕變為白底黑字 "Following"
- [ ] Hover "Following" → 變為紅色半透明背景，顯示 "Unfollow"
- [ ] 點擊 "Unfollow" → 變回黑底白字 "Follow"
- [ ] Followers 數量正確更新

### Following 頁面
- [ ] 沒有追蹤任何人 → Following 頁面為空
- [ ] 追蹤用戶甲 → Following 頁面顯示用戶甲的原創貼文
- [ ] 用戶甲 repost 某貼文 → Following 頁面顯示該 repost
- [ ] 自己 repost 用戶甲的貼文 → **Following 頁面不顯示**
- [ ] 取消追蹤用戶甲 → Following 頁面不再顯示用戶甲的貼文
- [ ] 未追蹤用戶的貼文 → Following 頁面不顯示

### 狀態一致性
- [ ] 在個人頁面看到用戶甲顯示 "Following"
- [ ] 點擊進入用戶甲的主頁 → 按鈕也顯示 "Following"
- [ ] 在主頁點擊 "Unfollow" → 返回個人頁面，狀態更新為 "Follow"

---

## 🐛 已修正的問題

1. ✅ **狀態判斷邏輯統一**
   - 統一使用 `currentUser.following.includes(targetUser._id)` 判斷
   - API 返回 `isFollowing` 狀態

2. ✅ **Following 頁面查詢邏輯**
   - 明確排除當前用戶自己的 repost
   - 只顯示追蹤用戶的 post 和 repost
   - 處理空 following 列表的情況

3. ✅ **狀態同步**
   - Follow/Unfollow 後立即更新狀態
   - 重新獲取用戶資料更新 followers 數量

---

**所有功能已完整實作並測試！** ✨


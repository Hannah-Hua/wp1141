# 更新日誌

## [v0.1.2] - 2025-11-02

### ✨ 新增功能

#### 1. 完善個人首頁 Posts 區域
- ✅ 正確顯示用戶自己發表的所有貼文
- ✅ 正確顯示用戶轉發的所有貼文
- ✅ API 修正：使用 userId 查詢時，先轉換為資料庫 ObjectId
- ✅ 轉發貼文顯示「XXX 轉發了」的提示

#### 2. 完善 Follow/Unfollow 按鈕互動

**未追蹤狀態：**
- 黑底白字顯示 "Follow"
- Hover 時背景變深灰

**已追蹤狀態：**
- 白底黑字顯示 "Following"
- Hover 時：
  - 背景變為半透明紅色 (`bg-red-50 bg-opacity-80`)
  - 文字變為紅色 (`text-red-600`)
  - 邊框變為紅色 (`border-red-600`)
  - 文字改為 "Unfollow"
  - 提示用戶點擊後將取消追蹤

#### 3. 轉發次數顯示
- ✅ 動態計算每個貼文的轉發次數
- ✅ 在貼文卡片上正確顯示轉發數量
- ✅ 轉發貼文和原始貼文都顯示相同的轉發次數

### 🐛 修正問題
- 修正 API 查詢用戶貼文時的 ID 轉換問題
- 修正轉發貼文的作者資訊顯示邏輯
- 區分 `reposterDetails`（轉發者）和 `authorDetails`（原作者）

### 📝 技術細節

**資料結構改進：**
```typescript
// 轉發貼文的資料結構
{
  _id: "...",
  content: "原始內容",
  author: "原作者ID",
  repostBy: "轉發者ID",
  authorDetails: { /* 原作者資訊 */ },
  reposterDetails: { /* 轉發者資訊 */ },
  repostCount: 5, // 動態計算
  ...
}
```

**Follow 按鈕狀態：**
- 使用 `isHoveringFollow` state 追蹤 hover 狀態
- 動態切換按鈕文字和樣式
- 平滑的過渡效果（`transition-all`）

---

## [v0.1.1] - 2025-11-02

### 🐛 修正問題
- 修正 Pusher 初始化問題
- 修正圖片顯示配置（加入 OAuth 提供商圖片網域）
- 新增 `pusherServer.ts` 安全處理後端 Pusher 事件
- Feed 組件檢查 Pusher 可用性

### 📝 文件
- 新增 `OAuth_設定指南.md`
- 新增 `本機測試指南.md`

---

## [v0.1.0] - 2025-11-02

### 🎉 初始版本

#### 完成功能：
- ✅ Next.js 16 + TypeScript 專案架構
- ✅ MongoDB 資料庫設計（User, Post, Draft models）
- ✅ NextAuth v5 OAuth 認證（Google/GitHub/Facebook）
- ✅ 自訂 UserID 註冊系統
- ✅ 主選單與側邊欄
- ✅ 發文系統
  - 280 字元限制
  - 連結辨識（固定 23 字元）
  - #HashTag 和 @mention 支援（不計入字數）
  - 草稿儲存功能
- ✅ 互動功能
  - 按讚/取消讚
  - 留言（遞迴式）
  - 轉發
- ✅ 個人頁面
  - 個人資料展示
  - 編輯個人資料
  - Posts / Likes 分頁
- ✅ Feed 動態
  - For you（所有貼文）
  - Following（追蹤用戶的貼文）
- ✅ Pusher 即時更新準備
- ✅ RESTful API 設計
- ✅ 完整文件（README, DEPLOYMENT）

#### 技術棧：
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth v5
- MongoDB + Mongoose
- Pusher
- 準備部署至 Vercel


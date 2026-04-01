# 首頁載入性能優化

## 問題描述
首頁初次載入時 `/api/posts` 請求耗時 8.5 秒，嚴重影響使用者體驗。

## 主要優化措施

### 1. 資料庫查詢優化 ⚡
**問題：** 原本使用多次資料庫查詢（4-5 次）來獲取貼文、作者資訊、統計數據等。

**解決方案：**
- 使用 MongoDB Aggregation Pipeline 將多個查詢合併為單一查詢
- 使用 `$lookup` 來進行 JOIN 操作，一次性獲取所有相關資料
- 減少網路往返次數和資料庫連接開銷

**程式碼位置：** `/app/api/posts/route.ts` (第 96-195 行)

### 2. 減少初始載入數量 📉
**問題：** 一次載入 50 篇貼文，數據量過大。

**解決方案：**
- 將初始載入數量從 50 篇減少到 20 篇
- 建議後續實作無限滾動或分頁功能

**改動：**
```typescript
// 從
{ $limit: 50 }
// 改為
{ $limit: 20 }
```

### 3. 延長快取時間 ⏱️
**問題：** 快取 TTL 為 30 秒，快取命中率較低。

**解決方案：**
- 首頁和 Following 頁面快取時間延長到 60 秒
- 使用者個人頁面保持 30 秒（更新頻率較高）
- 實作定期清理過期快取機制（每 5 分鐘）

**程式碼位置：** `/lib/cache.ts`

### 4. 資料庫索引優化 🔍
**新增索引：**
- User 模型：`following` 欄位索引（優化追蹤用戶查詢）
- Post 模型：複合索引 `{ author: 1, parentPost: 1, repostBy: 1 }`

**程式碼位置：** 
- `/models/User.ts` (第 76 行)
- `/models/Post.ts` (第 76 行)

### 5. 改善使用者體驗 ✨
**問題：** 載入時只顯示簡單的「載入中...」文字。

**解決方案：**
- 實作 Loading Skeleton（骨架屏）
- 顯示 5 個動畫骨架元素，讓使用者知道內容正在載入
- 使用 Tailwind CSS 的 `animate-pulse` 效果

**程式碼位置：** `/components/Feed.tsx` (第 141-163 行)

## 預期效果

| 指標 | 優化前 | 優化後（預估） | 改善幅度 |
|------|--------|---------------|---------|
| 首次載入時間 | 8.5s | 1-2s | 75-85% ↓ |
| 資料庫查詢次數 | 4-5 次 | 1 次 | 80% ↓ |
| 載入貼文數量 | 50 篇 | 20 篇 | 60% ↓ |
| 快取命中時間 | ~15ms | ~15ms | 無變化 |
| 使用者體驗 | ⭐⭐ | ⭐⭐⭐⭐ | 明顯改善 |

## 測試步驟

### 1. 清除快取並重新載入
```bash
# 在瀏覽器開發者工具中
localStorage.clear()
sessionStorage.clear()
# 硬重新整理 (Cmd+Shift+R / Ctrl+Shift+R)
```

### 2. 觀察 Network 面板
- 查看 `/api/posts` 的回應時間
- 預期：第一次請求 < 2 秒
- 預期：後續請求 < 50ms（快取）

### 3. 觀察載入體驗
- 應該看到 Loading Skeleton 動畫
- 不再是空白畫面或簡單文字

### 4. 檢查資料庫查詢
```bash
# 在 MongoDB 中啟用 profiling
db.setProfilingLevel(2)
# 查看慢查詢
db.system.profile.find({millis: {$gt: 100}}).pretty()
```

## 後續優化建議

### 短期（1-2 週）
1. **實作分頁或無限滾動**
   - 使用游標分頁（Cursor-based pagination）
   - 只在使用者滾動到底部時載入更多貼文

2. **優化圖片載入**
   - 使用 Next.js Image 元件
   - 實作 lazy loading
   - 壓縮圖片大小

3. **實作 Service Worker**
   - 離線快取
   - 預載入下一頁資料

### 中期（1 個月）
1. **使用 Server-Side Rendering (SSR)**
   - 首頁使用 SSR 減少初次載入時間
   - 使用 `getServerSideProps` 或 App Router 的 Server Components

2. **資料庫優化**
   - 考慮使用 Redis 作為快取層
   - 實作讀寫分離

3. **CDN 優化**
   - 將靜態資源部署到 CDN
   - 使用 Edge Functions

### 長期（3 個月+）
1. **微服務架構**
   - 將貼文服務獨立出來
   - 使用訊息佇列處理非同步任務

2. **搜尋優化**
   - 使用 Elasticsearch 進行全文搜尋
   - 實作搜尋建議（autocomplete）

3. **監控和分析**
   - 整合 Application Performance Monitoring (APM)
   - 設置效能警報

## 相關檔案

- `/app/api/posts/route.ts` - API 路由優化
- `/components/Feed.tsx` - UI 和 Loading Skeleton
- `/models/Post.ts` - 資料模型和索引
- `/models/User.ts` - 使用者模型索引
- `/lib/cache.ts` - 快取機制增強

## 驗證清單

- [x] 減少資料庫查詢次數
- [x] 實作 Aggregation Pipeline
- [x] 減少初始載入數量
- [x] 延長快取時間
- [x] 新增資料庫索引
- [x] 實作 Loading Skeleton
- [x] 快取自動清理機制
- [ ] 實作分頁功能（建議後續實作）
- [ ] 圖片優化（建議後續實作）
- [ ] 部署並測試實際效果

## 注意事項

1. **快取一致性**：由於使用了 60 秒快取，新貼文可能不會立即顯示給所有用戶。但由於有 Pusher 即時更新機制，此問題影響較小。

2. **索引維護**：新增的索引會佔用額外的儲存空間，並影響寫入效能。需要定期監控。

3. **記憶體使用**：快取儲存在記憶體中，需要監控記憶體使用量。如果貼文數量極大，建議改用 Redis。

4. **開發環境 vs 生產環境**：開發環境的資料庫效能通常較差，生產環境的效果可能更好。

## 問題排查

### 如果載入仍然很慢

1. **檢查資料庫連線**
   ```typescript
   console.time('DB Connect');
   await connectDB();
   console.timeEnd('DB Connect');
   ```

2. **檢查個別查詢時間**
   ```typescript
   console.time('Posts Query');
   const posts = await Post.aggregate([...]);
   console.timeEnd('Posts Query');
   ```

3. **檢查索引是否生效**
   ```javascript
   db.posts.getIndexes()
   db.users.getIndexes()
   ```

4. **查看查詢計畫**
   ```javascript
   db.posts.find({...}).explain('executionStats')
   ```

---

最後更新：2025-11-06


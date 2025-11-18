# Timeout 優化總結

## 已完成的優化

### 1. LLM 優化
- ✅ Timeout 從 8 秒 → 2 秒
- ✅ max_tokens 從 1000 → 500
- ✅ 模型從 `gpt-4o-mini` → `gpt-3.5-turbo`（更快）
- ✅ 對話歷史從 5 條 → 2 條

### 2. 資料庫優化
- ✅ 使用 `select()` 只取得需要的欄位
- ✅ 使用 `lean()` 減少資料傳輸
- ✅ 使用 `limit(1)` 確保只取得一個文件
- ✅ `applyGameEffects` 只選擇 `gameState` 欄位

### 3. 執行流程優化
- ✅ **立即回覆 LINE**（不等待資料庫更新）
- ✅ 背景處理 `applyGameEffects` 和 `addMessage`
- ✅ 快速計算進度（不等待資料庫）

### 4. 並行處理
- ✅ 使用者訊息儲存改為背景執行
- ✅ 錯誤訊息儲存改為背景執行

## 當前執行時間估算

```
冷啟動：           ~1-2 秒
資料庫查詢：        ~0.3-0.5 秒
LLM API：          ~1.5-2 秒（timeout 2 秒，gpt-3.5-turbo）
LINE API 回覆：    ~0.5-1 秒（立即執行）
背景處理：         不阻塞 ✅
總計：              ~3.3-5.5 秒 ✅ 應該在限制內
```

## 如果仍然 Timeout

### 檢查步驟

1. **查看 Vercel 函數日誌**
   - 前往 Vercel Dashboard → Deployments → 最新部署
   - 點擊 Functions → `/api/line/webhook`
   - 查看實際執行時間

2. **檢查冷啟動時間**
   - 如果第一次請求很慢，後續請求應該更快
   - 冷啟動可能需要 2-3 秒

3. **檢查網路延遲**
   - Vercel (iad1) → MongoDB Atlas
   - Vercel (iad1) → OpenAI API
   - 如果區域不匹配，延遲會增加

### 進一步優化選項

#### 選項 1：使用 Edge Functions（實驗性）
```typescript
export const runtime = 'edge';
```
- 更快的冷啟動
- 但功能有限（不支援所有 Node.js API）

#### 選項 2：減少 System Prompt 長度
- 簡化 prompt，減少 token 數量
- 可能影響遊戲品質

#### 選項 3：使用快取
- 快取常見回應
- 減少 LLM 呼叫次數

#### 選項 4：升級到 Vercel Pro
- 60 秒執行時間限制
- 更好的效能和資源

#### 選項 5：使用 Queue 系統
- 立即回應 LINE（200 OK）
- 使用 Vercel Queue 或 Upstash Queue 處理
- 但 LINE 的 `replyToken` 有時效性，需要小心處理

## 診斷工具

在程式碼中加入計時：

```typescript
const timings: Record<string, number> = {};

timings.start = Date.now();
await connectDB();
timings.dbConnect = Date.now();

timings.dbQuery = Date.now();
const conversation = await getOrCreateConversation(lineUserId);
timings.dbQueryEnd = Date.now();

timings.llmStart = Date.now();
const turnResult = await generateGameTurn(...);
timings.llmEnd = Date.now();

timings.lineStart = Date.now();
await replyGameOptionsMessage(...);
timings.lineEnd = Date.now();

console.log('Timings:', {
  dbConnect: timings.dbConnect - timings.start,
  dbQuery: timings.dbQueryEnd - timings.dbQuery,
  llm: timings.llmEnd - timings.llmStart,
  line: timings.lineEnd - timings.lineStart,
  total: timings.lineEnd - timings.start,
});
```

## 建議

1. **先檢查 Vercel 日誌**，確認實際執行時間
2. **測試多次**，區分冷啟動和熱啟動
3. **如果冷啟動很慢**，考慮使用 Edge Functions
4. **如果 LLM 很慢**，考慮進一步減少 prompt 長度
5. **如果資料庫很慢**，檢查 MongoDB Atlas 區域設定

## 當前設定

- LLM Model: `gpt-3.5-turbo`
- LLM Timeout: 2 秒
- Max Tokens: 500
- 對話歷史: 2 條
- 背景處理: 已啟用
- Fluid Compute: 已啟用


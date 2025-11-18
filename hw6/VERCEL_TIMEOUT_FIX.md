# Vercel Timeout 問題解決方案

## 為什麼本地不會 timeout，但 Vercel 會？

### 本地開發環境 (`next dev`)
- ✅ **沒有執行時間限制**：可以執行任意長時間
- ✅ **低網路延遲**：本地到 MongoDB/OpenAI 的延遲很低
- ✅ **沒有冷啟動**：開發伺服器持續運行
- ✅ **更多資源**：使用本地電腦的完整資源

### Vercel 生產環境
- ❌ **嚴格時間限制**：
  - 免費方案：**10 秒**（HTTP 流式回應）或 **5 秒**（普通回應）
  - Pro 方案：**60 秒**
- ❌ **冷啟動延遲**：第一次請求需要初始化（+1-2 秒）
- ❌ **網路延遲**：Vercel → MongoDB → OpenAI 的距離更遠（+0.5-1 秒）
- ❌ **資源限制**：免費方案 CPU/記憶體較少

## 時間分配分析

### 本地環境（無限制）
```
資料庫連線：     ~0.1 秒
資料庫查詢：     ~0.2 秒
LLM API 呼叫：   ~3-5 秒
LINE API 回覆：  ~0.3 秒
總計：           ~4-6 秒 ✅ 沒問題
```

### Vercel 環境（10 秒限制）
```
冷啟動：         ~1-2 秒 ⚠️
資料庫連線：      ~0.3-0.5 秒
資料庫查詢：      ~0.5-1 秒
LLM API 呼叫：    ~3-5 秒
LINE API 回覆：   ~0.5-1 秒
總計：            ~6-10 秒 ⚠️ 接近限制
```

## 解決方案

### 方案 1：立即回應 + 背景處理（推薦）

立即回應 LINE（200 OK），然後在背景處理：

```typescript
export async function POST(request: NextRequest) {
  // 驗證簽名
  const body = await request.text();
  const signature = request.headers.get('x-line-signature') || '';
  
  if (!validateSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const events = JSON.parse(body).events || [];
  
  // 立即回應 LINE（避免 timeout）
  const response = NextResponse.json({ success: true });
  
  // 在背景處理事件（不阻塞回應）
  processEventsInBackground(events).catch(err => {
    console.error('Background processing error:', err);
  });
  
  return response;
}
```

**注意**：LINE 的 `replyToken` 有時效性（約 30 秒），所以仍需要在同一個請求中回覆。

### 方案 2：啟用 Vercel Fluid Compute（最簡單）

1. 前往 Vercel Dashboard
2. 選擇你的專案
3. Settings → Functions
4. 啟用 **"Fluid Compute"**
5. 重新部署

這會將執行時間限制延長到 **60 秒**。

### 方案 3：進一步優化程式碼

#### 3.1 減少 LLM timeout
```typescript
// 從 5 秒縮短到 3 秒
const timeoutMs = 3000;
```

#### 3.2 使用更快的 OpenAI 模型
```typescript
// 使用更快的模型（但品質可能略降）
model: 'gpt-3.5-turbo', // 比 gpt-4o-mini 更快
```

#### 3.3 減少 max_tokens
```typescript
max_tokens: 500, // 從 1000 減少到 500
```

#### 3.4 快取資料庫連線
```typescript
// 確保 MongoDB 連線被快取
// 已在 lib/mongodb.ts 中實作
```

### 方案 4：升級到 Vercel Pro

- 執行時間：60 秒
- 更多資源
- 更好的效能

## 建議的優化順序

1. ✅ **立即啟用 Fluid Compute**（最簡單，免費）
2. ✅ **縮短 LLM timeout 到 3 秒**
3. ✅ **減少 max_tokens 到 500**
4. ✅ **檢查 Vercel 日誌**，找出實際瓶頸
5. ⚠️ 如果仍然超時，考慮升級到 Pro 方案

## 檢查實際執行時間

在 Vercel Dashboard：
1. 前往 Deployments
2. 選擇最新的部署
3. 點擊 "Functions" 標籤
4. 查看 `/api/line/webhook` 的執行時間

或在程式碼中加入計時：

```typescript
const startTime = Date.now();
// ... 處理邏輯 ...
console.log(`Total time: ${Date.now() - startTime}ms`);
```

## 常見問題

### Q: 為什麼 LINE 要求 30 秒內回應？
A: LINE 的 webhook 需要在 30 秒內收到 HTTP 200 回應，否則會重試。但 Vercel 的免費方案只有 10 秒限制，所以我們需要在 10 秒內完成。

### Q: 可以使用 Queue 系統嗎？
A: 可以，但需要額外服務（如 Vercel Queue、Upstash Queue）。對於這個專案，啟用 Fluid Compute 是最簡單的解決方案。

### Q: 冷啟動可以避免嗎？
A: 部分可以：
- 使用 Vercel Pro（有更好的冷啟動處理）
- 定期發送 keep-alive 請求（不推薦）
- 使用 Edge Functions（但功能有限）

## 總結

**最簡單的解決方案**：啟用 Vercel Fluid Compute，這會將執行時間限制延長到 60 秒，應該足夠處理所有請求。


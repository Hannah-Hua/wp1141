# OpenAI API 完整設定指南

本指南將協助你從零開始設定 OpenAI API，並整合到你的 LINE Bot 專案中。

## 📋 目錄

1. [建立 OpenAI 帳號](#1-建立-openai-帳號)
2. [取得 API Key](#2-取得-api-key)
3. [設定付款方式](#3-設定付款方式)
4. [設定 API Key 到專案](#4-設定-api-key-到專案)
5. [測試 API 連線](#5-測試-api-連線)
6. [模型選擇與費用](#6-模型選擇與費用)
7. [常見問題](#常見問題)

---

## 1. 建立 OpenAI 帳號

### 步驟 1.1：前往 OpenAI Platform

1. 開啟瀏覽器，前往 [OpenAI Platform](https://platform.openai.com/)
2. 點選右上角的 **"Sign up"** 或 **"Log in"** 按鈕

### 步驟 1.2：註冊帳號

1. **選擇註冊方式**：
   - 使用 **Google 帳號**（推薦，最快速）
   - 使用 **Microsoft 帳號**
   - 使用 **Email 註冊**

2. **填寫基本資訊**：
   - Email 地址
   - 密碼（如果使用 Email 註冊）
   - 姓名（可選）

3. **驗證 Email**：
   - 檢查你的 Email 收件匣
   - 點選驗證連結

4. **完成註冊**：
   - 閱讀並同意服務條款
   - 完成註冊流程

### 步驟 1.3：登入帳號

1. 使用你的帳號登入 [OpenAI Platform](https://platform.openai.com/)
2. 首次登入可能需要驗證手機號碼

---

## 2. 取得 API Key

### 步驟 2.1：前往 API Keys 頁面

1. 登入後，點選右上角的**個人頭像**或**帳號名稱**
2. 在下拉選單中選擇 **"API keys"**
   - 或直接前往：https://platform.openai.com/api-keys

### 步驟 2.2：建立新的 API Key

1. 點選 **"+ Create new secret key"** 按鈕

2. **設定 API Key 名稱**（可選）：
   - 輸入一個有意義的名稱，例如：`LINE Bot HW6`
   - 方便日後管理多個 API Key

3. **複製 API Key**：
   - ⚠️ **重要**：API Key 只會顯示一次！
   - 立即複製並妥善保存
   - 格式類似：`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`
   - 如果忘記，需要刪除舊的 Key 並建立新的

4. 點選 **"Create secret key"** 完成建立

### 步驟 2.3：確認 API Key 建立成功

- 在 API Keys 列表應該會看到你剛建立的 Key
- 顯示的名稱是你剛才設定的（如果有的話）
- Key 本身會以 `sk-...` 開頭，但只顯示部分字元（基於安全考量）

---

## 3. 設定付款方式

### 步驟 3.1：前往 Billing 頁面

1. 點選右上角的**個人頭像**
2. 選擇 **"Billing"** 或 **"Usage"**
   - 或直接前往：https://platform.openai.com/account/billing

### 步驟 3.2：新增付款方式

1. 點選 **"Add payment method"** 或 **"Set up paid account"**

2. **選擇付款方式**：
   - **信用卡**（Visa、Mastercard、American Express）
   - **PayPal**（部分地區支援）

3. **填寫付款資訊**：
   - 信用卡號碼
   - 到期日期
   - CVV 安全碼
   - 帳單地址

4. **設定使用限制**（可選但建議）：
   - 設定每月使用上限（例如：$10、$20）
   - 避免意外超支

### 步驟 3.3：確認付款設定

- 付款方式設定完成後，你的帳號就可以使用付費 API 了
- 新帳號通常有 $5 的免費額度（可能隨時變更）

---

## 4. 設定 API Key 到專案

### 步驟 4.1：開啟 .env.local 檔案

1. 在專案根目錄找到 `.env.local` 檔案
2. 如果還沒有，請參考 [ENV_SETUP.md](./ENV_SETUP.md) 建立

### 步驟 4.2：新增 API Key

在 `.env.local` 檔案中，找到或新增以下行：

```env
OPENAI_API_KEY=sk-proj-你的完整API金鑰
```

**範例**：
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 步驟 4.3：確認格式正確

- ✅ **正確**：`OPENAI_API_KEY=sk-proj-...`（無空格）
- ❌ **錯誤**：`OPENAI_API_KEY = sk-proj-...`（等號前後有空格）
- ❌ **錯誤**：`OPENAI_API_KEY="sk-proj-..."`（不需要引號）

### 步驟 4.4：儲存檔案

- 儲存 `.env.local` 檔案
- 確認檔案已正確儲存

---

## 5. 測試 API 連線

### 步驟 5.1：建立測試腳本

在專案根目錄建立 `scripts/test-openai.js`：

```javascript
require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY 環境變數未設定');
  console.error('請確認 .env.local 檔案存在且包含 OPENAI_API_KEY');
  process.exit(1);
}

console.log('🔄 正在測試 OpenAI API 連線...');
console.log('📍 API Key 前綴：', apiKey.substring(0, 10) + '...');

const openai = new OpenAI({
  apiKey: apiKey,
});

async function testAPI() {
  try {
    // 測試簡單的 API 呼叫
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: '請用一句話介紹你自己',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (response) {
      console.log('✅ OpenAI API 連線成功！');
      console.log('📝 回應內容：', response);
      console.log('💰 使用的 Token 數：', completion.usage?.total_tokens || '未知');
    } else {
      console.error('❌ API 回應格式異常');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ OpenAI API 測試失敗：');
    console.error('錯誤訊息：', error.message);
    console.error('錯誤類型：', error.constructor.name);
    
    if (error.status === 401) {
      console.error('\n💡 可能的原因：');
      console.error('   1. API Key 錯誤或已失效');
      console.error('   2. API Key 格式不正確');
      console.error('   → 請前往 https://platform.openai.com/api-keys 檢查');
    } else if (error.status === 429) {
      console.error('\n💡 可能的原因：');
      console.error('   1. API 配額已用完');
      console.error('   2. 請求速率過快');
      console.error('   → 請前往 https://platform.openai.com/account/billing 檢查');
    } else if (error.status === 402) {
      console.error('\n💡 可能的原因：');
      console.error('   1. 帳號未設定付款方式');
      console.error('   2. 帳號餘額不足');
      console.error('   → 請前往 https://platform.openai.com/account/billing 設定付款');
    }
    
    process.exit(1);
  }
}

testAPI();
```

### 步驟 5.2：執行測試

```bash
# 確保已安裝 dotenv 和 openai 套件
npm install

# 執行測試腳本
node scripts/test-openai.js
```

### 步驟 5.3：檢查結果

**成功訊息應該類似：**
```
🔄 正在測試 OpenAI API 連線...
📍 API Key 前綴：sk-proj-...
✅ OpenAI API 連線成功！
📝 回應內容：我是 OpenAI 開發的 AI 助手...
💰 使用的 Token 數：25
```

**如果出現錯誤，請參考下方「常見問題」章節。**

---

## 6. 模型選擇與費用

### 6.1 專案使用的模型

本專案使用 **`gpt-4o-mini`**，原因：
- ✅ 成本較低（適合大量對話）
- ✅ 回應速度快
- ✅ 功能足夠應付文字冒險遊戲

### 6.2 模型比較

| 模型 | 輸入價格 | 輸出價格 | 速度 | 適用場景 |
|------|---------|---------|------|----------|
| **gpt-4o-mini** | $0.15 / 1M tokens | $0.60 / 1M tokens | 快 | 本專案使用 |
| gpt-4o | $2.50 / 1M tokens | $10.00 / 1M tokens | 中 | 需要更強能力 |
| gpt-4-turbo | $10.00 / 1M tokens | $30.00 / 1M tokens | 慢 | 複雜任務 |
| gpt-3.5-turbo | $0.50 / 1M tokens | $1.50 / 1M tokens | 快 | 簡單對話 |

### 6.3 費用估算

**以 gpt-4o-mini 為例：**

假設每次遊戲回合：
- 輸入：約 500 tokens（系統提示詞 + 對話歷史）
- 輸出：約 200 tokens（遊戲敘事 + 選項）

**單次成本**：
- 輸入：500 / 1,000,000 × $0.15 = $0.000075
- 輸出：200 / 1,000,000 × $0.60 = $0.00012
- **總計：約 $0.0002（台幣約 $0.006）**

**每月成本估算**：
- 100 次對話：約 $0.02（台幣約 $0.6）
- 1,000 次對話：約 $0.20（台幣約 $6）
- 10,000 次對話：約 $2.00（台幣約 $60）

### 6.4 如何查看使用量

1. 前往 [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. 查看：
   - 今日使用量
   - 本月使用量
   - 費用統計
   - Token 使用量

### 6.5 設定使用上限

1. 前往 [Billing Settings](https://platform.openai.com/account/billing/limits)
2. 設定 **"Hard limit"**（硬限制）：
   - 例如：$10 / 月
   - 達到上限後，API 會自動停止
3. 設定 **"Soft limit"**（軟限制）：
   - 例如：$8 / 月
   - 達到上限後，會發送 Email 通知

---

## 常見問題

### ❌ 錯誤：401 Unauthorized

**可能原因：**
1. API Key 錯誤或已失效
2. API Key 格式不正確（缺少 `sk-` 前綴）
3. API Key 被刪除

**解決方法：**
1. 前往 [API Keys 頁面](https://platform.openai.com/api-keys) 檢查
2. 確認 API Key 完整且正確
3. 如果 Key 已刪除，建立新的 Key
4. 更新 `.env.local` 中的 `OPENAI_API_KEY`

### ❌ 錯誤：429 Rate Limit Exceeded

**可能原因：**
1. 請求速率過快（超過每分鐘/每小時限制）
2. 免費額度已用完

**解決方法：**
1. 降低請求頻率（在程式碼中加入延遲）
2. 設定付款方式以獲得更高配額
3. 等待配額重置

### ❌ 錯誤：402 Payment Required

**可能原因：**
1. 帳號未設定付款方式
2. 帳號餘額不足
3. 免費額度已用完

**解決方法：**
1. 前往 [Billing 頁面](https://platform.openai.com/account/billing)
2. 新增付款方式
3. 確認帳號有足夠餘額

### ❌ 錯誤：500 Internal Server Error

**可能原因：**
1. OpenAI 伺服器暫時問題
2. 請求格式錯誤

**解決方法：**
1. 等待幾分鐘後重試
2. 檢查 [OpenAI Status Page](https://status.openai.com/)
3. 檢查請求格式是否正確

### ❌ 錯誤：Model not found

**可能原因：**
1. 模型名稱拼寫錯誤
2. 模型已停用或不存在

**解決方法：**
1. 確認模型名稱正確（例如：`gpt-4o-mini`）
2. 檢查 [Models 文件](https://platform.openai.com/docs/models) 確認模型可用

### ✅ 如何更換模型

在 `lib/llmService.ts` 中修改：

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // 改為你想要的模型
  // ... 其他設定
});
```

### ✅ 如何查看 API 使用記錄

1. 前往 [Usage Dashboard](https://platform.openai.com/usage)
2. 查看詳細的使用記錄
3. 可以依日期、模型、專案篩選

### ✅ 如何刪除 API Key

1. 前往 [API Keys 頁面](https://platform.openai.com/api-keys)
2. 找到要刪除的 Key
3. 點選 **"Delete"** 按鈕
4. 確認刪除

⚠️ **注意**：刪除後無法恢復，需要建立新的 Key。

### ✅ 如何建立多個 API Key

1. 前往 [API Keys 頁面](https://platform.openai.com/api-keys)
2. 點選 **"+ Create new secret key"**
3. 為每個 Key 設定不同的名稱（例如：開發環境、生產環境）
4. 分別使用在不同的專案或環境中

---

## 📝 檢查清單

完成以下項目後，你的 OpenAI API 就設定完成了：

- [ ] 已建立 OpenAI 帳號
- [ ] 已建立 API Key（並妥善保存）
- [ ] 已設定付款方式（信用卡或 PayPal）
- [ ] 已將 API Key 設定到 `.env.local`
- [ ] 已測試 API 連線成功
- [ ] 已了解費用結構和使用上限設定

---

## 🎉 完成！

現在你的 OpenAI API 已經設定完成，可以在專案中使用了！

**下一步：**
1. 確認 `.env.local` 中的 `OPENAI_API_KEY` 已正確設定
2. 啟動你的 Next.js 專案：`npm run dev`
3. 測試 LINE Bot，確認 LLM 能正常回應

---

## 📚 相關資源

- [OpenAI Platform 官方文件](https://platform.openai.com/docs)
- [OpenAI API 參考文件](https://platform.openai.com/docs/api-reference)
- [OpenAI 模型列表](https://platform.openai.com/docs/models)
- [OpenAI 定價資訊](https://openai.com/pricing)
- [OpenAI Status Page](https://status.openai.com/)

---

## 💡 最佳實踐建議

### 1. 安全性

- ✅ **不要**將 API Key 提交到 Git
- ✅ **不要**在客戶端程式碼中使用 API Key
- ✅ 定期輪換 API Key
- ✅ 為不同環境使用不同的 API Key

### 2. 成本控制

- ✅ 設定使用上限（Hard Limit）
- ✅ 定期檢查使用量
- ✅ 使用較便宜的模型（如 gpt-4o-mini）
- ✅ 優化提示詞，減少 Token 使用

### 3. 錯誤處理

- ✅ 實作重試機制（exponential backoff）
- ✅ 處理配額用盡的情況
- ✅ 記錄 API 錯誤以便除錯

### 4. 效能優化

- ✅ 使用適當的 `max_tokens` 限制
- ✅ 快取常見回應（如果適用）
- ✅ 批次處理請求（如果可能）


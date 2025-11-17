# 免費 LLM API 替代方案指南

本指南介紹 OpenAI API 的免費額度情況，以及各種免費的 LLM 替代方案。

## 📋 目錄

1. [OpenAI 免費額度](#openai-免費額度)
2. [免費替代方案總覽](#免費替代方案總覽)
3. [Google Gemini API（推薦）](#google-gemini-api推薦)
4. [Anthropic Claude API](#anthropic-claude-api)
5. [Hugging Face Inference API](#hugging-face-inference-api)
6. [Ollama（本地運行）](#ollama本地運行)
7. [整合指南](#整合指南)
8. [方案比較](#方案比較)

---

## OpenAI 免費額度

### 目前情況

**OpenAI 新帳號通常提供：**
- 💰 **$5 免費額度**（可能隨時變更）
- ⏰ 有效期：通常為 3 個月
- 📊 足夠進行開發和測試（約 10,000-50,000 次簡單對話）

### 如何查看免費額度

1. 前往 [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. 查看 "Credits" 或 "Free tier usage"
3. 確認剩餘額度

### 免費額度用完後

- 需要設定付款方式才能繼續使用
- 或改用其他免費替代方案

---

## 免費替代方案總覽

| 方案 | 免費額度 | 速度 | 品質 | 設定難度 | 推薦度 |
|------|---------|------|------|---------|--------|
| **Google Gemini** | 60 RPM, 1,500 RPD | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Anthropic Claude** | 需申請 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Hugging Face** | 有限 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Ollama** | 無限（本地） | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Google Gemini API（推薦）

### 優點

- ✅ **完全免費**（有配額限制）
- ✅ 效能優秀，回應速度快
- ✅ 支援 JSON 格式回應
- ✅ 設定簡單
- ✅ 中文支援良好

### 免費配額

- **每分鐘請求數（RPM）**：60 次
- **每日請求數（RPD）**：1,500 次
- **每月請求數**：無明確限制（但可能有限制）

### 取得 API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 使用 Google 帳號登入
3. 點選 **"Create API Key"**
4. 選擇專案（或建立新專案）
5. 複製 API Key（格式：`AIza...`）

### 安裝套件

```bash
npm install @google/generative-ai
```

### 整合到專案

#### 步驟 1：更新 `.env.local`

```env
# 使用 Gemini 替代 OpenAI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# 或保留 OpenAI 作為備用
OPENAI_API_KEY=your_openai_api_key_here
```

#### 步驟 2：建立 Gemini 服務

建立 `lib/geminiService.ts`：

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameState, GameTurnResult } from '@/types/game';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

/**
 * 取得系統提示詞（與 OpenAI 版本相同）
 */
function getSystemPrompt(gameState: GameState): string {
  // ... 與 llmService.ts 中的 getSystemPrompt 相同
  // 複製 lib/llmService.ts 中的 getSystemPrompt 函數
}

/**
 * 呼叫 Gemini 生成遊戲回合
 */
export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const systemPrompt = getSystemPrompt(gameState);
    
    // 建立對話歷史
    const messages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...conversationHistory
        .slice(-5)
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const result = await model.generateContent({
      contents: messages as any,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json',
      },
    });

    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // 解析 JSON 回應
    const gameResult = JSON.parse(text) as GameTurnResult;
    
    // 驗證回應格式
    if (!gameResult.narration || !Array.isArray(gameResult.options) || !gameResult.effects) {
      throw new Error('Invalid response format from Gemini');
    }

    return gameResult;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    
    // 降級處理
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('GEMINI_QUOTA_EXCEEDED');
      }
      if (error.message.includes('timeout')) {
        throw new Error('GEMINI_TIMEOUT');
      }
    }
    
    throw error;
  }
}

/**
 * 生成降級回應
 */
export function getFallbackResponse(gameState: GameState): GameTurnResult {
  return {
    narration: '劇情之神似乎暫時離開了，請稍後再試。\n\n你的冒險仍在繼續，但現在無法推進劇情。',
    options: ['稍後再試', '查看當前狀態'],
    effects: { game_over: false },
  };
}
```

#### 步驟 3：更新 `lib/llmService.ts`

在檔案開頭加入：

```typescript
// 支援多種 LLM 提供者
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai'; // 'openai' | 'gemini'

// 如果使用 Gemini，匯入 Gemini 服務
if (LLM_PROVIDER === 'gemini') {
  // 動態匯入或使用條件判斷
}
```

或建立統一的 `lib/llmService.ts`：

```typescript
import { generateGameTurn as generateWithOpenAI } from './openaiService';
import { generateGameTurn as generateWithGemini } from './geminiService';

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  if (LLM_PROVIDER === 'gemini') {
    return generateWithGemini(userMessage, gameState, conversationHistory);
  } else {
    return generateWithOpenAI(userMessage, gameState, conversationHistory);
  }
}
```

#### 步驟 4：更新 `package.json`

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    // ... 其他依賴
  }
}
```

---

## Anthropic Claude API

### 優點

- ✅ 品質優秀
- ✅ 長上下文支援
- ✅ 安全性高

### 免費配額

- 需要申請免費試用
- 通常提供有限的免費額度

### 取得 API Key

1. 前往 [Anthropic Console](https://console.anthropic.com/)
2. 建立帳號
3. 申請 API 存取
4. 取得 API Key

### 安裝套件

```bash
npm install @anthropic-ai/sdk
```

### 整合範例

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307', // 最便宜的模型
    max_tokens: 1000,
    messages: [
      // ... 建立訊息
    ],
  });
  
  // 處理回應...
}
```

---

## Hugging Face Inference API

### 優點

- ✅ 完全免費（有限配額）
- ✅ 多種開源模型可選
- ✅ 無需信用卡

### 免費配額

- 有限的使用配額
- 可能需要排隊

### 取得 API Key

1. 前往 [Hugging Face](https://huggingface.co/)
2. 建立帳號
3. 前往 [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. 建立新的 Token

### 整合範例

```typescript
export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({ inputs: userMessage }),
    }
  );
  
  // 處理回應...
}
```

---

## Ollama（本地運行）

### 優點

- ✅ **完全免費**（無限制）
- ✅ 資料隱私（本地運行）
- ✅ 無需網路連線

### 缺點

- ❌ 需要本地安裝
- ❌ 需要較好的硬體（GPU 推薦）
- ❌ 設定較複雜

### 安裝 Ollama

#### macOS

```bash
# 使用 Homebrew
brew install ollama

# 或下載安裝檔
# https://ollama.ai/download
```

#### 啟動 Ollama

```bash
# 啟動 Ollama 服務
ollama serve

# 下載模型（在另一個終端）
ollama pull llama2
ollama pull mistral
```

### 整合範例

```typescript
export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: userMessage,
      stream: false,
    }),
  });
  
  const data = await response.json();
  // 處理回應...
}
```

---

## 整合指南

### 方案 1：使用環境變數切換

在 `.env.local` 中設定：

```env
# 選擇 LLM 提供者：'openai' | 'gemini' | 'claude' | 'huggingface' | 'ollama'
LLM_PROVIDER=openai

# 根據選擇的提供者設定對應的 API Key
OPENAI_API_KEY=your_openai_key
# 或
# 啟用 Gemini（只有在你真的想用時）
# ENABLE_GEMINI=true
# GOOGLE_GEMINI_API_KEY=your_gemini_key
# 或
ANTHROPIC_API_KEY=your_claude_key
```

### 方案 2：建立統一的 LLM 服務

建立 `lib/llmService.ts`：

```typescript
import { GameState, GameTurnResult } from '@/types/game';

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  switch (LLM_PROVIDER) {
    case 'gemini':
      return (await import('./geminiService')).generateGameTurn(
        userMessage,
        gameState,
        conversationHistory
      );
    case 'claude':
      return (await import('./claudeService')).generateGameTurn(
        userMessage,
        gameState,
        conversationHistory
      );
    case 'ollama':
      return (await import('./ollamaService')).generateGameTurn(
        userMessage,
        gameState,
        conversationHistory
      );
    default:
      return (await import('./openaiService')).generateGameTurn(
        userMessage,
        gameState,
        conversationHistory
      );
  }
}
```

### 方案 3：降級機制（推薦）

實作多層降級：

```typescript
export async function generateGameTurn(...): Promise<GameTurnResult> {
  const providers = ['gemini', 'openai', 'claude'];
  
  for (const provider of providers) {
    try {
      return await tryProvider(provider, ...);
    } catch (error) {
      console.warn(`${provider} failed, trying next...`);
      continue;
    }
  }
  
  // 所有提供者都失敗，使用降級回應
  return getFallbackResponse(gameState);
}
```

---

## 方案比較

### 開發階段推薦

1. **Google Gemini** ⭐⭐⭐⭐⭐
   - 免費配額充足
   - 設定簡單
   - 品質優秀

2. **OpenAI（免費額度）** ⭐⭐⭐⭐
   - 如果還有免費額度
   - 品質最佳

### 生產環境推薦

1. **Google Gemini** ⭐⭐⭐⭐⭐
   - 免費配額足夠小型專案
   - 成本效益高

2. **OpenAI** ⭐⭐⭐⭐
   - 品質最佳
   - 需要付費

3. **Ollama（本地）** ⭐⭐⭐
   - 完全免費
   - 需要伺服器資源

---

## 快速開始：使用 Gemini

### 步驟 1：取得 API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 建立 API Key

### 步驟 2：安裝套件

```bash
npm install @google/generative-ai
```

### 步驟 3：更新環境變數

```env
LLM_PROVIDER=gemini
ENABLE_GEMINI=true
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

### 步驟 4：更新程式碼

參考上方的「整合到專案」章節。

---

## 📝 檢查清單

- [ ] 已選擇 LLM 提供者
- [ ] 已取得對應的 API Key
- [ ] 已安裝必要的套件
- [ ] 已更新 `.env.local`
- [ ] 已更新 `lib/llmService.ts`
- [ ] 已測試新的 LLM 提供者

---

## 🎉 完成！

現在你可以使用免費的 LLM API 來運行你的 LINE Bot 了！

**推薦方案：Google Gemini**
- 免費配額充足
- 設定簡單
- 品質優秀

---

## 📚 相關資源

- [Google Gemini API 文件](https://ai.google.dev/docs)
- [Anthropic Claude API 文件](https://docs.anthropic.com/)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Ollama 文件](https://ollama.ai/docs)


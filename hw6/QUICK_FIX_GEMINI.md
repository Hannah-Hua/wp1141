# 快速修復：切換到 Google Gemini

## 問題
OpenAI API 配額用盡（429 錯誤）

## 解決方案
切換到免費的 Google Gemini API

## 步驟

### 1. 取得 Gemini API Key

1. 前往：https://aistudio.google.com/app/apikey
2. 使用 Google 帳號登入
3. 點選「Create API Key」
4. 複製 API Key

### 2. 更新 .env.local

在 `.env.local` 檔案中，**新增或修改**以下行：

```env
# 切換到 Gemini（新增這行）
LLM_PROVIDER=gemini

# 新增 Gemini API Key（新增這行）
GOOGLE_GEMINI_API_KEY=你的_gemini_api_key_這裡

# 可以保留 OpenAI 作為備用（可選，不改動）
# OPENAI_API_KEY=sk-...
```

### 3. 測試 Gemini 連線

```bash
node scripts/test-gemini.js
```

應該看到 ✅ 成功訊息。

### 4. 重新啟動開發伺服器

```bash
# 停止目前的伺服器（按 Ctrl+C）
# 重新啟動
npm run dev
```

### 5. 測試 LINE Bot

在 LINE 中傳送「開始冒險」給你的 Bot，應該可以正常運作了！

## 完成！

現在你的 Bot 使用免費的 Gemini API，不需要付費！


# ✅ Gemini API 問題已修復

## 問題
Gemini API 測試失敗，錯誤訊息顯示模型找不到（404 Not Found）

## 原因
使用的模型名稱 `gemini-1.5-flash` 或 `gemini-pro` 已不再可用或需要不同的 API 版本。

## 解決方案
已更新為使用 `gemini-2.5-flash` 模型，這是目前可用的免費模型。

## 已更新的檔案

1. **`lib/geminiService.ts`** - 更新模型名稱為 `gemini-2.5-flash`
2. **`scripts/test-gemini.js`** - 更新測試腳本使用正確的模型

## 測試結果

✅ Gemini API 連線成功！
✅ JSON 格式回應測試成功！

## 可用的模型

執行以下指令可以查看所有可用模型：

```bash
node scripts/list-gemini-models-api.js
```

目前推薦使用的模型：
- `gemini-2.5-flash` - 推薦（免費，速度快）
- `gemini-2.5-pro` - 更強能力（免費）
- `gemini-2.0-flash-001` - 穩定版本

## 下一步

1. ✅ 模型名稱已更新
2. ✅ 測試已通過
3. 🚀 可以開始使用 LINE Bot 了！

執行以下指令啟動開發伺服器：

```bash
npm run dev
```

然後測試 LINE Bot 功能。


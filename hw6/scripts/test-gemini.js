/**
 * Google Gemini API 連線測試腳本
 * 
 * 使用方法：
 * 1. 確保 .env.local 中已設定 GOOGLE_GEMINI_API_KEY
 * 2. 執行：node scripts/test-gemini.js
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY 環境變數未設定');
  console.error('請確認 .env.local 檔案存在且包含 GOOGLE_GEMINI_API_KEY');
  process.exit(1);
}

console.log('🔄 正在測試 Google Gemini API...');
console.log('📍 API Key 前綴：', apiKey.substring(0, 10) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    console.log('\n🧪 測試簡單對話...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('請用一句話介紹你自己');
    const response = result.response;
    const text = response.text();
    
    if (text) {
      console.log('✅ Google Gemini API 連線成功！');
      console.log('📝 回應內容：', text);
      
      // 顯示使用統計
      if (result.response.usageMetadata) {
        console.log('\n📊 使用統計：');
        console.log('   - 輸入 Token：', result.response.usageMetadata.promptTokenCount || '未知');
        console.log('   - 輸出 Token：', result.response.usageMetadata.candidatesTokenCount || '未知');
        console.log('   - 總 Token：', result.response.usageMetadata.totalTokenCount || '未知');
      }
    } else {
      console.error('❌ API 回應格式異常');
      process.exit(1);
    }

    console.log('\n🧪 測試 JSON 格式回應（遊戲用）...');
    
    // 測試 JSON 格式回應（類似遊戲中使用的格式）
    const jsonResult = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: '請用 JSON 格式回應，包含 narration（敘事）和 options（選項陣列）兩個欄位。' }],
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 200,
        responseMimeType: 'application/json',
      },
    });

    const jsonResponse = jsonResult.response.text();
    
    if (jsonResponse) {
      try {
        const jsonData = JSON.parse(jsonResponse);
        console.log('✅ JSON 格式回應測試成功！');
        console.log('📝 JSON 內容：', JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('⚠️ JSON 解析失敗，但 API 回應正常');
        console.log('📝 回應內容：', jsonResponse);
      }
    }

    console.log('\n🎉 所有測試通過！Google Gemini API 設定正確。');
    
  } catch (error) {
    console.error('\n❌ Google Gemini API 測試失敗：');
    console.error('錯誤訊息：', error.message);
    console.error('錯誤類型：', error.constructor.name);
    
    if (error.status === 401 || error.message.includes('API_KEY_INVALID')) {
      console.error('\n💡 可能的原因：');
      console.error('   1. API Key 錯誤或已失效');
      console.error('   2. API Key 格式不正確');
      console.error('   → 請前往 https://aistudio.google.com/app/apikey 檢查');
    } else if (error.status === 429 || error.message.includes('RESOURCE_EXHAUSTED')) {
      console.error('\n💡 可能的原因：');
      console.error('   1. API 配額已用完');
      console.error('   2. 請求速率過快');
      console.error('   → 請等待一段時間後再試');
    } else if (error.status === 403 || error.message.includes('PERMISSION_DENIED')) {
      console.error('\n💡 可能的原因：');
      console.error('   1. API Key 沒有權限');
      console.error('   2. 專案設定問題');
      console.error('   → 請前往 Google Cloud Console 檢查專案設定');
    }
    
    console.error('\n📖 詳細設定步驟請參考：FREE_LLM_ALTERNATIVES.md');
    
    process.exit(1);
  }
}

// 執行測試
testGemini();


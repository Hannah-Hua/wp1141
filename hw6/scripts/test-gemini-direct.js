/**
 * 直接使用 fetch 測試 Gemini API
 */

require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY 環境變數未設定');
  process.exit(1);
}

async function testDirectAPI() {
  try {
    console.log('🔄 測試直接呼叫 Gemini API (v1)...\n');
    
    // 嘗試使用 v1 API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: '請用一句話介紹你自己' }]
          }]
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 直接 API 呼叫成功！');
      console.log('📝 回應：', data.candidates[0].content.parts[0].text);
      console.log('\n💡 建議：使用直接 API 呼叫方式');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ API 呼叫失敗');
      console.log('狀態碼：', response.status);
      console.log('錯誤訊息：', errorText.substring(0, 300));
      
      // 嘗試解析錯誤
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          console.log('\n錯誤詳情：', JSON.stringify(errorJson.error, null, 2));
        }
      } catch (e) {
        // 無法解析 JSON
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ 測試失敗：', error.message);
    return false;
  }
}

testDirectAPI();


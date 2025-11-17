/**
 * OpenAI API 連線測試腳本
 * 
 * 使用方法：
 * 1. 確保 .env.local 中已設定 OPENAI_API_KEY
 * 2. 執行：node scripts/test-openai.js
 */

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
    console.log('\n🧪 測試簡單對話...');
    
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
      console.log('\n📊 使用統計：');
      console.log('   - 輸入 Token：', completion.usage?.prompt_tokens || '未知');
      console.log('   - 輸出 Token：', completion.usage?.completion_tokens || '未知');
      console.log('   - 總 Token：', completion.usage?.total_tokens || '未知');
      
      // 計算費用（gpt-4o-mini）
      if (completion.usage) {
        const inputCost = (completion.usage.prompt_tokens / 1_000_000) * 0.15;
        const outputCost = (completion.usage.completion_tokens / 1_000_000) * 0.60;
        const totalCost = inputCost + outputCost;
        console.log('   - 預估費用：$' + totalCost.toFixed(6) + ' USD');
      }
    } else {
      console.error('❌ API 回應格式異常');
      process.exit(1);
    }

    console.log('\n🧪 測試 JSON 格式回應（遊戲用）...');
    
    // 測試 JSON 格式回應（類似遊戲中使用的格式）
    const gameCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '你是一個文字冒險遊戲的 Dungeon Master。請用 JSON 格式回應。',
        },
        {
          role: 'user',
          content: '玩家走進一個房間，請描述場景並提供 3 個選項。',
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
    });

    const gameResponse = gameCompletion.choices[0]?.message?.content;
    
    if (gameResponse) {
      try {
        const gameData = JSON.parse(gameResponse);
        console.log('✅ JSON 格式回應測試成功！');
        console.log('📝 JSON 內容：', JSON.stringify(gameData, null, 2));
      } catch (e) {
        console.log('⚠️ JSON 解析失敗，但 API 回應正常');
        console.log('📝 回應內容：', gameResponse);
      }
    }

    console.log('\n🎉 所有測試通過！OpenAI API 設定正確。');
    
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
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 可能的原因：');
      console.error('   1. 網路連線問題');
      console.error('   2. 防火牆阻擋');
      console.error('   → 檢查網路連線或嘗試使用 VPN');
    }
    
    console.error('\n📖 詳細設定步驟請參考：OPENAI_SETUP.md');
    
    process.exit(1);
  }
}

// 執行測試
testAPI();


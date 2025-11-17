/**
 * 使用 ListModels API 列出可用的 Gemini 模型
 */

require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY 環境變數未設定');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('🔄 正在列出可用的 Gemini 模型...\n');
    
    // 呼叫 ListModels API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.models && data.models.length > 0) {
        console.log(`✅ 找到 ${data.models.length} 個可用模型：\n`);
        
        // 過濾出支援 generateContent 的模型
        const generateContentModels = data.models.filter(model => 
          model.supportedGenerationMethods && 
          model.supportedGenerationMethods.includes('generateContent')
        );
        
        console.log('📝 支援 generateContent 的模型：');
        generateContentModels.forEach((model, index) => {
          console.log(`\n${index + 1}. ${model.name}`);
          console.log(`   顯示名稱：${model.displayName || 'N/A'}`);
          console.log(`   描述：${model.description || 'N/A'}`);
          console.log(`   支援的方法：${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        });
        
        // 推薦使用第一個模型
        if (generateContentModels.length > 0) {
          const recommendedModel = generateContentModels[0].name.replace('models/', '');
          console.log(`\n💡 建議使用的模型名稱：${recommendedModel}`);
          return recommendedModel;
        }
      } else {
        console.log('❌ 沒有找到可用模型');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API 呼叫失敗');
      console.log('狀態碼：', response.status);
      console.log('錯誤訊息：', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          console.log('\n錯誤詳情：', JSON.stringify(errorJson.error, null, 2));
        }
      } catch (e) {
        // 無法解析 JSON
      }
    }
  } catch (error) {
    console.error('❌ 測試失敗：', error.message);
  }
}

listModels();


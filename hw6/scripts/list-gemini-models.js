/**
 * 列出可用的 Gemini 模型
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY 環境變數未設定');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('🔄 正在列出可用的 Gemini 模型...\n');
    
    // 嘗試常見的模型名稱
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('test');
        console.log(`✅ ${modelName} - 可用`);
      } catch (error) {
        console.log(`❌ ${modelName} - 不可用: ${error.message.substring(0, 50)}...`);
      }
    }
    
    console.log('\n💡 建議：使用第一個標記為 ✅ 的模型名稱');
    
  } catch (error) {
    console.error('❌ 錯誤：', error.message);
  }
}

listModels();


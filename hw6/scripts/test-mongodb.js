/**
 * MongoDB 連線測試腳本
 * 
 * 使用方法：
 * 1. 確保 .env.local 中已設定 MONGODB_URI
 * 2. 執行：node scripts/test-mongodb.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI 環境變數未設定');
  console.error('請確認 .env.local 檔案存在且包含 MONGODB_URI');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 正在連接到 MongoDB...');
    console.log('📍 連線字串：', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // 隱藏密碼
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 秒超時
    });
    
    console.log('✅ MongoDB 連線成功！');
    console.log('📊 資料庫名稱：', mongoose.connection.name);
    console.log('🌐 主機：', mongoose.connection.host);
    console.log('🔌 連線狀態：', mongoose.connection.readyState === 1 ? '已連線' : '未連線');
    
    // 測試寫入
    console.log('\n🧪 測試寫入資料...');
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: Date,
    }, { collection: 'test_connection' }));
    
    const testDoc = new TestModel({
      message: '測試連線 - ' + new Date().toISOString(),
      timestamp: new Date(),
    });
    
    await testDoc.save();
    console.log('✅ 測試寫入成功！');
    console.log('📝 寫入的資料 ID：', testDoc._id);
    
    // 測試讀取
    console.log('\n🧪 測試讀取資料...');
    const readDoc = await TestModel.findById(testDoc._id);
    if (readDoc) {
      console.log('✅ 測試讀取成功！');
      console.log('📝 讀取的資料：', {
        message: readDoc.message,
        timestamp: readDoc.timestamp,
      });
    }
    
    // 清理測試資料
    console.log('\n🧹 清理測試資料...');
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ 測試資料已清理');
    
    // 列出所有 Collections
    console.log('\n📚 資料庫中的 Collections：');
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('   (目前沒有 Collections)');
    } else {
      collections.forEach((col) => {
        console.log(`   - ${col.name}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n👋 已斷開連線');
    console.log('🎉 所有測試通過！MongoDB 設定正確。');
    
  } catch (error) {
    console.error('\n❌ MongoDB 連線失敗：');
    console.error('錯誤訊息：', error.message);
    console.error('錯誤類型：', error.name);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 可能的原因：');
      console.error('   1. IP 地址未加入白名單');
      console.error('      → 前往 MongoDB Atlas > Network Access 檢查');
      console.error('   2. 使用者名稱或密碼錯誤');
      console.error('      → 前往 MongoDB Atlas > Database Access 檢查');
      console.error('   3. Cluster 名稱錯誤');
      console.error('      → 檢查連線字串中的 Cluster 名稱');
      console.error('   4. 網路連線問題');
      console.error('      → 檢查網路連線或嘗試使用 VPN');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('\n💡 可能的原因：');
      console.error('   1. 使用者名稱或密碼錯誤');
      console.error('   2. 密碼包含特殊字元，需要 URL 編碼');
      console.error('      → 例如：@ → %40, # → %23, $ → %24');
    } else if (error.name === 'MongoNetworkError') {
      console.error('\n💡 可能的原因：');
      console.error('   1. 網路連線問題');
      console.error('   2. Firewall 阻擋');
      console.error('   3. MongoDB Atlas Cluster 未啟動');
    }
    
    console.error('\n📖 詳細設定步驟請參考：MONGODB_SETUP.md');
    
    process.exit(1);
  }
}

// 執行測試
testConnection();


import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_URL || './dev.db';
const db = new Database(dbPath);

// 啟用外鍵約束
db.pragma('foreign_keys = ON');

// 建立資料表
export function initializeDatabase() {
  // 使用者表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // 咖啡廳表
  db.exec(`
    CREATE TABLE IF NOT EXISTS cafes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      rating REAL,
      priceLevel INTEGER,
      hasWifi INTEGER NOT NULL DEFAULT 1,
      hasPowerOutlets INTEGER NOT NULL DEFAULT 1,
      hasTimeLimit INTEGER NOT NULL DEFAULT 0,
      isNoisy INTEGER NOT NULL DEFAULT 0,
      hasGoodLighting INTEGER NOT NULL DEFAULT 1,
      hasAvailableSeats INTEGER NOT NULL DEFAULT 1,
      createdBy INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 到訪記錄表
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cafeId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      visitDate TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 願望清單表
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cafeId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(cafeId, userId)
    )
  `);

  console.log('✅ 資料庫初始化完成');
}

// 插入測試資料
export function insertTestData() {
  // 檢查是否已有測試資料
  const existingCafes = db.prepare('SELECT COUNT(*) as count FROM cafes').get() as { count: number };
  
  if (existingCafes.count === 0) {
    console.log('📝 插入測試資料...');
    
    // 插入測試咖啡廳
    const insertCafe = db.prepare(`
      INSERT INTO cafes (
        name, description, address, rating, priceLevel,
        hasWifi, hasPowerOutlets, hasTimeLimit, isNoisy, hasGoodLighting, hasAvailableSeats,
        createdBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const testCafes = [
      ['Cafe Nomad', '舒適的工作空間，提供優質咖啡和快速 WiFi', '台北市大安區復興南路一段 253 號', 4.5, 2, 1, 1, 0, 0, 1, 1, 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'],
      ['Coffee Stand', '明亮開闊的空間，適合長時間工作', '台北市中正區羅斯福路三段 283 巷 21 號', 4.3, 2, 1, 1, 0, 0, 1, 1, 1, '2025-01-02T00:00:00Z', '2025-01-02T00:00:00Z'],
      ['Fika Fika Cafe', '北歐風格咖啡廳，環境舒適安靜', '台北市中山區伊通街 33 號', 4.6, 3, 1, 0, 1, 0, 1, 0, 1, '2025-01-03T00:00:00Z', '2025-01-03T00:00:00Z'],
      ['Rufous Coffee', '專業手沖咖啡，環境優雅', '台北市中山區民生東路三段 142 號', 4.7, 3, 1, 1, 0, 0, 1, 1, 1, '2025-01-04T00:00:00Z', '2025-01-04T00:00:00Z'],
      ['Congrats Cafe', '時尚簡約風格，適合聚會和工作', '台北市信義區松仁路 90 號', 4.4, 2, 1, 1, 0, 1, 1, 1, 1, '2025-01-05T00:00:00Z', '2025-01-05T00:00:00Z'],
      ['Louisa Coffee', '連鎖咖啡品牌，環境整潔服務穩定', '台北市松山區南京東路四段 133 號', 4.1, 2, 1, 1, 0, 1, 1, 1, 1, '2025-01-06T00:00:00Z', '2025-01-06T00:00:00Z'],
      ['Cafe Lugo', '日式風格咖啡廳，提供手沖咖啡', '台北市萬華區西門町成都路 10 號', 4.4, 3, 0, 0, 1, 0, 0, 1, 1, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'],
      ['The Coffee Bean', '美式風格咖啡廳，空間寬敞舒適', '台北市士林區天母東路 69 號', 4.2, 2, 1, 1, 0, 1, 1, 1, 1, '2025-01-08T00:00:00Z', '2025-01-08T00:00:00Z'],
    ];

    // 插入咖啡廳並獲取插入的 ID
    const insertedCafeIds: number[] = [];
    testCafes.forEach(cafe => {
      const result = insertCafe.run(...cafe);
      insertedCafeIds.push(result.lastInsertRowid as number);
    });

    // 插入測試到訪記錄（使用實際插入的咖啡廳 ID）
    const insertVisit = db.prepare(`
      INSERT INTO visits (cafeId, userId, visitDate, notes, rating, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const testVisits = [
      [insertedCafeIds[0], 1, '2025-10-15', '環境很好，咖啡也不錯', 5, '2025-10-15T10:00:00Z'],
      [insertedCafeIds[1], 1, '2025-10-18', '空間寬敞，適合長時間待著', 4, '2025-10-18T14:30:00Z'],
    ];

    testVisits.forEach(visit => {
      insertVisit.run(...visit);
    });

    // 插入測試願望清單（使用實際插入的咖啡廳 ID）
    const insertWishlist = db.prepare(`
      INSERT INTO wishlist (cafeId, userId, notes, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    const testWishlist = [
      [insertedCafeIds[3], 1, '想去試試他們的手沖咖啡', '2025-10-10T00:00:00Z'],
      [insertedCafeIds[4], 1, '朋友推薦的', '2025-10-12T00:00:00Z'],
    ];

    testWishlist.forEach(item => {
      insertWishlist.run(...item);
    });

    console.log('✅ 測試資料插入完成');
  } else {
    console.log('ℹ️ 資料庫已有資料，跳過測試資料插入');
  }
}

// 強制重新插入測試資料
export function resetTestData() {
  console.log('🔄 清空現有資料並重新插入測試資料...');
  
  // 清空所有資料表（注意順序：先清空有外鍵的表）
  db.exec('DELETE FROM wishlist');
  db.exec('DELETE FROM visits');
  db.exec('DELETE FROM cafes');
  db.exec('DELETE FROM users');
  
  console.log('✅ 現有資料已清空');
  
  // 先插入測試用戶
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  // 使用 bcrypt 生成正確的密碼 hash
  const bcrypt = require('bcrypt');
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  insertUser.run(1, '測試使用者', 'test@example.com', hashedPassword, '2025-01-01T00:00:00Z');
  console.log('✅ 測試用戶已插入');
  
  // 重新插入測試資料
  insertTestData();
}

export default db;


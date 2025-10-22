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
      category TEXT NOT NULL,
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

export default db;


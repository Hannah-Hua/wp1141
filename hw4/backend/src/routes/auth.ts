import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../database';
import { generateToken, authenticateToken } from '../middleware/auth';
import { User } from '../types';

const router = Router();
const SALT_ROUNDS = 10;

// 註冊
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 輸入驗證
    if (!username || !email || !password) {
      return res.status(400).json({ error: '請提供所有必填欄位' });
    }

    if (username.trim().length < 2) {
      return res.status(400).json({ error: '使用者名稱至少需要 2 個字元' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email 格式不正確' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密碼長度至少需要 6 個字元' });
    }

    // 檢查 email 是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({ error: '此 Email 已被註冊' });
    }

    // 密碼雜湊
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 建立使用者
    const result = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).run(username.trim(), email.toLowerCase(), hashedPassword);

    const userId = result.lastInsertRowid as number;

    // 產生 JWT Token
    const token = generateToken({ userId, email: email.toLowerCase() });

    // 取得使用者資料（不含密碼）
    const user = db.prepare(
      'SELECT id, username, email, createdAt FROM users WHERE id = ?'
    ).get(userId) as Omit<User, 'password'>;

    res.status(201).json({
      message: '註冊成功',
      token,
      user,
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 登入
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 輸入驗證
    if (!email || !password) {
      return res.status(400).json({ error: '請提供 Email 和密碼' });
    }

    // 查詢使用者
    const user = db.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).get(email.toLowerCase()) as User | undefined;

    if (!user) {
      return res.status(401).json({ error: 'Email 或密碼錯誤' });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email 或密碼錯誤' });
    }

    // 產生 JWT Token
    const token = generateToken({ userId: user.id, email: user.email });

    // 回傳使用者資料（不含密碼）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: '登入成功',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得當前使用者資訊（需要驗證）
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: '未認證' });
  }

  const user = db.prepare(
    'SELECT id, username, email, createdAt FROM users WHERE id = ?'
  ).get(req.user.userId) as Omit<User, 'password'> | undefined;

  if (!user) {
    return res.status(404).json({ error: '使用者不存在' });
  }

  res.json({ user });
});

export default router;


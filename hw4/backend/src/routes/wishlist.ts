import { Router, Request, Response } from 'express';
import db from '../database';
import { Wishlist } from '../types';

const router = Router();

// 取得使用者的願望清單
router.get('/', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const wishlist = db.prepare(`
      SELECT w.*, c.name as cafeName, c.address as cafeAddress, 
             c.category, c.rating, c.priceLevel
      FROM wishlist w
      JOIN cafes c ON w.cafeId = c.id
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `).all(req.user.userId);

    res.json({ wishlist });
  } catch (error) {
    console.error('取得願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 檢查咖啡廳是否在願望清單中
router.get('/check/:cafeId', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { cafeId } = req.params;
    const item = db.prepare(`
      SELECT * FROM wishlist WHERE cafeId = ? AND userId = ?
    `).get(cafeId, req.user.userId) as Wishlist | undefined;

    res.json({ inWishlist: !!item, item: item || null });
  } catch (error) {
    console.error('檢查願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 加入願望清單
router.post('/', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { cafeId, notes } = req.body;

    // 輸入驗證
    if (!cafeId) {
      return res.status(400).json({ error: '請提供咖啡廳 ID' });
    }

    // 驗證咖啡廳是否存在
    const cafe = db.prepare('SELECT id FROM cafes WHERE id = ?').get(cafeId);
    if (!cafe) {
      return res.status(404).json({ error: '找不到此咖啡廳' });
    }

    // 檢查是否已在願望清單中
    const existing = db.prepare(`
      SELECT id FROM wishlist WHERE cafeId = ? AND userId = ?
    `).get(cafeId, req.user.userId);

    if (existing) {
      return res.status(409).json({ error: '此咖啡廳已在願望清單中' });
    }

    // 加入願望清單
    const result = db.prepare(`
      INSERT INTO wishlist (cafeId, userId, notes)
      VALUES (?, ?, ?)
    `).run(cafeId, req.user.userId, notes || '');

    const wishlistId = result.lastInsertRowid as number;
    const item = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(wishlistId) as Wishlist;

    res.status(201).json({
      message: '已加入願望清單',
      item,
    });
  } catch (error) {
    console.error('加入願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新願望清單備註
router.put('/:id', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { id } = req.params;
    const item = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(id) as Wishlist | undefined;

    if (!item) {
      return res.status(404).json({ error: '找不到此願望清單項目' });
    }

    // 檢查權限
    if (item.userId !== req.user.userId) {
      return res.status(403).json({ error: '您沒有權限修改此項目' });
    }

    const { notes } = req.body;

    db.prepare(`
      UPDATE wishlist SET notes = ? WHERE id = ?
    `).run(notes !== undefined ? notes : item.notes, id);

    const updatedItem = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(id) as Wishlist;

    res.json({
      message: '願望清單更新成功',
      item: updatedItem,
    });
  } catch (error) {
    console.error('更新願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 從願望清單中移除
router.delete('/:id', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { id } = req.params;
    const item = db.prepare('SELECT * FROM wishlist WHERE id = ?').get(id) as Wishlist | undefined;

    if (!item) {
      return res.status(404).json({ error: '找不到此願望清單項目' });
    }

    // 檢查權限
    if (item.userId !== req.user.userId) {
      return res.status(403).json({ error: '您沒有權限刪除此項目' });
    }

    db.prepare('DELETE FROM wishlist WHERE id = ?').run(id);

    res.json({ message: '已從願望清單中移除' });
  } catch (error) {
    console.error('移除願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 根據咖啡廳 ID 從願望清單中移除
router.delete('/cafe/:cafeId', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { cafeId } = req.params;
    const result = db.prepare(`
      DELETE FROM wishlist WHERE cafeId = ? AND userId = ?
    `).run(cafeId, req.user.userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: '此咖啡廳不在願望清單中' });
    }

    res.json({ message: '已從願望清單中移除' });
  } catch (error) {
    console.error('移除願望清單錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;


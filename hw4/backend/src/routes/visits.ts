import { Router, Request, Response } from 'express';
import db from '../database';
import { Visit } from '../types';

const router = Router();

// 取得使用者的所有到訪記錄
router.get('/', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const visits = db.prepare(`
      SELECT v.*, c.name as cafeName, c.address as cafeAddress
      FROM visits v
      JOIN cafes c ON v.cafeId = c.id
      WHERE v.userId = ?
      ORDER BY v.visitDate DESC, v.createdAt DESC
    `).all(req.user.userId);

    res.json({ visits });
  } catch (error) {
    console.error('取得到訪記錄錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得特定咖啡廳的到訪記錄
router.get('/cafe/:cafeId', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { cafeId } = req.params;
    const visits = db.prepare(`
      SELECT * FROM visits
      WHERE cafeId = ? AND userId = ?
      ORDER BY visitDate DESC, createdAt DESC
    `).all(cafeId, req.user.userId);

    res.json({ visits });
  } catch (error) {
    console.error('取得咖啡廳到訪記錄錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 新增到訪記錄
router.post('/', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { cafeId, visitDate, notes, rating } = req.body;

    // 輸入驗證
    if (!cafeId || !visitDate || rating === undefined) {
      return res.status(400).json({ error: '請提供所有必填欄位' });
    }

    // 驗證咖啡廳是否存在
    const cafe = db.prepare('SELECT id FROM cafes WHERE id = ?').get(cafeId);
    if (!cafe) {
      return res.status(404).json({ error: '找不到此咖啡廳' });
    }

    // 驗證評分
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: '評分必須在 1 到 5 之間' });
    }

    // 驗證日期格式
    if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
      return res.status(400).json({ error: '日期格式不正確（需要 YYYY-MM-DD）' });
    }

    // 新增到訪記錄
    const result = db.prepare(`
      INSERT INTO visits (cafeId, userId, visitDate, notes, rating)
      VALUES (?, ?, ?, ?, ?)
    `).run(cafeId, req.user.userId, visitDate, notes || '', ratingNum);

    const visitId = result.lastInsertRowid as number;
    const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(visitId) as Visit;

    res.status(201).json({
      message: '到訪記錄新增成功',
      visit,
    });
  } catch (error) {
    console.error('新增到訪記錄錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新到訪記錄
router.put('/:id', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { id } = req.params;
    const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(id) as Visit | undefined;

    if (!visit) {
      return res.status(404).json({ error: '找不到此到訪記錄' });
    }

    // 檢查權限
    if (visit.userId !== req.user.userId) {
      return res.status(403).json({ error: '您沒有權限修改此到訪記錄' });
    }

    const { visitDate, notes, rating } = req.body;

    // 驗證評分
    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: '評分必須在 1 到 5 之間' });
      }
    }

    // 驗證日期格式
    if (visitDate && !/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
      return res.status(400).json({ error: '日期格式不正確（需要 YYYY-MM-DD）' });
    }

    // 更新到訪記錄
    db.prepare(`
      UPDATE visits SET
        visitDate = ?,
        notes = ?,
        rating = ?
      WHERE id = ?
    `).run(
      visitDate !== undefined ? visitDate : visit.visitDate,
      notes !== undefined ? notes : visit.notes,
      rating !== undefined ? rating : visit.rating,
      id
    );

    const updatedVisit = db.prepare('SELECT * FROM visits WHERE id = ?').get(id) as Visit;

    res.json({
      message: '到訪記錄更新成功',
      visit: updatedVisit,
    });
  } catch (error) {
    console.error('更新到訪記錄錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除到訪記錄
router.delete('/:id', (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '請先登入' });
    }

    const { id } = req.params;
    const visit = db.prepare('SELECT * FROM visits WHERE id = ?').get(id) as Visit | undefined;

    if (!visit) {
      return res.status(404).json({ error: '找不到此到訪記錄' });
    }

    // 檢查權限
    if (visit.userId !== req.user.userId) {
      return res.status(403).json({ error: '您沒有權限刪除此到訪記錄' });
    }

    db.prepare('DELETE FROM visits WHERE id = ?').run(id);

    res.json({ message: '到訪記錄刪除成功' });
  } catch (error) {
    console.error('刪除到訪記錄錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;


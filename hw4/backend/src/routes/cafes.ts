import { Router, Request, Response } from 'express';
import db from '../database';
import { Cafe } from '../types';

const router = Router();

// 取得所有咖啡廳（支援搜尋和篩選）
router.get('/', (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    let query = 'SELECT * FROM cafes';
    const params: any[] = [];
    const conditions: string[] = [];

    // 搜尋關鍵字
    if (q && typeof q === 'string') {
      conditions.push('(name LIKE ? OR address LIKE ? OR description LIKE ?)');
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    const cafes = db.prepare(query).all(...params) as Cafe[];
    res.json({ cafes });
  } catch (error) {
    console.error('取得咖啡廳列表錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 取得單一咖啡廳
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cafe = db.prepare('SELECT * FROM cafes WHERE id = ?').get(id) as Cafe | undefined;

    if (!cafe) {
      return res.status(404).json({ error: '找不到此咖啡廳' });
    }

    res.json({ cafe });
  } catch (error) {
    console.error('取得咖啡廳詳情錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 新增咖啡廳（公開，任何人都可以新增）
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      address,
      rating,
      priceLevel,
      hasWifi,
      hasPowerOutlets,
      hasTimeLimit,
      isNoisy,
      hasGoodLighting,
      hasAvailableSeats,
    } = req.body;

    // 輸入驗證
    if (!name || !description || !address) {
      return res.status(400).json({ error: '請提供所有必填欄位' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: '咖啡廳名稱至少需要 2 個字元' });
    }

    if (description.trim().length < 5) {
      return res.status(400).json({ error: '描述至少需要 5 個字元' });
    }

    if (address.trim().length < 5) {
      return res.status(400).json({ error: '地址至少需要 5 個字元' });
    }

    // 驗證評分和價格等級
    if (rating !== null && rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        return res.status(400).json({ error: '評分必須在 0 到 5 之間' });
      }
    }

    if (priceLevel !== null && priceLevel !== undefined) {
      const priceLevelNum = Number(priceLevel);
      if (isNaN(priceLevelNum) || priceLevelNum < 1 || priceLevelNum > 4) {
        return res.status(400).json({ error: '價格等級必須在 1 到 4 之間' });
      }
    }

    // 新增咖啡廳（createdBy 設為 null，表示公開創建）
    const result = db.prepare(`
      INSERT INTO cafes (
        name, description, address, rating, priceLevel,
        hasWifi, hasPowerOutlets, hasTimeLimit, isNoisy, hasGoodLighting, hasAvailableSeats,
        createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      description.trim(),
      address.trim(),
      rating || null,
      priceLevel || null,
      hasWifi ? 1 : 0,
      hasPowerOutlets ? 1 : 0,
      hasTimeLimit ? 1 : 0,
      isNoisy ? 1 : 0,
      hasGoodLighting ? 1 : 0,
      hasAvailableSeats ? 1 : 0,
      null // 公開創建，不需要認證
    );

    const cafeId = result.lastInsertRowid as number;
    const cafe = db.prepare('SELECT * FROM cafes WHERE id = ?').get(cafeId) as Cafe;

    res.status(201).json({
      message: '咖啡廳新增成功',
      cafe,
    });
  } catch (error) {
    console.error('新增咖啡廳錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新咖啡廳（公開，任何人都可以更新）
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cafe = db.prepare('SELECT * FROM cafes WHERE id = ?').get(id) as Cafe | undefined;

    if (!cafe) {
      return res.status(404).json({ error: '找不到此咖啡廳' });
    }

    const {
      name,
      description,
      address,
      rating,
      priceLevel,
      hasWifi,
      hasPowerOutlets,
      hasTimeLimit,
      isNoisy,
      hasGoodLighting,
      hasAvailableSeats,
    } = req.body;

    // 輸入驗證（與新增相同）
    if (name && name.trim().length < 2) {
      return res.status(400).json({ error: '咖啡廳名稱至少需要 2 個字元' });
    }

    if (description && description.trim().length < 5) {
      return res.status(400).json({ error: '描述至少需要 5 個字元' });
    }

    if (address && address.trim().length < 5) {
      return res.status(400).json({ error: '地址至少需要 5 個字元' });
    }

    if (rating !== null && rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        return res.status(400).json({ error: '評分必須在 0 到 5 之間' });
      }
    }

    if (priceLevel !== null && priceLevel !== undefined) {
      const priceLevelNum = Number(priceLevel);
      if (isNaN(priceLevelNum) || priceLevelNum < 1 || priceLevelNum > 4) {
        return res.status(400).json({ error: '價格等級必須在 1 到 4 之間' });
      }
    }

    // 更新咖啡廳
    db.prepare(`
      UPDATE cafes SET
        name = ?,
        description = ?,
        address = ?,
        rating = ?,
        priceLevel = ?,
        hasWifi = ?,
        hasPowerOutlets = ?,
        hasTimeLimit = ?,
        isNoisy = ?,
        hasGoodLighting = ?,
        hasAvailableSeats = ?,
        updatedAt = datetime('now')
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : cafe.name,
      description !== undefined ? description.trim() : cafe.description,
      address !== undefined ? address.trim() : cafe.address,
      rating !== undefined ? rating : cafe.rating,
      priceLevel !== undefined ? priceLevel : cafe.priceLevel,
      hasWifi !== undefined ? (hasWifi ? 1 : 0) : cafe.hasWifi,
      hasPowerOutlets !== undefined ? (hasPowerOutlets ? 1 : 0) : cafe.hasPowerOutlets,
      hasTimeLimit !== undefined ? (hasTimeLimit ? 1 : 0) : cafe.hasTimeLimit,
      isNoisy !== undefined ? (isNoisy ? 1 : 0) : cafe.isNoisy,
      hasGoodLighting !== undefined ? (hasGoodLighting ? 1 : 0) : cafe.hasGoodLighting,
      hasAvailableSeats !== undefined ? (hasAvailableSeats ? 1 : 0) : cafe.hasAvailableSeats,
      id
    );

    const updatedCafe = db.prepare('SELECT * FROM cafes WHERE id = ?').get(id) as Cafe;

    res.json({
      message: '咖啡廳更新成功',
      cafe: updatedCafe,
    });
  } catch (error) {
    console.error('更新咖啡廳錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 刪除咖啡廳（公開，任何人都可以刪除）
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cafe = db.prepare('SELECT * FROM cafes WHERE id = ?').get(id) as Cafe | undefined;

    if (!cafe) {
      return res.status(404).json({ error: '找不到此咖啡廳' });
    }

    db.prepare('DELETE FROM cafes WHERE id = ?').run(id);

    res.json({ message: '咖啡廳刪除成功' });
  } catch (error) {
    console.error('刪除咖啡廳錯誤:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;


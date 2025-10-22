import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { authenticateToken } from './middleware/auth';

// 載入環境變數
dotenv.config();

// 初始化 Express 應用
const app = express();
const PORT = process.env.PORT || 3000;

// CORS 設定
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// 中間件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 請求日誌
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 初始化資料庫
initializeDatabase();

// 匯入路由
import authRoutes from './routes/auth';
import cafesRoutes from './routes/cafes';
import visitsRoutes from './routes/visits';
import wishlistRoutes from './routes/wishlist';

// 公開路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '辦公咖啡廳清單 API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        me: 'GET /auth/me (需要認證)',
      },
      cafes: {
        list: 'GET /api/cafes',
        get: 'GET /api/cafes/:id',
        create: 'POST /api/cafes (需要認證)',
        update: 'PUT /api/cafes/:id (需要認證)',
        delete: 'DELETE /api/cafes/:id (需要認證)',
      },
      visits: {
        list: 'GET /api/visits (需要認證)',
        create: 'POST /api/visits (需要認證)',
        update: 'PUT /api/visits/:id (需要認證)',
        delete: 'DELETE /api/visits/:id (需要認證)',
      },
      wishlist: {
        list: 'GET /api/wishlist (需要認證)',
        check: 'GET /api/wishlist/check/:cafeId (需要認證)',
        add: 'POST /api/wishlist (需要認證)',
        remove: 'DELETE /api/wishlist/:id (需要認證)',
      },
    },
  });
});

// 認證路由
app.use('/auth', authRoutes);

// 咖啡廳路由（需要在路由內部處理認證）
app.use('/api/cafes', cafesRoutes);

// 到訪記錄路由（全部需要認證）
app.use('/api/visits', authenticateToken, visitsRoutes);

// 願望清單路由（全部需要認證）
app.use('/api/wishlist', authenticateToken, wishlistRoutes);

// 404 處理
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: '找不到此路由' });
});

// 錯誤處理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({
    error: '伺服器內部錯誤',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
  console.log(`📝 API 文件: http://localhost:${PORT}/`);
  console.log(`🌍 CORS 允許來源: ${corsOrigins.join(', ')}`);
});

export default app;


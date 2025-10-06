# K-pop 周邊商品購買平台（hw3）

React + TypeScript + Material-UI 打造的前端示範專案，提供商品瀏覽、篩選、排序與詳細頁等體驗。

## 安裝與運行

前置需求：Node.js 18+、npm

1) 安裝依賴
```bash
npm ci   # 若失敗可改用 npm install
```

2) 開發模式（自動熱更新）
```bash
npm start
# 瀏覽器開啟 http://localhost:3000
```

3) 產生正式版建置
```bash
npm run build
```

4) 本機預覽 build（可選）
```bash
npx serve -s build
# 或以你偏好的靜態伺服器預覽 build 目錄
```

## 專案概覽

- **技術**: React 18、TypeScript、MUI
- **圖片**: 放於 `public/images/groups/`，自動依團名對應，無圖時使用預設圖
- **資料**: 範例 CSV 與型別定義放在 `public/data/` 與 `src/types/`

## 重要腳本

- `npm start`: 啟動開發伺服器
- `npm run build`: 產出生產環境檔案於 `build/`

## 注意

- 專案已於 `.gitignore` 排除 `node_modules/`
- 若圖片命名與團名不符，可調整 `src/utils/groupImages.ts`

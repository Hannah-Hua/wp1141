# K-pop 周邊商品購買平台（HW3）

React + TypeScript + Material-UI 打造的 K-pop 周邊電商前端。提供商品探索、收藏、購物車、下單與訂單歷史等完整體驗。

## 功能總覽

- **首頁商品牆**：預設顯示「熱門商品 TOP 20」。
- **側邊篩選**：可依「娛樂公司 / 團體 / 分類」篩選。
- **搜尋**：即時搜尋商品名稱與描述。
- **我的最愛**：可加入/移除，並查看最愛清單。
- **購物車**：
  - 勾選要結帳的品項（支援全選/反選）。
  - 調整數量、修改選項、移除品項。
  - 僅計算「已勾選」商品的總金額。
- **下單流程**：已選商品 → 填寫訂單資料 → 訂單確認頁。
- **訂單歷史**：可查看過往下單紀錄。

## 開發與建置

1. 安裝依賴
   ```bash
   npm install
   ```

2. 啟動開發伺服器
   ```bash
   npm start
   ```

開啟 `http://localhost:3000` 即可預覽。

## 技術棧

- React 18
- TypeScript
- Material-UI (MUI) + Emotion
- CRA（react-scripts）

## 專案結構

```
public/
├── data/merchandise.csv         # 商品資料來源
└── images/groups/               # 團體封面照

src/
├── components/
│   ├── Header.tsx               # 頂部導覽（搜尋、最愛、購物車、訂單歷史）
│   ├── Sidebar.tsx              # 側邊篩選（娛樂公司/團體/分類）
│   ├── ProductCard.tsx          # 商品卡片（封面照 + 資訊）
│   ├── ProductGrid.tsx          # 商品清單與標題列
│   ├── ProductDetail.tsx        # 商品詳情
│   ├── CartPage.tsx             # 購物車（勾選/數量/選項/刪除/小計）
│   ├── OrderForm.tsx            # 訂單資料填寫
│   ├── OrderConfirmation.tsx    # 下單成功頁
│   └── OrderHistory.tsx         # 訂單歷史
├── data/products.ts             # 讀取/篩選/搜尋/熱門商品邏輯
├── utils/groupImages.ts         # 團體封面照工具與預設圖
├── types/index.ts               # 型別：Product、CartItem、FilterOptions 等
├── App.tsx                      # 頁面狀態切換與路由式顯示
└── index.tsx                    # 入口
```

## 資料來源與快取

- 商品資料自 `public/data/merchandise.csv` 載入。
- 團體封面照路徑由 `utils/groupImages.ts` 依團名轉檔名生成，若失敗使用 `default.jpg`。
- 使用者狀態（最愛、購物車、訂單）以 `localStorage` 保存：
  - `kpop-merchandise-favorites`
  - `kpop-merchandise-cart`
  - `kpop-merchandise-orders`

## 授權

僅供課程作業與學術用途。

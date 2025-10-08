# K-pop 手燈購買平台

React + TypeScript + Material-UI 打造的 K-pop 手燈專賣電商平台。提供手燈商品探索、收藏、購物車、下單與訂單歷史等完整購買體驗。

## 功能總覽

- **首頁商品牆**：預設顯示「熱門手燈 TOP 10」。
- **側邊篩選**：可依「娛樂公司 / 團體」篩選手燈商品。
- **即時搜尋**：搜尋手燈商品名稱與描述。
- **我的最愛**：可加入/移除最愛手燈，並查看最愛清單。
- **智慧購物車**：
  - 以選項為單位的全選/反選功能
  - 商品數量以實際件數計算
  - 支援調整數量、移除品項
  - 庫存限制：不能超過實際庫存數量
  - 缺貨商品顯示半透明遮罩，無法點擊
- **完整下單流程**：已選商品 → 填寫訂單資料 → 訂單確認頁
- **訂單歷史**：查看過往手燈購買紀錄，按時間排序


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

- **前端框架**：React 18 + TypeScript
- **UI 組件庫**：Material-UI (MUI) + Emotion
- **建置工具**：Create React App (CRA)
- **資料處理**：CSV 解析 + LocalStorage
- **動畫效果**：CSS Keyframes + MUI Transitions

## 專案結構

```
public/
├── data/merchandise.csv         # 手燈商品資料來源
└── images/groups/               # 團體封面照（29個團體）

src/
├── components/
│   ├── Header.tsx               # 頂部導覽（搜尋、最愛、購物車、訂單歷史）
│   ├── Sidebar.tsx              # 側邊篩選（娛樂公司/團體）
│   ├── ProductCard.tsx          # 手燈商品卡片（含缺貨狀態）
│   ├── ProductGrid.tsx          # 商品清單與標題列
│   ├── ProductDetail.tsx        # 手燈商品詳情（庫存限制）
│   ├── CartPage.tsx             # 智慧購物車（選項為單位、數量計算）
│   ├── OrderForm.tsx            # 訂單資料填寫
│   ├── OrderConfirmation.tsx    # 下單成功頁
│   └── OrderHistory.tsx         # 訂單歷史（時間排序）
├── data/products.ts             # 商品讀取/篩選/搜尋/熱門邏輯
├── utils/
│   ├── groupImages.ts           # 團體封面照工具與預設圖
│   └── csvParser.ts             # CSV 解析工具
├── types/index.ts               # 型別定義：Product、CartItem、FilterOptions
├── App.tsx                      # 主應用程式（狀態管理、路由）
└── index.tsx                    # 應用程式入口
```

## 資料來源與快取

- **商品資料**：從 `public/data/merchandise.csv` 載入手燈商品資訊
- **團體圖片**：29個 K-pop 團體封面照，載入失敗使用預設圖
- **本地儲存**：使用者狀態以 `localStorage` 保存
  - `kpop-merchandise-favorites` - 最愛手燈清單
  - `kpop-merchandise-cart` - 購物車商品
  - `kpop-merchandise-orders` - 訂單歷史



## 使用說明

### 瀏覽商品
1. 首頁顯示熱門手燈 TOP 10
2. 使用側邊欄篩選特定團體或娛樂公司
3. 搜尋框輸入關鍵字即時搜尋

### 購買流程
1. 點擊商品卡片查看詳情
2. 選擇數量
3. 加入購物車（自動檢查庫存）
4. 在購物車中選擇要購買的商品
5. 填寫訂單資料並確認下單

### 購物車管理
- 全選：以選項為單位選擇所有商品
- 數量調整：不能超過庫存限制
- 缺貨商品：顯示半透明遮罩，無法操作

## 授權

僅供課程作業與學術用途。

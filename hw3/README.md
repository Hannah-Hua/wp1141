# K-pop 手燈購買平台

一個現代化的 K-pop 官方手燈電商平台，提供完整的商品瀏覽、購物車、訂單管理功能。

## 功能特色

### 商品瀏覽
- 🔥 **熱門手燈 TOP 10** - 首頁顯示最受歡迎的手燈
- 🔍 **即時搜尋** - 支援商品名稱、團體、娛樂公司關鍵字搜尋
- 🎯 **娛樂公司篩選** - 依照 SM、JYP、HYBE 等娛樂公司快速篩選

### 智慧購物車
- ✅ **選項式全選** - 以商品選項為單位進行勾選
- 📊 **即時數量統計** - 顯示所有商品的總數量
- 📦 **庫存管理** - 自動檢查庫存，防止超賣
- 🔄 **智慧累加** - 重複商品自動累加數量

### 商品管理
- 🚫 **缺貨提示** - 零庫存商品顯示半透明遮罩，無法點擊
- ⭐ **最愛收藏** - 快速收藏喜愛的商品

### 訂單流程
- 📝 **完整訂單系統** - 填寫配送資訊、查看訂單摘要
- 📅 **訂單歷史** - 查看過往訂單紀錄（依時間排序）
- 💾 **本地儲存** - 使用 localStorage 保存購物車和訂單

## 技術架構

### 前端技術
- **React 18** + **TypeScript** - 型別安全的現代化開發
- **Material-UI (MUI)** - 一致的 UI 設計系統
- **React Hooks** - 狀態管理和業務邏輯
- **Context API** - 全域狀態管理

### 架構設計
- **關注點分離** - 邏輯與 UI 完全分離
- **自定義 Hooks** - 可重用的業務邏輯
- **工具函數庫** - 統一的輔助函數
- **型別安全** - 完整的 TypeScript 型別定義

## 專案結構

```
src/
├── App.tsx                    # 主應用（使用 Context 和 Hooks）
├── index.tsx                  # 應用入口
├── components/                # UI 組件
│   ├── Header.tsx            # 頂部導航（固定）
│   ├── Sidebar.tsx           # 側邊篩選欄（固定）
│   ├── ProductGrid.tsx       # 商品網格列表
│   ├── ProductCard.tsx       # 商品卡片（含缺貨狀態）
│   ├── ProductDetail.tsx     # 商品詳細頁面
│   ├── CartPage.tsx          # 購物車（側邊滑出）
│   ├── OrderForm.tsx         # 訂單表單
│   ├── OrderConfirmation.tsx # 訂單確認
│   └── OrderHistory.tsx      # 訂單歷史
├── contexts/                  # Context 管理
│   └── AppContext.tsx        # 全域狀態管理
├── hooks/                     # 自定義 Hooks
│   ├── useCartState.ts       # 購物車狀態管理
│   ├── useFavoritesState.ts  # 最愛商品管理
│   ├── useProductsData.ts    # 商品資料載入
│   ├── useUINavigation.ts    # UI 導航控制
│   └── useFilterAndSearch.ts # 篩選和搜尋
├── utils/                     # 工具函數
│   ├── localStorage.ts       # localStorage 操作
│   ├── cartHelpers.ts        # 購物車輔助函數
│   ├── productHelpers.ts     # 商品輔助函數
│   ├── csvParser.ts          # CSV 解析
│   └── groupImages.ts        # 圖片路徑處理
├── data/                      # 資料層
│   └── products.ts           # 商品資料存取
└── types/                     # 型別定義
    └── index.ts              # TypeScript 介面
```

## 資料來源

- **商品資料**：從 `public/data/merchandise.csv` 載入手燈商品資訊
- **本地儲存**：使用者狀態以 `localStorage` 保存
  - `kpop-merchandise-favorites` - 最愛手燈清單
  - `kpop-merchandise-cart` - 購物車商品
  - `kpop-merchandise-orders` - 訂單歷史

## 使用說明

1. 點擊商品卡片查看詳情
2. 選擇數量
3. 加入購物車（自動檢查庫存）
4. 在購物車中選擇要購買的商品
5. 填寫訂單資料並確認下單

## 安裝與執行

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm start
```

應用程式將在 http://localhost:3000 開啟

### 建置生產版本
```bash
npm run build
```

## 授權

本專案為學習用途，商品圖片及資料僅供展示使用。
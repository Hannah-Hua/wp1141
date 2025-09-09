# Hannah 個人網站 (TypeScript)

這是一個使用純 HTML、CSS 和 TypeScript 建立的個人網站，不依賴任何前端框架。專案完全使用 TypeScript 開發，提供類型安全和現代化的開發體驗。

## 功能特色

- 🏠 **首頁**：展示 Hannah 的品牌形象和標語
- 📖 **我的故事**：個人介紹和故事分享
- 📸 **我的生活**：Instagram 風格的圖片網格展示
- 📱 **響應式設計**：完美適配桌面和行動裝置
- 🎨 **現代化 UI**：簡潔美觀的設計風格
- ⚡ **流暢動畫**：平滑的頁面切換和滾動效果
- 🔗 **社交媒體整合**：Facebook 和 Instagram 連結

## 技術棧

- **HTML5**：語義化標記
- **CSS3**：現代化樣式和動畫
- **TypeScript**：類型安全的 JavaScript，提供完整的類型檢查
- **Yarn**：套件管理工具
- **ES2020**：現代 JavaScript 特性

## 專案結構

```
myweb-ts/
├── index.html              # 主頁面
├── src/
│   ├── css/
│   │   └── styles.css      # 樣式檔案
│   └── js/
│       └── main.ts         # TypeScript 原始碼
├── dist/                   # 編譯後的 JavaScript 檔案
├── package.json            # 專案配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 專案說明
```

## 安裝與執行

### 1. 安裝依賴套件

```bash
yarn install
```

### 2. 編譯 TypeScript

```bash
yarn build
```

### 3. 啟動本地伺服器

```bash
yarn serve
```

然後在瀏覽器中開啟 `http://localhost:8000`

### 4. 一鍵啟動（編譯 + 伺服器）

```bash
yarn start
```

### 5. 開發模式（自動編譯）

```bash
yarn dev
```

## 使用說明

### 頁面導航

- **滑鼠滾輪**：在頁面間切換
- **導航選單**：點擊頂部選單項目
- **頁面指示器**：點擊右側圓點按鈕

### 社交媒體

- 點擊左側的 Facebook 或 Instagram 按鈕
- 目前為示範功能，可自行修改連結

### 響應式設計

- 桌面版：完整功能展示
- 平板版：調整佈局適應中等螢幕
- 手機版：優化觸控操作和單欄佈局

## 自訂設定

### 修改內容

1. **文字內容**：編輯 `index.html` 中的文字
2. **樣式**：修改 `src/css/styles.css`
3. **功能**：調整 `src/js/main.ts`（TypeScript 原始碼）
4. **類型定義**：在 TypeScript 檔案中定義介面和類型

### 更換圖片

目前使用 SVG 佔位符，您可以：

1. 將圖片放入 `src/images/` 目錄
2. 修改 CSS 中的 `background-image` 屬性
3. 重新編譯專案

### 添加新頁面

1. 在 `index.html` 中添加新的 `.page-section`
2. 在 `main.ts` 的 `PageManager` 類別中添加頁面 ID
3. 更新導航選單和頁面指示器
4. 使用 TypeScript 的類型檢查確保程式碼正確性

## 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 開發指令

```bash
# 安裝套件
yarn install

# 編譯 TypeScript
yarn build

# 監聽模式編譯（開發時使用）
yarn dev

# 啟動本地伺服器
yarn serve

# 一鍵啟動（編譯 + 伺服器）
yarn start
```

## TypeScript 特色

- **類型安全**：編譯時檢查類型錯誤
- **智能提示**：IDE 提供完整的自動完成
- **重構支援**：安全的重命名和重構
- **現代語法**：支援最新的 JavaScript 特性
- **模組化**：清晰的類別和介面結構

## 授權

此專案僅供學習和個人使用。

## 聯絡資訊

如有問題或建議，請聯絡 Hannah。
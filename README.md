# Hannah 個人網站

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

一個使用 TypeScript 建構的現代化個人網站，專為數位內容創作者設計。

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-FF6B6B?style=for-the-badge)](https://hannahchen.com)
[![GitHub](https://img.shields.io/badge/📁_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hannahchen)

</div>

---

## ✨ 專案特色

### 🎨 設計亮點
- **現代化 UI/UX**：採用簡潔美觀的設計語言，提供優質的視覺體驗
- **響應式設計**：完美適配桌面、平板和行動裝置
- **流暢動畫**：精心設計的頁面切換和滾動效果
- **直觀導航**：多種導航方式（選單、頁面指示器、鍵盤操作）

### 🚀 技術優勢
- **TypeScript 驅動**：完整的類型安全，提供更好的開發體驗
- **模組化架構**：清晰的代碼結構，易於維護和擴展
- **現代化工具鏈**：使用最新的開發工具和最佳實踐
- **SEO 優化**：完整的 meta 標籤和語義化 HTML

### 📱 功能完整
- **個人品牌展示**：專業的個人介紹和作品集
- **作品集管理**：分類展示和篩選功能
- **部落格系統**：文章展示和分類
- **聯絡表單**：完整的聯絡功能
- **社交媒體整合**：Facebook 和 Instagram 連結

## 🛠️ 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **TypeScript** | 5.9.2 | 主要開發語言 |
| **HTML5** | - | 語義化標記 |
| **CSS3** | - | 現代化樣式和動畫 |
| **Yarn** | 4.6.0 | 套件管理 |
| **ES2020** | - | JavaScript 目標版本 |

## 📁 專案結構

```
myweb-ts/
├── 📄 index.html              # 主頁面
├── 📁 src/                    # 原始碼目錄
│   ├── 📁 css/
│   │   └── styles.css         # 樣式檔案
│   ├── 📁 js/
│   │   └── main.ts            # TypeScript 原始碼
│   └── 📁 images/             # 圖片資源
├── 📁 dist/                   # 編譯輸出目錄
│   └── 📁 js/
│       ├── main.js            # 編譯後的 JavaScript
│       ├── main.d.ts          # 類型定義檔案
│       └── main.js.map        # Source Map
├── 📄 package.json            # 專案配置
├── 📄 tsconfig.json          # TypeScript 配置
└── 📄 README.md              # 專案說明
```

## 🚀 快速開始

### 前置需求
- Node.js 16.0 或更高版本
- Yarn 4.0 或更高版本

### 安裝與執行

1. **克隆專案**
   ```bash
   git clone https://github.com/hannahchen/myweb-ts.git
   cd myweb-ts
   ```

2. **安裝依賴套件**
   ```bash
   yarn install
   ```

3. **編譯 TypeScript**
   ```bash
   yarn build
   ```

4. **啟動開發伺服器**
   ```bash
   yarn serve
   ```

5. **開啟瀏覽器**
   訪問 `http://localhost:8000`

### 開發指令

| 指令 | 說明 |
|------|------|
| `yarn install` | 安裝專案依賴 |
| `yarn build` | 編譯 TypeScript 到 JavaScript |
| `yarn dev` | 監聽模式編譯（開發時使用） |
| `yarn serve` | 啟動本地開發伺服器 |
| `yarn start` | 一鍵啟動（編譯 + 伺服器） |

## 🎯 使用指南

### 頁面導航
- **滑鼠滾輪**：在頁面間切換
- **導航選單**：點擊頂部選單項目
- **頁面指示器**：點擊右側圓點按鈕
- **鍵盤操作**：使用方向鍵瀏覽

### 作品集篩選
- 點擊篩選按鈕查看不同類別的作品
- 支援美妝、時尚、生活等分類

### 響應式設計
- **桌面版**：完整功能展示，最佳視覺效果
- **平板版**：調整佈局適應中等螢幕
- **手機版**：優化觸控操作和單欄佈局

## ⚙️ 自訂設定

### 修改內容
1. **文字內容**：編輯 `index.html` 中的文字
2. **樣式設計**：修改 `src/css/styles.css`
3. **功能邏輯**：調整 `src/js/main.ts`
4. **圖片資源**：替換 `src/images/` 中的圖片

### 添加新頁面
1. 在 `index.html` 中添加新的 `.page-section`
2. 在 `main.ts` 的 `PageManager` 類別中添加頁面 ID
3. 更新導航選單和頁面指示器
4. 重新編譯專案

### TypeScript 配置
專案使用嚴格的 TypeScript 配置，包括：
- 嚴格類型檢查
- ES2020 目標版本
- 模組化支援
- Source Map 生成
- 類型定義檔案生成

## 🌐 瀏覽器支援

| 瀏覽器 | 最低版本 |
|--------|----------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

## 📈 效能優化

- **圖片優化**：使用 WebP 和 AVIF 格式
- **CSS 優化**：關鍵 CSS 內聯，非關鍵 CSS 延遲載入
- **JavaScript 優化**：模組化載入，減少初始包大小
- **快取策略**：適當的 HTTP 快取設定

## 🔧 開發工具

- **TypeScript Compiler**：類型檢查和編譯
- **Source Maps**：除錯支援
- **Yarn**：快速可靠的套件管理
- **Python HTTP Server**：簡單的開發伺服器

## 📝 授權

此專案僅供學習和個人使用。

## 📞 聯絡資訊

- **作者**：Hannah Chen
- **學號**：B12705022
- **專業**：資訊管理學系三年級
- **專長**：數位內容創作、美妝、時尚、生活技巧

---

<div align="center">

**⭐ 如果這個專案對您有幫助，請給個 Star！**

Made with ❤️ by Hannah Chen

</div>
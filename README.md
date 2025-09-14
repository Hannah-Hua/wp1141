# Hannah 個人網站

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

一個使用 TypeScript 建構的現代化個人網站，專為台大資管系學生設計。

</div>

---

## 🚀 如何開啟網頁

### 方法一：直接開啟 HTML 檔案
1. 下載專案檔案
2. 雙擊 `index.html` 檔案
3. 網頁會在預設瀏覽器中開啟

### 方法二：使用本地伺服器（推薦）
```bash
# 1. 安裝依賴套件
yarn install

# 2. 編譯 TypeScript
yarn build

# 3. 啟動伺服器
yarn serve

# 4. 開啟瀏覽器訪問
# http://localhost:8000
```

## 🎨 設計概念

- **現代化風格**：淡紫色主調 + 漸層效果
- **響應式設計**：適配桌面、平板、手機
- **流暢動畫**：頁面切換與懸停效果

## 📱 網站內容

- **首頁**：個人品牌展示與數據統計
- **關於我**：個人故事與技能展示
- **作品集**：程式設計、資料分析、系統設計作品分類展示
- **部落格**：精選文章與學習心得
- **聯絡我**：多種聯絡方式與互動表單

## ⚡ 主要功能

- 多種導航方式（選單、指示器、鍵盤、滾輪）
- 作品集分類篩選
- 響應式佈局設計
- 社交媒體整合


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

---

## ⚠️ 重要聲明

**本頁面所呈現的內容僅作為課程作業示範，並不代表真實資訊。**

---

<div align="center">

**B12705022**

</div>

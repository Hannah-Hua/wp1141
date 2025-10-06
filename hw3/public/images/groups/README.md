# 團體圖片使用說明

## 圖片資料夾結構
```
public/images/groups/
├── bts.jpg                    # BTS 團體合照
├── blackpink.jpg              # BLACKPINK 團體合照
├── twice.jpg                  # TWICE 團體合照
├── aespa.jpg                  # aespa 團體合照
├── newjeans.jpg               # NewJeans 團體合照
├── le_sserafim.jpg            # LE SSERAFIM 團體合照
├── itzy.jpg                   # ITZY 團體合照
├── ive.jpg                    # IVE 團體合照
├── stayc.jpg                  # STAYC 團體合照
├── nmixx.jpg                  # NMIXX 團體合照
├── txt.jpg                    # TXT 團體合照
├── enhypen.jpg                # ENHYPEN 團體合照
├── seventeen.jpg              # SEVENTEEN 團體合照
├── stray_kids.jpg             # Stray Kids 團體合照
├── ateez.jpg                  # ATEEZ 團體合照
├── exo.jpg                    # EXO 團體合照
├── nct_127.jpg                # NCT 127 團體合照
├── red_velvet.jpg             # Red Velvet 團體合照
├── mamamoo.jpg                # MAMAMOO 團體合照
├── monsta_x.jpg               # MONSTA X 團體合照
├── kep1er.jpg                 # Kep1er 團體合照
├── billlie.jpg                # Billlie 團體合照
├── kiiikiii.jpg               # KiiiKiii 團體合照
├── babymonster.jpg            # BABYMONSTER 團體合照
├── badvillain.jpg             # BADVILLAIN 團體合照
├── cortis.jpg                 # Cortis 團體合照
├── genblue.jpg                # GENBLUE 團體合照
├── hearts2hearts.jpg          # Hearts2Hearts 團體合照
├── katseye.jpg                # KATSEYE 團體合照
├── meovv.jpg                  # MEOVV 團體合照
├── oneus.jpg                  # ONEUS 團體合照
├── tws.jpg                    # TWS 團體合照
├── viviz.jpg                  # VIVIZ 團體合照
├── xg.jpg                     # XG 團體合照
├── g_i_dle.jpg                # (G)I-DLE 團體合照
└── default.jpg                # 預設圖片（當團體圖片不存在時使用）
```

## 圖片規格要求
- **格式**: JPG 或 PNG
- **尺寸**: 建議 400x300 像素或更高解析度
- **比例**: 建議 4:3 或 16:9 比例
- **檔案大小**: 建議小於 500KB 以確保載入速度

## 檔案命名規則
團體名稱會自動轉換為檔案名稱：
- 空格 → 底線 (_)
- 括號 () → 移除
- & → and
- 轉為小寫

例如：
- "BTS" → "bts.jpg"
- "LE SSERAFIM" → "le_sserafim.jpg"
- "NCT 127" → "nct_127.jpg"
- "(G)I-DLE" → "g_i_dle.jpg"

## 如何添加團體圖片
1. 準備團體的官方合照或宣傳照
2. 按照上述規格調整圖片
3. 按照命名規則重新命名檔案
4. 將圖片放入 `public/images/groups/` 資料夾
5. 重新建置專案即可看到效果

## 預設圖片
當團體圖片不存在時，系統會自動使用 `default.jpg` 作為預設圖片。建議準備一張通用的 K-Pop 風格圖片作為預設。

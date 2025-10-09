# 設計 kpop 商品購買平台初始佈局
_Exported on 2025/10/5 at 14:25:00 [GMT+8] from Cursor (1.7.28)_


**User**

在hw3資料夾裡，我需要你寫一個純前端的 kpop 周邊商品購買平台。請根據附圖的示意圖，使用 MaterialUI 幫我規劃這個 app 的 initial layout。商品資料請根據 merchandise.csv。請先不用實現任何實際的購物車、結帳功能，只是可以把這個 initial layout 畫的精緻、有質感一點，然後可以瀏覽商品就好。
不用實作左側的名單列。
上方的ARTIST 請以 entertainment -> group_name 做分類。
CATEGORY 請參照 csv 裡的 category 欄位。
不用實作 EVENT 跟 STORY。
右上角的四個按鈕先不用實作。
左上角放上logo.png。
商品圖片請隨機從/img裡面挑一個。



**User**

把左上角的 YG SELECT的地方改成我的 logo.png。請將上方的ARTIST, CATEGORY, EVENT, STORY 刪掉。請將商品畫面改得更像 YG SELECT



**User**

把商品排序刪掉。請完整讀取merchandise.csv



**User**

我的CSV有350個商品！



**User**

左上角的logo圖片沒有正確讀取



**User**

請將圖片放大一點



**User**

預設畫面請顯示最熱門的商品（已售出最多的）。點擊左側的分類再跳轉到該分類頁面。



**User**

請給一個「熱門商品」的標題，顯示前20多銷售量的商品



**User**

請把目前沒有用到的檔案刪掉



**User**

請實作左上角的搜尋按鈕。我想要使用者不用按下搜尋鍵就能看到搜尋結果隨著輸入變化。



**User**

請改成按下搜尋鍵在開始搜尋，不要即時回饋



**User**

這是搜尋結果的頁面，但現在就算點擊左側的分類標仍無法跳回道首頁（熱門商品）或其他分類的頁面。



**User**

接下來請實作商品詳細頁面。附圖為示意圖。圖片中的shipping date請改為顯示merchandise的shipping days。若是商品分類為Apparel/Hoodie或Apparel/Tour T-shirt，請顯示圖片中的option，選項為L/M/S。其他商品則不用顯示option。先不用實作加入購物車和立即購買的按鈕。



**User**

請放上加入購物車和立即購買的按鈕但不用實作功能



**User**

請重新讀取merchandise.csv



**User**

現在請你實作「我的最愛」的部分。當使用者在商品詳細頁面點擊按心按鈕，即將該商品加入「我的最愛」。當使用者點擊首頁右上角的愛心愛心（如附圖右邊），即列出使用者曾經點過愛心的商品



**User**

無論有無收藏，商品頁面的上一頁都要回到首頁。無論目前在什麼頁面，都要能點擊右上角的愛心查看我的收藏，也只有點擊右上角的愛心能查看我的收藏。



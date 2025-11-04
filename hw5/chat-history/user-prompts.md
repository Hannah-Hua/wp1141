# 用戶提示完整記錄

## 第一次對話（專案建立與初始開發）

### 1. 專案初始需求
- **提示**：`@hw5/ 我要做一個類似 X/Twitter 的社群網站，支援基本的發文、按讚與留言互動功能。底下為規定要使用的技術，未被提及則為 optional：* Next.js 全端框架* NextAuth for OAuth in Next.js* PostgreSQL or MongoDB 擇一或者混用* RESTful APIs* Pusher 互動套件* Vercel for deployment...`

### 2. Git 與版本控制
- **提示**：`請你繼續修正語法錯誤，並打第一階段的git tag v0.1.0。關於 OAuth，我需要像之前 google maps API 一樣有什麼前置作業（設定API）嗎`
- **提示**：`目前都先在本機測試，之後再部署嗎`
- **提示**：`要選什麼要選什麼`
- **提示**：`git commit`（多次）

### 3. 個人首頁功能修正
- **提示**：`關於個人首頁，請確保滿足以下條件：* 姓名 (從 Google/GitHub/Facebook 註冊時取得之姓名, e.g. Chung-Yang Ric Huang)* Number of posts* 回到 Home 的左箭頭* 背景圖（由user上傳）* 按下背景圖右下方的 "Edit Profile" 按鈕則會跳出視窗來編輯個人資料* 大頭貼 (Avatar)，中間對齊背景圖之底部...`
- **提示**：`背景圖不應覆蓋到個人頭照`
- **提示**：`edit profile 按鈕無法點擊`
- **提示**：`仍然無法點擊Edit Profile 按鈕`
- **提示**：`附圖一是目前的 edit profile 畫面，請你檢查edit profile按鈕點下去後的畫面圖層先後順序應如圖二`
- **提示**：`現在開始請不要自行提交。如圖的紅筐，edit profile按鈕異常出現（他不應出現），並請將背景圖的照片 icon 置中`
- **提示**：`請檢查edit profile按鈕，他只應該出現在個人首頁。現在按下post時edit profile按鈕會異常出現。另外，請確保 follow/following 按鈕能正常點擊實現功能`

### 4. Follow/Following 按鈕功能
- **提示**：`若我目前有追蹤這個帳號，則這個按鈕顯示白底黑字的 following，若滑鼠 hover 過要改成顯示半透明紅底的 unfollow，提示使用者若點擊按鈕代表退追蹤。若目前為未追蹤的狀態，則按鈕顯示黑底白字的 unfollow，按下去則變為追蹤狀態。`

### 5. 效能問題
- **提示**：`為何目前這個專案跑起來似乎很吃力？電腦會發熱、網頁瀏覽起來也卡卡的`

### 6. 設定與配置問題
- **提示**：`⚠ Warning: Next.js inferred your workspace root, but it may not be correct. We detected multiple lockfiles and selected the directory of /Users/hannah/package-lock.json as the root directory. To silence this warning, set turbopack.root in your Next.js config, or consider removing one of the lockfiles if it's not needed. See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information. Detected additional lockfiles: * /Users/hannah/wp1141/hw5/package-lock.json` 請幫我解決這個問題
- **提示**：`Image with src "https://lh3.googleusercontent.com/..." was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.`

### 7. 功能邏輯修正
- **提示**：`關於Home 最上面的選項， "All" 顯示所有文章，Following 顯示「我所 follow 的人」所「 post and repost 」的文章。因此「不」包括我自己 repost 的文章。`
- **提示**：`請確保我有沒有 follow 用戶甲與我點進去用戶甲的主頁的 follow/following 按鈕是邏輯一致的。`
- **提示**：`請確實管理 following / not following 的狀態，並確實實作 follow/unfollow 按鈕。如果我沒有追蹤一個人，那麼他的post and repost 就不該出現在我的主頁的 following 的頁面。另外再次強調，following 頁面不需要出現「我自己的 repost」，無論我是否有追蹤該人。`
- **提示**：`repost 與被 re-post 的 post的統計數據應該要是一致的（留言、轉發數、愛心數）。附圖的留言數不同，這是錯誤的。`
- **提示**：`點進一篇貼文後右邊欄應該長這樣。在 Post your reply 下方是所有人針對這個貼文的回覆。點開 Post your reply 後能直接打字，不要再pop up 小視窗`
- **提示**：`what's happening 的按鈕應該是 post 不是 reply。log out 的選單請在使用者點擊其他地方時收起。`
- **提示**：`我的個人首頁中的 Likes 請不要重複顯示我有repost的文。`

### 8. @mention 功能
- **提示**：`文章中如有 @mentionSomeone 的連結，點擊後會進入該 mentionSomeone 的個人 profile`

---

## 第二次對話（Vercel 部署）

### 9. 部署相關問題
- **提示**：`我現在適合deploy嗎？`
- **提示**：`部署到vercel 之後我只要 push 新的東西就會更新嗎？`
- **提示**：`協助我部署到 vercel`
- **提示**：`我該做什麼`
- **提示**：`我要在哪裡取得部署網址`
- **提示**：`這樣對嗎`
- **提示**：`no results`
- **提示**：`Root Directory 是 hw5`
- **提示**：`git push`
- **提示**：`redeploy`
- **提示**：`部署時NEXTAUTH_SECRET要新生成嗎？`
- **提示**：`preview 跟 development 是 no custom domain 對嗎？`

### 10. OAuth 設定問題
- **提示**：`我已確認 google oauth 、 Vercel 部署網址、NEXTAUTH_URL都已設定正確，但 google oauth 仍然無法運作`
- **提示**：`[auth][error] MissingCSRF: CSRF token was missing during an action signin...`

### 11. 錯誤訊息
- **提示**：`error: Environment Variable "MONGODB_URI" references Secret "mongodb-uri", which does not exist.`
- **提示**：`Both outputFileTracingRoot and turbopack.root are set, but they must have the same value.`
- **提示**：`Be careful! The redirect_uri is not associated with this application. The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.`

---
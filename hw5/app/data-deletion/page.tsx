export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8">用戶資料刪除說明</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">如何刪除您的帳戶和資料</h2>
            <p className="mb-4">
              如果您想要刪除您的帳戶和所有相關資料，請按照以下步驟操作：
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="font-semibold text-blue-800 mb-2">重要提醒：</p>
              <p className="text-blue-700">
                刪除帳戶是不可逆的操作。刪除後，您將無法恢復您的貼文、留言或任何其他資料。
              </p>
            </div>

            <ol className="list-decimal list-inside ml-4 space-y-3">
              <li>
                <strong>登入您的帳戶</strong>
                <p className="ml-6 text-sm text-gray-600">
                  確保您已經登入到要刪除的帳戶
                </p>
              </li>
              <li>
                <strong>前往個人頁面</strong>
                <p className="ml-6 text-sm text-gray-600">
                  點擊您的頭像或 userID 進入個人頁面
                </p>
              </li>
              <li>
                <strong>聯繫管理員</strong>
                <p className="ml-6 text-sm text-gray-600">
                  目前需要手動聯繫管理員來刪除帳戶
                </p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">聯繫我們</h2>
            <p className="mb-4">
              請發送電子郵件到以下地址，並在郵件中註明：
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li>您的 userID</li>
              <li>您使用的 OAuth Provider（Google/GitHub/Facebook）</li>
              <li>確認您想要刪除帳戶</li>
            </ul>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">聯絡信箱：</p>
              <p>
                <a 
                  href="mailto:ziyenhua28@gmail.com?subject=帳戶刪除請求" 
                  className="text-blue-600 hover:underline text-lg"
                >
                  ziyenhua28@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">刪除後會發生什麼</h2>
            <p>一旦您的帳戶被刪除，以下資料將被永久移除：</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>您的個人資料資訊</li>
              <li>您發布的所有貼文</li>
              <li>您的留言和回覆</li>
              <li>您的按讚記錄</li>
              <li>您的追蹤關係</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">處理時間</h2>
            <p>
              我們會在收到您的刪除請求後，於 <strong>7 個工作天內</strong> 完成帳戶刪除作業。
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              最後更新：{new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


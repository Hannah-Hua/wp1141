export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8">隱私政策</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">資料收集</h2>
            <p className="mb-4">
              本應用程式使用 OAuth 登入服務（Google、GitHub、Facebook）來驗證用戶身份。
            </p>
            <p>我們收集以下資訊：</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>姓名</li>
              <li>電子郵件地址</li>
              <li>個人頭像（如果提供）</li>
              <li>您發布的貼文內容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">資料使用</h2>
            <p>我們使用這些資訊來：</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>提供個人化的用戶體驗</li>
              <li>管理您的帳戶</li>
              <li>顯示您的貼文和互動內容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">資料儲存</h2>
            <p>
              您的資料儲存在安全的 MongoDB 資料庫中，我們會採取適當的安全措施來保護您的資訊。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">資料刪除</h2>
            <p>
              如果您想刪除您的帳戶和資料，請訪問：
            </p>
            <p className="mt-2">
              <a 
                href="/data-deletion" 
                className="text-blue-600 hover:underline"
              >
                /data-deletion
              </a>
            </p>
            <p className="mt-2">
              或聯繫：<a href="mailto:ziyenhua28@gmail.com" className="text-blue-600 hover:underline">ziyenhua28@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookie 使用</h2>
            <p>
              我們使用 Cookie 來維持您的登入狀態。這些 Cookie 不會包含個人敏感資訊。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">聯絡我們</h2>
            <p>
              如有任何關於隱私政策的問題，請聯繫：
            </p>
            <p className="mt-2">
              <a href="mailto:ziyenhua28@gmail.com" className="text-blue-600 hover:underline">
                ziyenhua28@gmail.com
              </a>
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


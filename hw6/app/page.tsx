export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">遺失在台大地下室的秘寶</h1>
        <p className="text-gray-600 mb-8">LINE Bot 文字冒險 RPG 遊戲</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Webhook Endpoint: <code className="bg-gray-200 px-2 py-1 rounded">/api/line/webhook</code>
          </p>
          <p className="text-sm text-gray-500">
            管理後台: <a href="/admin" className="text-blue-600 hover:underline">/admin</a>
          </p>
        </div>
      </div>
    </div>
  );
}


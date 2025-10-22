import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const VisitsPage: React.FC = () => {
  const { visits, deleteVisit, getCafeById, loadVisits, loading } = useAppContext();
  const navigate = useNavigate();

  // 載入到訪記錄
  useEffect(() => {
    loadVisits();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('確定要刪除這筆到訪記錄嗎？')) {
      try {
        await deleteVisit(id);
      } catch (err: any) {
        alert(err.message || '刪除失敗');
      }
    }
  };

  // 按日期排序（最新的在前）
  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-amber-600">📝 我的到訪記錄</h1>
        <div className="w-20"></div>
      </nav>

      {/* 內容區域 */}
      <div className="max-w-4xl mx-auto p-6">
        {sortedVisits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">☕</div>
            <p className="text-xl text-gray-600 mb-4">還沒有任何到訪記錄</p>
            <p className="text-gray-500 mb-6">開始探索咖啡廳並記錄你的體驗吧！</p>
            <button
              onClick={() => navigate('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              瀏覽咖啡廳
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedVisits.map(visit => {
              const cafe = getCafeById(visit.cafeId);
              if (!cafe) return null;

              return (
                <div key={visit.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-amber-600"
                          onClick={() => navigate(`/cafe/${cafe.id}`)}
                        >
                          {cafe.name}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(visit.visitDate).toLocaleDateString('zh-TW')}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{cafe.address}</p>

                      {renderStars(visit.rating)}

                      {visit.notes && (
                        <div className="mt-3 bg-amber-50 p-3 rounded-lg">
                          <p className="text-gray-700">{visit.notes}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="text-gray-400 hover:text-red-600 transition ml-4"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 統計資訊 */}
        {sortedVisits.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 統計</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">{sortedVisits.length}</p>
                <p className="text-sm text-gray-600 mt-1">總到訪次數</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {new Set(sortedVisits.map(v => v.cafeId)).size}
                </p>
                <p className="text-sm text-gray-600 mt-1">不同咖啡廳</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {(sortedVisits.reduce((sum, v) => sum + v.rating, 0) / sortedVisits.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 mt-1">平均評分</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsPage;


'use client';

import { useState, useEffect } from 'react';

interface Conversation {
  _id: string;
  lineUserId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  gameState: {
    phase: string;
    character: {
      name?: string;
      class?: string;
      hp?: number;
      maxHp?: number;
      gold?: number;
      items?: string[];
    };
    progress: number;
  };
  createdAt: string;
  updatedAt: string;
  user?: {
    displayName?: string;
  } | null;
  messageCount: number;
  lastMessage: {
    role: string;
    content: string;
    timestamp: string;
  } | null;
}

interface Stats {
  totalUsers: number;
  totalConversations: number;
  activeConversations: number;
  phaseStats: Record<string, number>;
  totalMessages: number;
}

export default function AdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    lineUserId: '',
    startDate: '',
    endDate: '',
    phase: '',
    page: 1,
  });

  useEffect(() => {
    fetchStats();
    fetchConversations();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.lineUserId) params.append('lineUserId', filters.lineUserId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.phase) params.append('phase', filters.phase);
      params.append('page', filters.page.toString());
      params.append('limit', '20');

      const res = await fetch(`/api/admin/conversations?${params}`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">LINE Bot 管理後台</h1>

        {/* 統計資訊 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">總使用者數</div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">總會話數</div>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">活躍會話（24h）</div>
              <div className="text-2xl font-bold">{stats.activeConversations}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">總訊息數</div>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-500">進行中遊戲</div>
              <div className="text-2xl font-bold">
                {stats.phaseStats['playing'] || 0}
              </div>
            </div>
          </div>
        )}

        {/* 篩選器 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">篩選條件</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LINE User ID
              </label>
              <input
                type="text"
                value={filters.lineUserId}
                onChange={(e) => handleFilterChange('lineUserId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="輸入 User ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日期
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                結束日期
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                遊戲階段
              </label>
              <select
                value={filters.phase}
                onChange={(e) => handleFilterChange('phase', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">全部</option>
                <option value="idle">未開始</option>
                <option value="creating_name">輸入名稱</option>
                <option value="choosing_class">選擇職業</option>
                <option value="playing">進行中</option>
                <option value="game_over">已結束</option>
              </select>
            </div>
          </div>
        </div>

        {/* 對話列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">對話紀錄</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">載入中...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">沒有找到對話紀錄</div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <div key={conv._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">
                        {conv.user?.displayName || '未知使用者'}
                      </div>
                      <div className="text-sm text-gray-500">
                        User ID: {conv.lineUserId}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>
                        {new Date(conv.createdAt).toLocaleString('zh-TW')}
                      </div>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {conv.gameState.phase}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <div>
                      <strong>角色：</strong>
                      {conv.gameState.character.name || '未設定'} (
                      {conv.gameState.character.class || '未選擇職業'})
                    </div>
                    <div className="mt-1">
                      <strong>狀態：</strong>
                      HP: {conv.gameState.character.hp || 0}/
                      {conv.gameState.character.maxHp || 100} | 金錢:{' '}
                      {conv.gameState.character.gold || 0} | 進度:{' '}
                      {conv.gameState.progress}%
                    </div>
                    <div className="mt-1">
                      <strong>訊息數：</strong>
                      {conv.messageCount}
                    </div>
                    {conv.lastMessage && (
                      <div className="mt-2 p-2 bg-gray-100 rounded">
                        <div className="text-xs text-gray-500">
                          {conv.lastMessage.role === 'user' ? '使用者' : 'Bot'}：
                        </div>
                        <div className="text-sm">
                          {conv.lastMessage.content.substring(0, 200)}
                          {conv.lastMessage.content.length > 200 && '...'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分頁 */}
        {!loading && conversations.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
              }
              disabled={filters.page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              上一頁
            </button>
            <span className="px-4 py-2">第 {filters.page} 頁</span>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-4 py-2 border rounded-md"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


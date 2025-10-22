import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CafeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addCafe, updateCafe, getCafeById } = useAppContext();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '辦公友善',
    rating: 0,
    priceLevel: 2,
    hasWifi: true,
    hasPowerOutlets: true,
    hasTimeLimit: false,
    isNoisy: false,
    hasGoodLighting: true,
    hasAvailableSeats: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const cafe = getCafeById(Number(id));
      if (cafe) {
        setFormData({
          name: cafe.name,
          description: cafe.description,
          address: cafe.address,
          category: cafe.category,
          rating: cafe.rating || 0,
          priceLevel: cafe.priceLevel || 2,
          hasWifi: cafe.hasWifi,
          hasPowerOutlets: cafe.hasPowerOutlets,
          hasTimeLimit: cafe.hasTimeLimit,
          isNoisy: cafe.isNoisy,
          hasGoodLighting: cafe.hasGoodLighting,
          hasAvailableSeats: cafe.hasAvailableSeats,
        });
      }
    }
  }, [isEdit, id, getCafeById]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入咖啡廳名稱';
    }
    if (!formData.address.trim()) {
      newErrors.address = '請輸入地址';
    }
    if (!formData.description.trim()) {
      newErrors.description = '請輸入描述';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateCafe(Number(id), formData);
        alert('咖啡廳已更新！');
      } else {
        await addCafe(formData);
        alert('咖啡廳已新增！');
      }
      navigate('/');
    } catch (err: any) {
      alert(err.message || '操作失敗，請稍後再試');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

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
        <h1 className="text-2xl font-bold text-amber-600">
          {isEdit ? '✏️ 編輯咖啡廳' : '+ 新增咖啡廳'}
        </h1>
        <div className="w-20"></div>
      </nav>

      {/* 表單 */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 名稱 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                咖啡廳名稱 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：Cafe Nomad"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* 類別 */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                類別
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="辦公友善">辦公友善</option>
                <option value="精品咖啡">精品咖啡</option>
                <option value="連鎖咖啡">連鎖咖啡</option>
                <option value="獨立咖啡">獨立咖啡</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                描述 *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="描述這間咖啡廳的特色..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* 地址 */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                地址 *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例：台北市大安區復興南路一段 253 號"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* 評分和價格 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  評分 (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="priceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  價格等級 (1-4)
                </label>
                <select
                  id="priceLevel"
                  name="priceLevel"
                  value={formData.priceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value={1}>$ 便宜</option>
                  <option value={2}>$$ 中等</option>
                  <option value={3}>$$$ 偏貴</option>
                  <option value={4}>$$$$ 昂貴</option>
                </select>
              </div>
            </div>

            {/* 設施與環境 */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">設施與環境</p>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasWifi"
                    checked={formData.hasWifi}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">📶 有 WiFi</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasPowerOutlets"
                    checked={formData.hasPowerOutlets}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">🔌 有插座</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasTimeLimit"
                    checked={formData.hasTimeLimit}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">⏰ 有時間限制</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNoisy"
                    checked={formData.isNoisy}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">🔊 會吵雜</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasGoodLighting"
                    checked={formData.hasGoodLighting}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">💡 光線充足</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasAvailableSeats"
                    checked={formData.hasAvailableSeats}
                    onChange={handleChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-gray-700">🪑 經常有座位</span>
                </label>
              </div>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {isEdit ? '更新' : '新增'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CafeFormPage;


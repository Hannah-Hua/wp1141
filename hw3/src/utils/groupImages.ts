// 團體圖片工具函數

// 獲取團體合照的圖片路徑
export const getGroupImagePath = (groupName: string): string => {
  // 將團體名稱轉換為檔案名稱格式
  const fileName = groupName
    .replace(/\s+/g, '_')  // 空格替換為底線
    .replace(/[()]/g, '')  // 移除括號
    .replace(/[&]/g, 'and') // & 替換為 and
    .toLowerCase();
  
  return `/images/groups/${fileName}.jpg`;
};

// 檢查圖片是否存在（用於錯誤處理）
export const getImageWithFallback = (groupName: string): string => {
  const imagePath = getGroupImagePath(groupName);
  // 這裡可以加入圖片存在性檢查邏輯
  return imagePath;
};

// 預設圖片路徑（當團體圖片不存在時使用）
export const DEFAULT_GROUP_IMAGE = '/images/groups/default.jpg';

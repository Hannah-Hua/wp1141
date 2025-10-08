import { useState } from 'react';
import { FilterOptions } from '../types';

/**
 * 篩選和搜尋狀態管理 Hook
 */
export const useFilterAndSearch = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 處理娛樂公司選擇
  const handleEntertainmentSelect = (entertainment: string) => {
    setFilters({
      entertainment,
    });
    setSearchTerm('');
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 清除所有篩選
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    // 滾動到頁面最上方
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 處理搜尋輸入
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // 清空搜尋時清除搜尋狀態
    if (!term.trim()) {
      setSearchTerm('');
    } else {
      // 有搜尋內容時滾動到頁面最上方
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    filters,
    searchTerm,
    setFilters,
    setSearchTerm,
    handleEntertainmentSelect,
    clearFilters,
    handleSearchChange,
  };
};


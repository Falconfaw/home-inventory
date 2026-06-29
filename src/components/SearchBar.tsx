import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/utils/helpers';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = '搜索物品...' }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="relative max-w-md">
      <div className="flex items-center bg-white rounded-lg shadow-md px-4 py-3">
        <Search size={20} className="text-gray-400 mr-3" />
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-[#5D4037] placeholder-gray-400"
        />
        {keyword && (
          <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
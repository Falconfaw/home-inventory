import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { ItemCard } from '@/components/ItemCard';
import { useAppStore } from '@/store';
import { Item } from '@/types';

export const SearchPage = () => {
  const { items, locations, initializeData, updateItem, deleteItem } = useAppStore();
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleSearch = (keyword: string) => {
    setHasSearched(true);
    if (!keyword) {
      setSearchResults(items);
    } else {
      const lowerKeyword = keyword.toLowerCase();
      const results = items.filter((item) =>
        item.name.toLowerCase().includes(lowerKeyword)
      );
      setSearchResults(results);
    }
  };

  const handleEdit = (item: Item) => {
    // 导航到物品管理页面进行编辑
    window.location.href = '/items';
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个物品吗？')) {
      deleteItem(id);
      setSearchResults(searchResults.filter((item) => item.id !== id));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <h1 className="text-2xl font-bold text-[#5D4037]">搜索物品</h1>

        {/* 搜索栏 */}
        <SearchBar onSearch={handleSearch} placeholder="输入物品名称搜索..." />

        {/* 搜索结果 */}
        {hasSearched && (
          <div>
            {searchResults.length > 0 ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  找到 {searchResults.length} 个物品
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((item) => {
                    const location = locations.find((l) => l.id === item.locationId);
                    return (
                      <ItemCard
                        key={item.id}
                        item={item}
                        location={location}
                        showActions={false}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500">没有找到匹配的物品</p>
              </div>
            )}
          </div>
        )}

        {/* 未搜索时的提示 */}
        {!hasSearched && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">输入关键词开始搜索物品</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
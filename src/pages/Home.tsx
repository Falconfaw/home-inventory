import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Search, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useAppStore } from '@/store';

export const HomePage = () => {
  const { items, locations, initializeData } = useAppStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">物品总数</p>
                <p className="text-3xl font-bold text-[#5D4037]">{items.length}</p>
              </div>
              <Package size={40} className="text-[#81C784]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">位置总数</p>
                <p className="text-3xl font-bold text-[#5D4037]">{locations.length}</p>
              </div>
              <MapPin size={40} className="text-[#64B5F6]" />
            </div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">快速操作</p>
                <p className="text-lg font-bold text-[#5D4037]">开始管理</p>
              </div>
              <Search size={40} className="text-[#81C784]" />
            </div>
          </div> */}
        </div>

        {/* 快速操作按钮 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#5D4037] mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/items"
              className="flex items-center justify-center space-x-2 bg-[#81C784] text-white px-6 py-4 rounded-lg hover:bg-[#66BB6A] transition-colors shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">添加新物品</span>
            </Link>

            <Link
              to="/locations"
              className="flex items-center justify-center space-x-2 bg-[#64B5F6] text-white px-6 py-4 rounded-lg hover:bg-[#42A5F5] transition-colors shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">添加新位置</span>
            </Link>
          </div>
        </div>

        {/* 最近添加的物品 */}
        {items.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#5D4037] mb-4">最近添加的物品</h2>
            <div className="space-y-3">
              {items.slice(0, 5).map((item) => {
                const location = locations.find((l) => l.id === item.locationId);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[#5D4037]">{item.name}</p>
                      {location && (
                        <p className="text-sm text-gray-500">{location.name}</p>
                      )}
                    </div>
                    {/* <Link
                      to="/search"
                      className="text-[#64B5F6] hover:text-[#42A5F5] text-sm font-medium"
                    >
                      查看详情
                    </Link> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 空状态提示 */}
        {items.length === 0 && locations.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package size={60} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#5D4037] mb-2">
              开始管理你的家庭物品
            </h3>
            <p className="text-gray-500 mb-6">
              先添加一些位置，然后开始记录物品的存放位置
            </p>
            <Link
              to="/locations"
              className="inline-flex items-center space-x-2 bg-[#5D4037] text-white px-6 py-3 rounded-lg hover:bg-[#4E342E] transition-colors shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">添加第一个位置</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};
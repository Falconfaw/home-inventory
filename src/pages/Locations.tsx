import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { LocationCard } from '@/components/LocationCard';
import { useAppStore } from '@/store';
import { Location } from '@/types';

export const LocationsPage = () => {
  const { locations, items, initializeData, addLocation, updateLocation, deleteLocation, getItemsByLocationId } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        description: location.description || '',
      });
    } else {
      setEditingLocation(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('请填写位置名称');
      return;
    }

    if (editingLocation) {
      updateLocation(editingLocation.id, formData.name, formData.description);
    } else {
      addLocation(formData.name, formData.description);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const itemsInLocation = getItemsByLocationId(id);
    if (itemsInLocation.length > 0) {
      alert(`该位置下还有 ${itemsInLocation.length} 个物品，请先移除这些物品`);
      return;
    }

    if (confirm('确定要删除这个位置吗？')) {
      deleteLocation(id);
    }
  };

  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题和添加按钮 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5D4037]">位置管理</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#64B5F6] text-white px-4 py-2 rounded-lg hover:bg-[#42A5F5] transition-colors shadow-md"
          >
            <Plus size={20} />
            <span className="font-medium">添加位置</span>
          </button>
        </div>

        {/* 位置列表 */}
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => {
              const itemCount = getItemsByLocationId(location.id).length;
              return (
                <LocationCard
                  key={location.id}
                  location={location}
                  itemCount={itemCount}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">还没有添加任何位置</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center space-x-2 bg-[#64B5F6] text-white px-6 py-3 rounded-lg hover:bg-[#42A5F5] transition-colors shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">添加第一个位置</span>
            </button>
          </div>
        )}

        {/* 添加/编辑位置模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingLocation ? '编辑位置' : '添加位置'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                位置名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
                placeholder="例如：阳台左边柜子第一层"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                位置描述（可选）
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
                placeholder="例如：常用日用品存放处"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#64B5F6] text-white rounded-lg hover:bg-[#42A5F5] transition-colors"
              >
                {editingLocation ? '更新' : '保存'}
              </button>
            </div>
          </form>
        </Modal>

        {/* 位置详情模态框 */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          title={selectedLocation ? `${selectedLocation.name} - 物品列表` : '物品列表'}
        >
          {selectedLocation && (
            <div className="space-y-3">
              {getItemsByLocationId(selectedLocation.id).length > 0 ? (
                getItemsByLocationId(selectedLocation.id).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#5D4037]">{item.name}</span>
                        {item.quantity && (
                          <span className="text-sm bg-[#81C784] text-white px-2 py-0.5 rounded-full">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-sm text-gray-500 mt-1">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  该位置下暂无物品
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};
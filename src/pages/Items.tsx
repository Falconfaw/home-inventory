import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { ItemCard } from '@/components/ItemCard';
import { useAppStore } from '@/store';
import { Item } from '@/types';

export const ItemsPage = () => {
  const { items, locations, initializeData, addItem, updateItem, deleteItem } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    locationId: '',
    quantity: '',
    note: '',
  });

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        locationId: item.locationId,
        quantity: item.quantity || '',
        note: item.note || '',
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', locationId: '', quantity: '', note: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', locationId: '', quantity: '', note: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.locationId) {
      alert('请填写物品名称并选择位置');
      return;
    }

    if (editingItem) {
      updateItem(editingItem.id, formData.name, formData.locationId, formData.quantity, formData.note);
    } else {
      addItem(formData.name, formData.locationId, formData.quantity, formData.note);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个物品吗？')) {
      deleteItem(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 页面标题和添加按钮 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5D4037]">物品管理</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#81C784] text-white px-4 py-2 rounded-lg hover:bg-[#66BB6A] transition-colors shadow-md"
          >
            <Plus size={20} />
            <span className="font-medium">添加物品</span>
          </button>
        </div>

        {/* 物品列表 */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const location = locations.find((l) => l.id === item.locationId);
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  location={location}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">还没有添加任何物品</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center space-x-2 bg-[#81C784] text-white px-6 py-3 rounded-lg hover:bg-[#66BB6A] transition-colors shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">添加第一个物品</span>
            </button>
          </div>
        )}

        {/* 添加/编辑物品模态框 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingItem ? '编辑物品' : '添加物品'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                物品名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C784]"
                placeholder="例如：抽纸"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                存放位置 *
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C784]"
                required
              >
                <option value="">请选择位置</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {locations.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  请先添加位置，才能添加物品
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                数量（可选）
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C784]"
                placeholder="例如：10包、3块、5个"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                备注（可选）
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81C784]"
                placeholder="例如：常用物品"
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
                className="flex-1 px-4 py-2 bg-[#81C784] text-white rounded-lg hover:bg-[#66BB6A] transition-colors"
              >
                {editingItem ? '更新' : '保存'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
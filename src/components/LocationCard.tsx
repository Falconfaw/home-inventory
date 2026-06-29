import { Package, Edit, Trash2, Eye } from 'lucide-react';
import { Location } from '@/types';
import { formatDate } from '@/utils/helpers';

interface LocationCardProps {
  location: Location;
  itemCount: number;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  onViewDetails: (location: Location) => void;
}

export const LocationCard = ({
  location,
  itemCount,
  onEdit,
  onDelete,
  onViewDetails,
}: LocationCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#5D4037] mb-2">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-gray-600 mb-3">{location.description}</p>
          )}
          <div className="flex items-center text-gray-500 mb-2">
            <Package size={16} className="mr-2 text-[#81C784]" />
            <span className="text-sm">包含 {itemCount} 个物品</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            更新时间: {formatDate(location.updatedAt)}
          </p>
        </div>

        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onViewDetails(location)}
            className="p-2 hover:bg-[#81C784] hover:text-white rounded-lg transition-colors text-[#81C784]"
            title="查看详情"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(location)}
            className="p-2 hover:bg-[#64B5F6] hover:text-white rounded-lg transition-colors text-[#64B5F6]"
            title="编辑"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500"
            title="删除"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
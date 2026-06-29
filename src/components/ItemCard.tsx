import { MapPin, Edit, Trash2 } from 'lucide-react';
import { Item, Location } from '@/types';
import { formatDate } from '@/utils/helpers';

interface ItemCardProps {
  item: Item;
  location?: Location;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ItemCard = ({ item, location, onEdit, onDelete, showActions = true }: ItemCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-[#5D4037]">{item.name}</h3>
            {item.quantity && (
              <span className="text-sm bg-[#81C784] text-white px-2 py-0.5 rounded-full">
                {item.quantity}
              </span>
            )}
          </div>
          {location && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-2 text-[#81C784]" />
              <span className="text-sm">{location.name}</span>
            </div>
          )}
          {item.note && (
            <p className="text-sm text-gray-500 mb-2 bg-gray-50 px-3 py-2 rounded-lg">
              {item.note}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            更新时间: {formatDate(item.updatedAt)}
          </p>
        </div>

        {showActions && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 hover:bg-[#64B5F6] hover:text-white rounded-lg transition-colors text-[#64B5F6]"
                title="编辑"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-red-500"
                title="删除"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
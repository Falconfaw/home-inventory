// 物品接口
export interface Item {
  id: string;
  name: string;
  locationId: string;
  quantity?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// 位置接口
export interface Location {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 应用状态接口
export interface AppState {
  items: Item[];
  locations: Location[];
}

// 存储键名
export const STORAGE_KEYS = {
  ITEMS: 'home_inventory_items',
  LOCATIONS: 'home_inventory_locations',
};
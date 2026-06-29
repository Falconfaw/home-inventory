import { create } from 'zustand';
import { Item, Location } from '@/types';
import { loadItems, saveItems, loadLocations, saveLocations, generateId, getCurrentTimestamp } from '@/utils/storage';

interface AppStore {
  items: Item[];
  locations: Location[];

  // 物品操作
  addItem: (name: string, locationId: string, quantity?: string, note?: string) => void;
  updateItem: (id: string, name: string, locationId: string, quantity?: string, note?: string) => void;
  deleteItem: (id: string) => void;

  // 位置操作
  addLocation: (name: string, description?: string) => void;
  updateLocation: (id: string, name: string, description?: string) => void;
  deleteLocation: (id: string) => void;

  // 查询操作
  getItemById: (id: string) => Item | undefined;
  getLocationById: (id: string) => Location | undefined;
  getItemsByLocationId: (locationId: string) => Item[];
  searchItems: (keyword: string) => Item[];

  // 初始化数据
  initializeData: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  items: [],
  locations: [],

  // 添加物品
  addItem: (name, locationId, note) => {
    const newItem: Item = {
      id: generateId(),
      name,
      locationId,
      note,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    set((state) => {
      const newItems = [...state.items, newItem];
      saveItems(newItems);
      return { items: newItems };
    });
  },

  // 更新物品
  updateItem: (id, name, locationId, quantity, note) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id
          ? { ...item, name, locationId, quantity, note, updatedAt: getCurrentTimestamp() }
          : item
      );
      saveItems(newItems);
      return { items: newItems };
    });
  },

  // 删除物品
  deleteItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      saveItems(newItems);
      return { items: newItems };
    });
  },

  // 添加位置
  addLocation: (name, description) => {
    const newLocation: Location = {
      id: generateId(),
      name,
      description,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    set((state) => {
      const newLocations = [...state.locations, newLocation];
      saveLocations(newLocations);
      return { locations: newLocations };
    });
  },

  // 更新位置
  updateLocation: (id, name, description) => {
    set((state) => {
      const newLocations = state.locations.map((location) =>
        location.id === id
          ? { ...location, name, description, updatedAt: getCurrentTimestamp() }
          : location
      );
      saveLocations(newLocations);
      return { locations: newLocations };
    });
  },

  // 删除位置
  deleteLocation: (id) => {
    set((state) => {
      const newLocations = state.locations.filter((location) => location.id !== id);
      saveLocations(newLocations);
      return { locations: newLocations };
    });
  },

  // 根据ID获取物品
  getItemById: (id) => {
    return get().items.find((item) => item.id === id);
  },

  // 根据ID获取位置
  getLocationById: (id) => {
    return get().locations.find((location) => location.id === id);
  },

  // 根据位置ID获取物品列表
  getItemsByLocationId: (locationId) => {
    return get().items.filter((item) => item.locationId === locationId);
  },

  // 搜索物品
  searchItems: (keyword) => {
    if (!keyword) return get().items;
    const lowerKeyword = keyword.toLowerCase();
    return get().items.filter((item) =>
      item.name.toLowerCase().includes(lowerKeyword)
    );
  },

  // 初始化数据
  initializeData: () => {
    const items = loadItems();
    const locations = loadLocations();
    set({ items, locations });
  },
}));
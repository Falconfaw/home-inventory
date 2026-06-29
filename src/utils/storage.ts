import { Item, Location, STORAGE_KEYS } from '@/types';

// 从LocalStorage加载物品数据
export const loadItems = (): Item[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载物品数据失败:', error);
    return [];
  }
};

// 保存物品数据到LocalStorage
export const saveItems = (items: Item[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('保存物品数据失败:', error);
  }
};

// 从LocalStorage加载位置数据
export const loadLocations = (): Location[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载位置数据失败:', error);
    return [];
  }
};

// 保存位置数据到LocalStorage
export const saveLocations = (locations: Location[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  } catch (error) {
    console.error('保存位置数据失败:', error);
  }
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 获取当前时间戳
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
import { create } from 'zustand';
import { Item, Location } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { loadItems, saveItems, loadLocations, saveLocations, generateId, getCurrentTimestamp } from '@/utils/storage';

interface AppStore {
  items: Item[];
  locations: Location[];
  isLoaded: boolean;

  addItem: (name: string, locationId: string, quantity?: string, note?: string) => void;
  updateItem: (id: string, name: string, locationId: string, quantity?: string, note?: string) => void;
  deleteItem: (id: string) => void;

  addLocation: (name: string, description?: string) => void;
  updateLocation: (id: string, name: string, description?: string) => void;
  deleteLocation: (id: string) => void;

  getItemById: (id: string) => Item | undefined;
  getLocationById: (id: string) => Location | undefined;
  getItemsByLocationId: (locationId: string) => Item[];
  searchItems: (keyword: string) => Item[];

  initializeData: () => Promise<void>;
  subscribeRealtime: () => () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  items: [],
  locations: [],
  isLoaded: false,

  addItem: (name, locationId, quantity, note) => {
    const newItem: Item = {
      id: generateId(),
      name,
      locationId,
      quantity,
      note,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    set((state) => {
      const newItems = [...state.items, newItem];
      if (isSupabaseConfigured() && supabase) {
        supabase.from('items').insert(newItem);
      } else {
        saveItems(newItems);
      }
      return { items: newItems };
    });
  },

  updateItem: (id, name, locationId, quantity, note) => {
    set((state) => {
      const updated = { ...state.items.find((i) => i.id === id)!, name, locationId, quantity, note, updatedAt: getCurrentTimestamp() };
      const newItems = state.items.map((item) => (item.id === id ? updated : item));
      if (isSupabaseConfigured() && supabase) {
        supabase.from('items').update({ name, location_id: locationId, quantity, note, updated_at: updated.updatedAt }).eq('id', id);
      } else {
        saveItems(newItems);
      }
      return { items: newItems };
    });
  },

  deleteItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      if (isSupabaseConfigured() && supabase) {
        supabase.from('items').delete().eq('id', id);
      } else {
        saveItems(newItems);
      }
      return { items: newItems };
    });
  },

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
      if (isSupabaseConfigured() && supabase) {
        supabase.from('locations').insert({
          id: newLocation.id,
          name: newLocation.name,
          description: newLocation.description,
          created_at: newLocation.createdAt,
          updated_at: newLocation.updatedAt,
        });
      } else {
        saveLocations(newLocations);
      }
      return { locations: newLocations };
    });
  },

  updateLocation: (id, name, description) => {
    set((state) => {
      const updatedAt = getCurrentTimestamp();
      const newLocations = state.locations.map((location) =>
        location.id === id ? { ...location, name, description, updatedAt } : location
      );
      if (isSupabaseConfigured() && supabase) {
        supabase.from('locations').update({ name, description, updated_at: updatedAt }).eq('id', id);
      } else {
        saveLocations(newLocations);
      }
      return { locations: newLocations };
    });
  },

  deleteLocation: (id) => {
    set((state) => {
      const newLocations = state.locations.filter((location) => location.id !== id);
      if (isSupabaseConfigured() && supabase) {
        supabase.from('locations').delete().eq('id', id);
      } else {
        saveLocations(newLocations);
      }
      return { locations: newLocations };
    });
  },

  getItemById: (id) => get().items.find((item) => item.id === id),
  getLocationById: (id) => get().locations.find((location) => location.id === id),
  getItemsByLocationId: (locationId) => get().items.filter((item) => item.locationId === locationId),
  searchItems: (keyword) => {
    if (!keyword) return get().items;
    const lowerKeyword = keyword.toLowerCase();
    return get().items.filter((item) => item.name.toLowerCase().includes(lowerKeyword));
  },

  initializeData: async () => {
    if (isSupabaseConfigured() && supabase) {
      const [{ data: itemsData }, { data: locationsData }] = await Promise.all([
        supabase.from('items').select('*'),
        supabase.from('locations').select('*'),
      ]);
      set({
        items: (itemsData || []).map((r: any) => ({
          id: r.id, name: r.name, locationId: r.location_id, quantity: r.quantity, note: r.note,
          createdAt: r.created_at, updatedAt: r.updated_at,
        })),
        locations: (locationsData || []).map((r: any) => ({
          id: r.id, name: r.name, description: r.description,
          createdAt: r.created_at, updatedAt: r.updated_at,
        })),
        isLoaded: true,
      });
    } else {
      const items = loadItems();
      const locations = loadLocations();
      set({ items, locations, isLoaded: true });
    }
  },

  subscribeRealtime: () => {
    if (!isSupabaseConfigured() || !supabase) return () => {};
    const channel = supabase.channel('inventory-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, async () => {
      const { data } = await supabase!.from('items').select('*');
      set({
        items: (data || []).map((r: any) => ({
          id: r.id, name: r.name, locationId: r.location_id, quantity: r.quantity, note: r.note,
          createdAt: r.created_at, updatedAt: r.updated_at,
        })),
      });
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, async () => {
      const { data } = await supabase!.from('locations').select('*');
      set({
        locations: (data || []).map((r: any) => ({
          id: r.id, name: r.name, description: r.description,
          createdAt: r.created_at, updatedAt: r.updated_at,
        })),
      });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  },
}));

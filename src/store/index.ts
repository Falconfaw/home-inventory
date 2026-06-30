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

const supabaseInsert = async (table: 'items' | 'locations', row: any) => {
  if (!supabase) return;
  const { data, error } = await supabase.from(table).insert(row).select();
  if (error) console.error(`[Supabase] INSERT ${table} error:`, error);
  else console.log(`[Supabase] INSERT ${table} ok:`, data);
};

const supabaseUpdate = async (table: 'items' | 'locations', values: any, id: string) => {
  if (!supabase) return;
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select();
  if (error) console.error(`[Supabase] UPDATE ${table} error:`, error);
  else console.log(`[Supabase] UPDATE ${table} ok:`, data);
};

const supabaseDelete = async (table: 'items' | 'locations', id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) console.error(`[Supabase] DELETE ${table} error:`, error);
  else console.log(`[Supabase] DELETE ${table} ok`);
};

export const useAppStore = create<AppStore>((set, get) => ({
  items: [],
  locations: [],
  isLoaded: false,

  addItem: (name, locationId, quantity, note) => {
    const id = generateId();
    const now = getCurrentTimestamp();
    const newItem: Item = { id, name, locationId, quantity, note, createdAt: now, updatedAt: now };
    set((state) => ({ items: [...state.items, newItem] }));
    if (isSupabaseConfigured()) {
      supabaseInsert('items', { id, name, location_id: locationId, quantity, note, created_at: now, updated_at: now });
    } else {
      saveItems([...get().items]);
    }
  },

  updateItem: (id, name, locationId, quantity, note) => {
    const updatedAt = getCurrentTimestamp();
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, name, locationId, quantity, note, updatedAt } : item
      ),
    }));
    if (isSupabaseConfigured()) {
      supabaseUpdate('items', { name, location_id: locationId, quantity, note, updated_at: updatedAt }, id);
    } else {
      saveItems(get().items);
    }
  },

  deleteItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    if (isSupabaseConfigured()) {
      supabaseDelete('items', id);
    } else {
      saveItems(get().items);
    }
  },

  addLocation: (name, description) => {
    const id = generateId();
    const now = getCurrentTimestamp();
    const newLocation: Location = { id, name, description, createdAt: now, updatedAt: now };
    set((state) => ({ locations: [...state.locations, newLocation] }));
    if (isSupabaseConfigured()) {
      supabaseInsert('locations', { id, name, description, created_at: now, updated_at: now });
    } else {
      saveLocations([...get().locations]);
    }
  },

  updateLocation: (id, name, description) => {
    const updatedAt = getCurrentTimestamp();
    set((state) => ({
      locations: get().locations.map((loc) =>
        loc.id === id ? { ...loc, name, description, updatedAt } : loc
      ),
    }));
    if (isSupabaseConfigured()) {
      supabaseUpdate('locations', { name, description, updated_at: updatedAt }, id);
    } else {
      saveLocations(get().locations);
    }
  },

  deleteLocation: (id) => {
    set((state) => ({ locations: get().locations.filter((loc) => loc.id !== id) }));
    if (isSupabaseConfigured()) {
      supabaseDelete('locations', id);
    } else {
      saveLocations(get().locations);
    }
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
    console.log('[Supabase] configured:', isSupabaseConfigured(), supabase ? 'client OK' : 'client NULL');
    if (isSupabaseConfigured() && supabase) {
      console.log('[Supabase] loading from cloud...');
      const [{ data: itemsData, error: iErr }, { data: locationsData, error: lErr }] = await Promise.all([
        supabase.from('items').select('*'),
        supabase.from('locations').select('*'),
      ]);
      if (iErr) console.error('[Supabase] items load error:', iErr);
      if (lErr) console.error('[Supabase] locations load error:', lErr);
      console.log('[Supabase] items:', itemsData?.length ?? 0, 'locations:', locationsData?.length ?? 0);
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
      console.log('[Supabase] not configured, using localStorage');
      set({ items: loadItems(), locations: loadLocations(), isLoaded: true });
    }
  },

  subscribeRealtime: () => {
    if (!isSupabaseConfigured() || !supabase) return () => {};
    const channel = supabase.channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, async () => {
        const { data } = await supabase!.from('items').select('*');
        set({
          items: (data || []).map((r: any) => ({
            id: r.id, name: r.name, locationId: r.location_id, quantity: r.quantity, note: r.note,
            createdAt: r.created_at, updatedAt: r.updated_at,
          })),
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, async () => {
        const { data } = await supabase!.from('locations').select('*');
        set({
          locations: (data || []).map((r: any) => ({
            id: r.id, name: r.name, description: r.description,
            createdAt: r.created_at, updatedAt: r.updated_at,
          })),
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },
}));

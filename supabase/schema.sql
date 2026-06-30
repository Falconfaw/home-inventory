-- 创建位置表
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建物品表
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  quantity TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 启用 Realtime
alter publication supabase_realtime add table locations;
alter publication supabase_realtime add table items;

-- 设置 RLS 策略：允许匿名读写（适合家庭共享场景）
-- 如果需要更严格的安全，可以改为需要登录

-- locations 表策略
DROP POLICY IF EXISTS "locations_select_all" ON locations;
CREATE POLICY "locations_select_all" ON locations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "locations_insert_all" ON locations;
CREATE POLICY "locations_insert_all" ON locations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "locations_update_all" ON locations;
CREATE POLICY "locations_update_all" ON locations
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "locations_delete_all" ON locations;
CREATE POLICY "locations_delete_all" ON locations
  FOR DELETE USING (true);

-- items 表策略
DROP POLICY IF EXISTS "items_select_all" ON items;
CREATE POLICY "items_select_all" ON items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "items_insert_all" ON items;
CREATE POLICY "items_insert_all" ON items
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "items_update_all" ON items;
CREATE POLICY "items_update_all" ON items
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "items_delete_all" ON items;
CREATE POLICY "items_delete_all" ON items
  FOR DELETE USING (true);

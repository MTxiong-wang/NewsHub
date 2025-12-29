-- 创建系统配置表
CREATE TABLE IF NOT EXISTS system_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 插入默认配置
INSERT INTO system_config (key, value, description) VALUES
  ('news_fetch_limit', '20', '每个信源获取的新闻数量上限')
ON CONFLICT (key) DO NOTHING;

-- 启用 RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- 所有人可以读取配置
CREATE POLICY "Anyone can read system config" ON system_config
  FOR SELECT USING (true);

-- 只有管理员可以修改配置
CREATE POLICY "Admins can update system config" ON system_config
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW
  EXECUTE FUNCTION update_system_config_updated_at();
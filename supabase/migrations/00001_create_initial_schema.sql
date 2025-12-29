-- 创建用户角色枚举
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 创建平台类别枚举
CREATE TYPE public.platform_category AS ENUM ('social', 'tech', 'finance', 'general', 'other');

-- 创建用户配置表
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建平台配置表
CREATE TABLE public.platforms (
  id text PRIMARY KEY,
  name text NOT NULL,
  category public.platform_category NOT NULL,
  weight numeric NOT NULL DEFAULT 1.0,
  enabled boolean NOT NULL DEFAULT true,
  icon_url text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建新闻表
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id text NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  api_score numeric NOT NULL DEFAULT 0,
  final_score numeric NOT NULL DEFAULT 0,
  hot_rank integer,
  content_snippet text,
  image_url text,
  published_at timestamptz,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  fetched_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(platform_id, url, fetched_date)
);

-- 创建索引
CREATE INDEX idx_news_platform_id ON public.news(platform_id);
CREATE INDEX idx_news_final_score ON public.news(final_score DESC);
CREATE INDEX idx_news_fetched_at ON public.news(fetched_at DESC);
CREATE INDEX idx_news_hot_rank ON public.news(hot_rank);
CREATE INDEX idx_news_title_search ON public.news USING gin(to_tsvector('simple', title));

-- 创建用户收藏表
CREATE TABLE public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  news_id uuid NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, news_id)
);

CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_news_id ON public.user_favorites(news_id);

-- 创建用户关注平台表
CREATE TABLE public.user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform_id text NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform_id)
);

CREATE INDEX idx_user_follows_user_id ON public.user_follows(user_id);

-- 创建搜索历史表
CREATE TABLE public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  search_count integer NOT NULL DEFAULT 1,
  last_searched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_history_keyword ON public.search_history(keyword);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);

-- 创建用户同步触发器函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建 is_admin 辅助函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- 设置 RLS 策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- profiles 表策略
CREATE POLICY "管理员可以查看所有用户" ON public.profiles
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的资料" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的资料" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "管理员可以更新所有用户" ON public.profiles
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- platforms 表策略（所有人可读，管理员可写）
CREATE POLICY "所有人可以查看平台" ON public.platforms
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理平台" ON public.platforms
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- news 表策略（所有人可读）
CREATE POLICY "所有人可以查看新闻" ON public.news
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理新闻" ON public.news
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- user_favorites 表策略
CREATE POLICY "用户可以查看自己的收藏" ON public.user_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加收藏" ON public.user_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的收藏" ON public.user_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- user_follows 表策略
CREATE POLICY "用户可以查看自己的关注" ON public.user_follows
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加关注" ON public.user_follows
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以取消关注" ON public.user_follows
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- search_history 表策略
CREATE POLICY "用户可以查看自己的搜索历史" ON public.search_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "用户可以添加搜索历史" ON public.search_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "匿名用户可以添加搜索历史" ON public.search_history
  FOR INSERT TO anon WITH CHECK (user_id IS NULL);

-- 插入平台数据
INSERT INTO public.platforms (id, name, category, weight, enabled, description) VALUES
  ('weibo', '微博', 'social', 1.2, true, '新浪微博热搜榜'),
  ('zhihu', '知乎', 'social', 1.1, true, '知乎热榜'),
  ('douyin', '抖音', 'social', 1.0, true, '抖音热点'),
  ('douban', '豆瓣', 'social', 0.9, true, '豆瓣热门'),
  ('bilibili', '哔哩哔哩', 'social', 1.1, true, 'B站热门'),
  ('36kr', '36氪', 'tech', 1.0, true, '36氪科技资讯'),
  ('sspai', '少数派', 'tech', 0.9, true, '少数派科技文章'),
  ('juejin', '掘金', 'tech', 0.9, true, '掘金技术社区'),
  ('v2ex', 'V2EX', 'tech', 0.8, true, 'V2EX 技术社区'),
  ('github', 'GitHub Trending', 'tech', 1.0, true, 'GitHub 趋势项目'),
  ('stackoverflow', 'Stack Overflow', 'tech', 0.8, true, 'Stack Overflow 热门问题'),
  ('hackernews', 'Hacker News', 'tech', 1.0, true, 'Hacker News 热门'),
  ('52pojie', '吾爱破解', 'tech', 0.7, true, '吾爱破解论坛'),
  ('sina_finance', '新浪财经', 'finance', 1.0, true, '新浪财经要闻'),
  ('eastmoney', '东方财富', 'finance', 1.0, true, '东方财富资讯'),
  ('xueqiu', '雪球', 'finance', 0.9, true, '雪球热门'),
  ('cls', '财联社', 'finance', 1.1, true, '财联社快讯'),
  ('baidu', '百度', 'general', 1.2, true, '百度热搜'),
  ('toutiao', '今日头条', 'general', 1.1, true, '今日头条热点'),
  ('qq', '腾讯网', 'general', 1.0, true, '腾讯新闻'),
  ('hupu', '虎扑', 'other', 0.9, true, '虎扑热帖'),
  ('tieba', '百度贴吧', 'other', 0.8, true, '百度贴吧热门');

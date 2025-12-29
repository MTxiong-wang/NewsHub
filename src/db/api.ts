import { supabase } from './supabase';
import type {
  News,
  Platform,
  Profile,
  UserFavorite,
  UserFollow,
  SearchHistory,
  NewsQueryParams,
  PlatformCategory,
  Statistics,
} from '@/types';

// ==================== 平台相关 ====================

/**
 * 获取所有平台列表
 */
export async function getPlatforms(enabled?: boolean) {
  let query = supabase.from('platforms').select('*').order('name');
  
  if (enabled !== undefined) {
    query = query.eq('enabled', enabled);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return (data || []) as Platform[];
}

/**
 * 根据类别获取平台
 */
export async function getPlatformsByCategory(category: PlatformCategory) {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('category', category)
    .eq('enabled', true)
    .order('name');
  
  if (error) throw error;
  return (data || []) as Platform[];
}

/**
 * 获取单个平台信息
 */
export async function getPlatform(id: string) {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Platform | null;
}

/**
 * 更新平台配置（管理员）
 */
export async function updatePlatform(id: string, updates: Partial<Platform>) {
  const { data, error } = await supabase
    .from('platforms')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Platform | null;
}

// ==================== 新闻相关 ====================

/**
 * 获取新闻列表
 */
export async function getNews(params: NewsQueryParams = {}) {
  const {
    platform_id,
    category,
    keyword,
    sort = 'hot',
    limit = 20,
    offset = 0,
  } = params;
  
  let query = supabase
    .from('news')
    .select('*, platform:platforms!inner(*)');
  
  // 筛选条件
  if (platform_id) {
    query = query.eq('platform_id', platform_id);
  }
  
  if (category) {
    query = query.eq('platform.category', category);
  }
  
  if (keyword) {
    query = query.ilike('title', `%${keyword}%`);
  }
  
  // 排序
  if (sort === 'hot') {
    query = query.order('final_score', { ascending: false });
  } else {
    query = query.order('fetched_at', { ascending: false });
  }
  
  // 分页
  query = query.range(offset, offset + limit - 1);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return (data || []) as News[];
}

/**
 * 获取热门新闻（首页）
 */
export async function getHotNews(limit = 10) {
  const { data, error } = await supabase
    .from('news')
    .select('*, platform:platforms!inner(*)')
    .order('final_score', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as News[];
}

/**
 * 获取单条新闻详情
 */
export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*, platform:platforms!inner(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as News | null;
}

/**
 * 搜索新闻
 */
export async function searchNews(keyword: string, limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('news')
    .select('*, platform:platforms!inner(*)')
    .textSearch('title', keyword, { type: 'plain' })
    .order('final_score', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return (data || []) as News[];
}

/**
 * 获取相关新闻推荐
 */
export async function getRelatedNews(newsId: string, platformId: string, limit = 5) {
  const { data, error } = await supabase
    .from('news')
    .select('*, platform:platforms!inner(*)')
    .eq('platform_id', platformId)
    .neq('id', newsId)
    .order('final_score', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as News[];
}

// ==================== 用户收藏相关 ====================

/**
 * 获取用户收藏列表
 */
export async function getUserFavorites(userId: string, limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('*, news:news!inner(*, platform:platforms!inner(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return (data || []) as UserFavorite[];
}

/**
 * 检查是否已收藏
 */
export async function checkFavorite(userId: string, newsId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('news_id', newsId)
    .maybeSingle();
  
  if (error) throw error;
  return !!data;
}

/**
 * 添加收藏
 */
export async function addFavorite(userId: string, newsId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, news_id: newsId })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserFavorite | null;
}

/**
 * 取消收藏
 */
export async function removeFavorite(userId: string, newsId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('news_id', newsId);
  
  if (error) throw error;
}

// ==================== 用户关注平台相关 ====================

/**
 * 获取用户关注的平台
 */
export async function getUserFollows(userId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select('*, platform:platforms!inner(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as UserFollow[];
}

/**
 * 检查是否已关注平台
 */
export async function checkFollow(userId: string, platformId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('user_id', userId)
    .eq('platform_id', platformId)
    .maybeSingle();
  
  if (error) throw error;
  return !!data;
}

/**
 * 关注平台
 */
export async function followPlatform(userId: string, platformId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .insert({ user_id: userId, platform_id: platformId })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as UserFollow | null;
}

/**
 * 取消关注平台
 */
export async function unfollowPlatform(userId: string, platformId: string) {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('user_id', userId)
    .eq('platform_id', platformId);
  
  if (error) throw error;
}

// ==================== 搜索历史相关 ====================

/**
 * 添加搜索历史
 */
export async function addSearchHistory(keyword: string, userId?: string) {
  // 检查是否已存在
  let query = supabase
    .from('search_history')
    .select('id, search_count')
    .eq('keyword', keyword);
  
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    query = query.is('user_id', null);
  }
  
  const { data: existing } = await query.maybeSingle();
  
  if (existing) {
    // 更新计数
    const { error } = await supabase
      .from('search_history')
      .update({
        search_count: existing.search_count + 1,
        last_searched_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    
    if (error) throw error;
  } else {
    // 新增记录
    const { error } = await supabase
      .from('search_history')
      .insert({
        keyword,
        user_id: userId || null,
        search_count: 1,
      });
    
    if (error) throw error;
  }
}

/**
 * 获取热门搜索词
 */
export async function getHotSearchKeywords(limit = 10) {
  const { data, error } = await supabase
    .from('search_history')
    .select('keyword, search_count')
    .order('search_count', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as SearchHistory[];
}

/**
 * 获取用户搜索历史
 */
export async function getUserSearchHistory(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('last_searched_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return (data || []) as SearchHistory[];
}

// ==================== 用户相关 ====================

/**
 * 获取用户信息
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data as Profile | null;
}

/**
 * 更新用户信息
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Profile | null;
}

/**
 * 获取所有用户（管理员）
 */
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Profile[];
}

// ==================== 统计相关 ====================

/**
 * 获取统计数据（管理员）
 */
export async function getStatistics(): Promise<Statistics> {
  // 获取新闻总数
  const { count: newsCount } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true });
  
  // 获取平台总数
  const { count: platformCount } = await supabase
    .from('platforms')
    .select('*', { count: 'exact', head: true });
  
  // 获取用户总数
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  // 获取各类别新闻数量
  const { data: categoryData } = await supabase
    .from('news')
    .select('platform_id, platforms!inner(category)')
    .limit(10000);
  
  const newsByCategory: Record<PlatformCategory, number> = {
    social: 0,
    tech: 0,
    finance: 0,
    general: 0,
    other: 0,
  };
  
  categoryData?.forEach((item: any) => {
    const category = item.platforms?.category;
    if (category && category in newsByCategory) {
      newsByCategory[category as PlatformCategory]++;
    }
  });
  
  // 获取热门平台
  const { data: platformStats } = await supabase
    .from('news')
    .select('platform_id')
    .limit(10000);
  
  const platformCounts: Record<string, number> = {};
  platformStats?.forEach((item) => {
    platformCounts[item.platform_id] = (platformCounts[item.platform_id] || 0) + 1;
  });
  
  const topPlatforms = Object.entries(platformCounts)
    .map(([platform_id, count]) => ({ platform_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    total_news: newsCount || 0,
    total_platforms: platformCount || 0,
    total_users: userCount || 0,
    news_by_category: newsByCategory,
    top_platforms: topPlatforms,
  };
}

// 系统配置相关
export async function getSystemConfig(key: string): Promise<string | null> {
  const { data } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  return data?.value || null;
}

export async function getAllSystemConfigs(): Promise<Record<string, any>[]> {
  const { data } = await supabase
    .from('system_config')
    .select('*')
    .order('key');

  return data || [];
}

export async function updateSystemConfig(key: string, value: string): Promise<void> {
  await supabase
    .from('system_config')
    .update({ value })
    .eq('key', key);
}

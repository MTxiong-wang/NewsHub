export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// 用户角色
export type UserRole = 'user' | 'admin';

// 平台类别
export type PlatformCategory = 'social' | 'tech' | 'finance' | 'general' | 'other';

// 用户配置（本地版本）
export interface Profile {
  id: string;
  username: string;
  preferences?: Record<string, any>;
}

// 平台配置
export interface Platform {
  id: string;
  name: string;
  category: PlatformCategory;
  weight: number;
  enabled: boolean;
  icon_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 新闻
export interface News {
  id: string;
  platform_id: string;
  title: string;
  url: string;
  api_score: number;
  final_score: number;
  hot_rank: number | null;
  content_snippet: string | null;
  image_url: string | null;
  published_at: string | null;
  fetched_at: string;
  fetched_date: string;
  created_at: string;
  platform?: Platform;
  is_favorited?: boolean;
}

// 用户收藏
export interface UserFavorite {
  id: string;
  user_id: string;
  news_id: string;
  created_at: string;
  news?: News;
}

// 用户关注
export interface UserFollow {
  id: string;
  user_id: string;
  platform_id: string;
  created_at: string;
  platform?: Platform;
}

// 搜索历史
export interface SearchHistory {
  id: string;
  user_id: string | null;
  keyword: string;
  search_count: number;
  last_searched_at: string;
  created_at: string;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
}

// 新闻查询参数
export interface NewsQueryParams extends PaginationParams {
  platform_id?: string;
  category?: PlatformCategory;
  keyword?: string;
  sort?: 'hot' | 'time';
}

// 统计数据
export interface Statistics {
  total_news: number;
  total_platforms: number;
  total_users: number;
  news_by_category: Record<PlatformCategory, number>;
  top_platforms: Array<{ platform_id: string; count: number }>;
}

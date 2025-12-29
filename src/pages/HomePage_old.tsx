import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNews, getPlatforms } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { News, Platform } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [newsByPlatform, setNewsByPlatform] = useState<Record<string, News[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoFetching, setAutoFetching] = useState(false);
  const { toast } = useToast();

  const platformId = searchParams.get('platform');
  const category = searchParams.get('category');

  // 从 localStorage 获取用户偏好的平台列表
  const getPreferredPlatforms = useCallback(() => {
    try {
      const stored = localStorage.getItem('preferred_platforms');
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch (error) {
      console.error('读取偏好平台失败:', error);
    }
    return null;
  }, []);

  const loadPlatforms = useCallback(async () => {
    try {
      const allPlatforms = await getPlatforms(true);
      const preferredIds = getPreferredPlatforms();
      
      // 如果有分类筛选，按分类过滤
      let filteredPlatforms = allPlatforms;
      if (category) {
        filteredPlatforms = allPlatforms.filter(p => p.category === category);
      }
      
      // 如果用户有偏好设置，按偏好排序
      if (preferredIds && preferredIds.length > 0 && !category) {
        // 按照 preferredIds 的顺序排列平台
        const orderedPlatforms = preferredIds
          .map(id => filteredPlatforms.find(p => p.id === id))
          .filter(Boolean) as Platform[];
        setPlatforms(orderedPlatforms);
      } else {
        setPlatforms(filteredPlatforms);
      }
    } catch (error) {
      console.error('加载平台失败:', error);
    }
  }, [getPreferredPlatforms, category]);

  const loadNewsByPlatform = useCallback(async () => {
    try {
      setLoading(true);
      
      // 加载平台列表
      await loadPlatforms();
      
      // 获取所有平台
      const allPlatforms = await getPlatforms(true);
      const preferredIds = getPreferredPlatforms();
      const platformsToShow = preferredIds && preferredIds.length > 0
        ? allPlatforms.filter(p => preferredIds.includes(p.id))
        : allPlatforms;

      // 为每个平台获取新闻（默认20条）
      const newsData: Record<string, News[]> = {};
      
      for (const platform of platformsToShow) {
        try {
          const news = await getNews({
            platform_id: platform.id,
            sort: 'hot',
            limit: 20,
            offset: 0,
          });
          newsData[platform.id] = news;
        } catch (error) {
          console.error(`加载 ${platform.name} 新闻失败:`, error);
          newsData[platform.id] = [];
        }
      }
      
      setNewsByPlatform(newsData);
      
      // 检查是否有新闻数据，如果没有则自动获取
      const hasNews = Object.values(newsData).some(news => news.length > 0);
      if (!hasNews && !autoFetching) {
        setAutoFetching(true);
        await handleAutoFetchNews();
      }
    } catch (error) {
      console.error('加载新闻失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载新闻列表',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [loadPlatforms, getPreferredPlatforms, autoFetching, toast]);

  const handleAutoFetchNews = async () => {
    try {
      toast({
        title: '正在获取新闻',
        description: '首次加载，正在从各平台获取最新新闻...',
      });
      
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('自动获取新闻失败:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message || '获取失败');
      }

      toast({
        title: '获取成功',
        description: '新闻数据已更新',
      });
      
      // 重新加载新闻
      await loadNewsByPlatform();
    } catch (error: any) {
      console.error('自动获取新闻失败:', error);
      toast({
        title: '获取失败',
        description: error.message || '无法获取新闻数据，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setAutoFetching(false);
    }
  };

  const handleRefreshNews = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('刷新新闻失败:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message || '刷新失败');
      }

      toast({
        title: '刷新成功',
        description: '新闻数据已更新',
      });
      
      await loadNewsByPlatform();
    } catch (error: any) {
      console.error('刷新新闻失败:', error);
      toast({
        title: '刷新失败',
        description: error.message || '无法刷新新闻数据',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNewsByPlatform();
  }, []);

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      loadNewsByPlatform();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('preferred_platforms_changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferred_platforms_changed', handleStorageChange);
    };
  }, [loadNewsByPlatform]);

  // 当分类变化时，触发该分类的新闻拉取
  useEffect(() => {
    if (category) {
      handleFetchCategoryNews();
    } else if (!platformId) {
      // 如果没有分类也没有平台ID，说明是"全部热点"，触发全部新闻获取
      handleFetchAllNews();
    }
  }, [category, platformId]);

  const handleFetchAllNews = async () => {
    try {
      setRefreshing(true);
      toast({
        title: '正在获取新闻',
        description: '正在从所有平台拉取最新热点...',
      });

      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: JSON.stringify({}), // 不传参数，获取所有平台
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('获取新闻失败:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message);
      }

      toast({
        title: '获取成功',
        description: data.message || '新闻已更新',
      });

      // 重新加载新闻
      await loadNewsByPlatform();
    } catch (error) {
      console.error('获取新闻失败:', error);
      toast({
        title: '获取失败',
        description: error instanceof Error ? error.message : '无法获取新闻，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleFetchCategoryNews = async () => {
    try {
      setRefreshing(true);
      toast({
        title: '正在获取新闻',
        description: '正在从各平台拉取最新热点...',
      });

      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: JSON.stringify({ category }),
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('获取新闻失败:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message);
      }

      toast({
        title: '获取成功',
        description: data.message || '新闻已更新',
      });

      // 重新加载新闻
      await loadNewsByPlatform();
    } catch (error) {
      console.error('获取新闻失败:', error);
      toast({
        title: '获取失败',
        description: error instanceof Error ? error.message : '无法获取新闻，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl py-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">全部热点</h1>
            <p className="text-muted-foreground mt-1">
              实时聚合主流平台热点新闻
            </p>
          </div>
          <Button onClick={handleRefreshNews} disabled={refreshing || autoFetching}>
            {(refreshing || autoFetching) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {autoFetching ? '正在获取...' : '刷新新闻'}
          </Button>
        </div>

        {/* 新闻卡片列表 */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 w-full bg-muted" />
            ))}
          </div>
        ) : platforms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无可用平台</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => {
              const news = newsByPlatform[platform.id] || [];
              
              return (
                <Card key={platform.id} className="flex flex-col h-[400px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden">
                    {news.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        暂无新闻
                      </p>
                    ) : (
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-3">
                          {news.map((item, index) => (
                            <a
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm font-bold text-primary shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <p className="text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                  {item.title}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

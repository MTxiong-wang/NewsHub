import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlatforms } from '@/db/api';
import { fetchMultiplePlatformsNews, type NewsItem } from '@/services/newsApi';
import type { Platform } from '@/types';
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
  const [newsByPlatform, setNewsByPlatform] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  // 加载平台列表
  const loadPlatforms = useCallback(async () => {
    try {
      const allPlatforms = await getPlatforms(true);
      const preferredIds = getPreferredPlatforms();
      
      // 如果有分类筛选，按分类过滤
      let filteredPlatforms = allPlatforms;
      if (category) {
        filteredPlatforms = allPlatforms.filter(p => p.category === category);
      }
      
      // 如果用户有偏好设置，只显示选中的平台并按偏好排序
      if (preferredIds && preferredIds.length > 0) {
        // 只保留用户选中的平台
        filteredPlatforms = filteredPlatforms.filter(p => preferredIds.includes(p.id));
        
        // 按用户设置的顺序排序
        filteredPlatforms.sort((a, b) => {
          const aIndex = preferredIds.indexOf(a.id);
          const bIndex = preferredIds.indexOf(b.id);
          return aIndex - bIndex;
        });
      }
      
      setPlatforms(filteredPlatforms);
      return filteredPlatforms;
    } catch (error) {
      console.error('加载平台失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载平台列表',
        variant: 'destructive',
      });
      return [];
    }
  }, [category, getPreferredPlatforms, toast]);

  // 加载新闻数据
  const loadNews = useCallback(async (platformsToLoad: Platform[]) => {
    try {
      setRefreshing(true);
      
      const platformIds = platformsToLoad.map(p => p.id);
      const newsData = await fetchMultiplePlatformsNews(platformIds, 20);
      
      setNewsByPlatform(newsData);
      
      // 统计成功和失败的平台数量
      const successCount = Object.values(newsData).filter(news => news.length > 0).length;
      const failedCount = platformIds.length - successCount;
      
      if (failedCount > 0) {
        toast({
          title: '部分平台获取失败',
          description: `成功: ${successCount} 个，失败: ${failedCount} 个`,
          variant: 'default',
        });
      } else {
        toast({
          title: '刷新成功',
          description: `已获取 ${successCount} 个平台的最新新闻`,
        });
      }
    } catch (error) {
      console.error('加载新闻失败:', error);
      toast({
        title: '加载失败',
        description: '无法获取新闻数据',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  // 初始化加载
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const loadedPlatforms = await loadPlatforms();
      if (loadedPlatforms.length > 0) {
        await loadNews(loadedPlatforms);
      }
      setLoading(false);
    };
    
    init();
  }, [loadPlatforms, loadNews]);

  // 监听平台偏好变化
  useEffect(() => {
    const handlePreferencesChanged = async () => {
      console.log('检测到平台偏好变化，重新加载...');
      const loadedPlatforms = await loadPlatforms();
      if (loadedPlatforms.length > 0) {
        await loadNews(loadedPlatforms);
      }
    };

    window.addEventListener('preferred_platforms_changed', handlePreferencesChanged);
    
    return () => {
      window.removeEventListener('preferred_platforms_changed', handlePreferencesChanged);
    };
  }, [loadPlatforms, loadNews]);

  // 手动刷新
  const handleRefresh = async () => {
    if (platforms.length > 0) {
      await loadNews(platforms);
    }
  };

  // 渲染加载骨架屏
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-[400px]">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 新闻卡片组件（独立组件以支持 useState）
  const NewsCard = ({ platform }: { platform: Platform }) => {
    const news = newsByPlatform[platform.id] || [];

    return (
      <Card className="flex flex-col h-[400px]">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span>{platform.name}</span>
            {news.length === 0 && !refreshing && (
              <span className="text-sm text-muted-foreground">暂无新闻</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          {refreshing ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : news.length > 0 ? (
            <ScrollArea className="h-full px-6" type="always">
              <div className="space-y-3 py-2 pr-4">
                {news.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-2 hover:bg-accent/50 p-2 rounded-md transition-colors">
                      <span className="text-sm font-medium text-muted-foreground shrink-0 w-6">
                        {item.hot_rank || index + 1}
                      </span>
                      <p className="text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              暂无新闻
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {category ? getCategoryName(category) : '全部热点'}
            </h1>
            <p className="text-muted-foreground mt-1">
              实时聚合主流平台热点新闻
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            size="lg"
          >
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                刷新中
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                刷新新闻
              </>
            )}
          </Button>
        </div>

        {/* 新闻列表 */}
        {loading ? (
          renderSkeleton()
        ) : platforms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无平台数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <NewsCard key={platform.id} platform={platform} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// 获取分类名称
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    social: '社交媒体',
    tech: '科技媒体',
    finance: '财经媒体',
    general: '综合媒体',
    other: '其他',
  };
  return names[category] || '全部热点';
}

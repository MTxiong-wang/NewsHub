import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getNews, getPlatforms } from '@/db/api';
import type { News, PlatformCategory } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import NewsCard from '@/components/news/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlatformDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'hot' | 'time'>('hot');
  const [platformName, setPlatformName] = useState('');
  const { toast } = useToast();

  const platformId = searchParams.get('platform');
  const category = searchParams.get('category') as PlatformCategory | null;

  useEffect(() => {
    if (platformId) {
      loadPlatformName();
    }
    loadNews(true);
  }, [platformId, category, sortBy]);

  const loadPlatformName = async () => {
    if (!platformId) return;
    try {
      const platforms = await getPlatforms();
      const platform = platforms.find(p => p.id === platformId);
      if (platform) {
        setPlatformName(platform.name);
      }
    } catch (error) {
      console.error('加载平台信息失败:', error);
    }
  };

  const loadNews = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const offset = reset ? 0 : newsList.length;
      const data = await getNews({
        platform_id: platformId || undefined,
        category: category || undefined,
        sort: sortBy,
        limit: 20,
        offset,
      });

      if (reset) {
        setNewsList(data);
      } else {
        setNewsList((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
    } catch (error) {
      console.error('加载新闻失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载新闻列表',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [platformId, category, sortBy, newsList.length, toast]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadNews(false);
    }
  };

  const getPageTitle = () => {
    if (platformId && platformName) {
      return `${platformName} 热点`;
    }
    if (category) {
      const categoryNames: Record<PlatformCategory, string> = {
        social: '社交媒体',
        tech: '科技媒体',
        finance: '财经媒体',
        general: '综合媒体',
        other: '其他',
      };
      return categoryNames[category];
    }
    return '新闻列表';
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold gradient-text">{getPageTitle()}</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? '加载中...' : `共 ${newsList.length} 条新闻`}
            </p>
          </div>
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'hot' | 'time')}>
            <TabsList>
              <TabsTrigger value="hot">
                <TrendingUp className="w-4 h-4 mr-2" />
                热度
              </TabsTrigger>
              <TabsTrigger value="time">最新</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 新闻列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-muted" />
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无新闻</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {newsList.map((news) => (
                <NewsCard key={news.id} news={news} onFavoriteChange={() => loadNews(true)} />
              ))}
            </div>

            {/* 加载更多 */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingMore ? '加载中...' : '加载更多'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

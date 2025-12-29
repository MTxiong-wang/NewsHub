import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchNews, addSearchHistory, getHotSearchKeywords } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { News, SearchHistory } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import NewsCard from '@/components/news/NewsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [newsList, setNewsList] = useState<News[]>([]);
  const [hotKeywords, setHotKeywords] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadHotKeywords();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setKeyword(q);
      performSearch(q, true);
    }
  }, [searchParams]);

  const loadHotKeywords = async () => {
    try {
      const data = await getHotSearchKeywords(10);
      setHotKeywords(data);
    } catch (error) {
      console.error('加载热门搜索失败:', error);
    }
  };

  const performSearch = async (searchKeyword: string, reset = false) => {
    if (!searchKeyword.trim()) {
      return;
    }

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const offset = reset ? 0 : newsList.length;
      const data = await searchNews(searchKeyword, 20, offset);

      if (reset) {
        setNewsList(data);
        // 添加搜索历史
        await addSearchHistory(searchKeyword, user?.id);
      } else {
        setNewsList((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
    } catch (error) {
      console.error('搜索失败:', error);
      toast({
        title: '搜索失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ q: keyword.trim() });
    }
  };

  const handleHotKeywordClick = (hotKeyword: string) => {
    setKeyword(hotKeyword);
    setSearchParams({ q: hotKeyword });
  };

  const handleLoadMore = () => {
    const q = searchParams.get('q');
    if (q && !loadingMore && hasMore) {
      performSearch(q, false);
    }
  };

  const currentQuery = searchParams.get('q');

  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* 搜索框 */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold gradient-text">搜索新闻</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索新闻标题..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={!keyword.trim() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              搜索
            </Button>
          </form>
        </div>

        {/* 热门搜索 */}
        {!currentQuery && hotKeywords.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">热门搜索</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotKeywords.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleHotKeywordClick(item.keyword)}
                >
                  {item.keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {currentQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                搜索结果：{currentQuery}
              </h2>
              {!loading && (
                <span className="text-sm text-muted-foreground">
                  共 {newsList.length} 条结果
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-32 w-full bg-muted" />
                ))}
              </div>
            ) : newsList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">未找到相关新闻</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {newsList.map((news) => (
                    <NewsCard key={news.id} news={news} />
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
        )}
      </div>
    </MainLayout>
  );
}

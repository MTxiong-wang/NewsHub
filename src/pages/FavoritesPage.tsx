import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserFavorites } from '@/db/api';
import type { UserFavorite } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import NewsCard from '@/components/news/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites(true);
  }, [user]);

  const loadFavorites = async (reset = false) => {
    if (!user) return;

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const offset = reset ? 0 : favorites.length;
      const data = await getUserFavorites(user.id, 20, offset);

      if (reset) {
        setFavorites(data);
      } else {
        setFavorites((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFavorites(false);
    }
  };

  const handleFavoriteChange = () => {
    loadFavorites(true);
  };

  if (!user) {
    return null;
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">我的收藏</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? '加载中...' : `共 ${favorites.length} 条收藏`}
            </p>
          </div>
        </div>

        {/* 收藏列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-muted" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">还没有收藏任何新闻</p>
            <Button onClick={() => navigate('/')}>去首页看看</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {favorites.map((favorite) =>
                favorite.news ? (
                  <NewsCard
                    key={favorite.id}
                    news={{ ...favorite.news, is_favorited: true }}
                    onFavoriteChange={handleFavoriteChange}
                  />
                ) : null
              )}
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

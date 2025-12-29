import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { addFavorite, removeFavorite } from '@/db/api';
import type { News } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  news: News;
  onFavoriteChange?: () => void;
}

export default function NewsCard({ news, onFavoriteChange }: NewsCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(news.is_favorited || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: '请先登录',
        description: '登录后才能收藏新闻',
        variant: 'destructive',
      });
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isFavorited) {
        await removeFavorite(user.id, news.id);
        setIsFavorited(false);
        toast({
          title: '已取消收藏',
        });
      } else {
        await addFavorite(user.id, news.id);
        setIsFavorited(true);
        toast({
          title: '收藏成功',
        });
      }
      onFavoriteChange?.();
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const formatScore = (score: number) => {
    if (score >= 10000) {
      return `${(score / 10000).toFixed(1)}万`;
    }
    return score.toFixed(0);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* 平台标签和热度 */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {news.platform?.name}
              </Badge>
              {news.hot_rank && news.hot_rank <= 10 && (
                <Badge variant="default" className="text-xs bg-chart-1 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  TOP {news.hot_rank}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                热度: {formatScore(news.final_score)}
              </span>
            </div>

            {/* 标题 */}
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group-hover:text-primary transition-colors"
            >
              <h3 className="text-base font-medium line-clamp-2 mb-2">
                {news.title}
              </h3>
            </a>

            {/* 摘要 */}
            {news.content_snippet && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {news.content_snippet}
              </p>
            )}

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(news.fetched_at).toLocaleString('zh-CN', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 px-2',
                    isFavorited && 'text-red-500 hover:text-red-600'
                  )}
                  onClick={handleFavoriteToggle}
                  disabled={isTogglingFavorite}
                >
                  <Heart
                    className={cn('w-4 h-4', isFavorited && 'fill-current')}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  asChild
                >
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* 图片 */}
          {news.image_url && (
            <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

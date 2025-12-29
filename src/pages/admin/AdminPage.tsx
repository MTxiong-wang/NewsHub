import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getStatistics } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Statistics } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Users, TrendingUp, Settings, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!profile) return;
    if (profile.role !== 'admin') {
      navigate('/');
      toast({
        title: '权限不足',
        description: '您没有访问管理后台的权限',
        variant: 'destructive',
      });
      return;
    }
    loadStatistics();
  }, [profile]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载统计数据',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshNews = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      
      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('调用 Edge Function 失败:', errorMsg || error?.message);
        throw new Error(errorMsg || error?.message || '调用失败');
      }

      toast({
        title: '刷新成功',
        description: `成功获取新闻数据`,
      });
      
      // 重新加载统计数据
      await loadStatistics();
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

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  const categoryNames = {
    social: '社交媒体',
    tech: '科技媒体',
    finance: '财经媒体',
    general: '综合媒体',
    other: '其他',
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-6xl py-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">管理后台</h1>
            <p className="text-muted-foreground mt-1">系统数据统计与管理</p>
          </div>
          <Button onClick={handleRefreshNews} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            刷新新闻数据
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 bg-muted" />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* 统计卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">新闻总数</CardTitle>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_news}</div>
                  <p className="text-xs text-muted-foreground">聚合新闻数量</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">平台数量</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_platforms}</div>
                  <p className="text-xs text-muted-foreground">接入平台总数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">用户数量</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_users}</div>
                  <p className="text-xs text-muted-foreground">注册用户总数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">正常</div>
                  <p className="text-xs text-muted-foreground">所有服务运行中</p>
                </CardContent>
              </Card>
            </div>

            {/* 详细统计 */}
            <Tabs defaultValue="category" className="space-y-4">
              <TabsList>
                <TabsTrigger value="category">分类统计</TabsTrigger>
                <TabsTrigger value="platform">平台统计</TabsTrigger>
              </TabsList>

              <TabsContent value="category" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>各类别新闻数量</CardTitle>
                    <CardDescription>按平台类别统计的新闻分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(stats.news_by_category).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {categoryNames[category as keyof typeof categoryNames]}
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="w-64 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${(count / stats.total_news) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-16 text-right">
                              {count} 条
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="platform" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>热门平台 TOP 10</CardTitle>
                    <CardDescription>新闻数量最多的平台</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.top_platforms.map((platform, index) => (
                        <div key={platform.platform_id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-primary w-6">
                              {index + 1}
                            </span>
                            <span className="text-sm font-medium">{platform.platform_id}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-48 bg-muted rounded-full h-2">
                              <div
                                className="bg-chart-1 h-2 rounded-full"
                                style={{
                                  width: `${(platform.count / stats.top_platforms[0].count) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-16 text-right">
                              {platform.count} 条
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* 快捷操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
                <CardDescription>常用管理功能</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/platforms')}>
                  <Settings className="mr-2 h-4 w-4" />
                  平台管理
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/users')}>
                  <Users className="mr-2 h-4 w-4" />
                  用户管理
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/config')}>
                  <Settings className="mr-2 h-4 w-4" />
                  系统配置
                </Button>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}

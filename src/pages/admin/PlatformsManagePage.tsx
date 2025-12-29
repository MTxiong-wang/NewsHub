import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPlatforms, updatePlatform } from '@/db/api';
import type { Platform } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlatformsManagePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    if (profile.role !== 'admin') {
      navigate('/');
      return;
    }
    loadPlatforms();
  }, [profile]);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const data = await getPlatforms();
      // 按启用状态排序：启用的在前，禁用的在后
      const sorted = data.sort((a, b) => {
        if (a.enabled === b.enabled) return 0;
        return a.enabled ? -1 : 1;
      });
      setPlatforms(sorted);
    } catch (error) {
      console.error('加载平台失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载平台列表',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (platform: Platform) => {
    try {
      await updatePlatform(platform.id, { enabled: !platform.enabled });
      toast({
        title: '更新成功',
        description: `${platform.name} 已${!platform.enabled ? '启用' : '禁用'}`,
      });
      loadPlatforms();
    } catch (error) {
      console.error('更新平台失败:', error);
      toast({
        title: '更新失败',
        description: '无法更新平台状态',
        variant: 'destructive',
      });
    }
  };

  const handleEditWeight = (platform: Platform) => {
    setEditingPlatform(platform);
    setEditWeight(platform.weight.toString());
  };

  const handleSaveWeight = async () => {
    if (!editingPlatform) return;

    const weight = parseFloat(editWeight);
    if (isNaN(weight) || weight < 0 || weight > 10) {
      toast({
        title: '输入错误',
        description: '权重必须是 0-10 之间的数字',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      await updatePlatform(editingPlatform.id, { weight });
      toast({
        title: '更新成功',
        description: `${editingPlatform.name} 权重已更新`,
      });
      setEditingPlatform(null);
      loadPlatforms();
    } catch (error) {
      console.error('更新权重失败:', error);
      toast({
        title: '更新失败',
        description: '无法更新平台权重',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">平台管理</h1>
            <p className="text-muted-foreground mt-1">管理新闻来源平台配置</p>
          </div>
        </div>

        {/* 平台列表 */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-muted" />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>平台列表</CardTitle>
              <CardDescription>共 {platforms.length} 个平台</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{platform.name}</h3>
                        <Badge variant="secondary">
                          {categoryNames[platform.category]}
                        </Badge>
                        <Badge variant={platform.enabled ? 'default' : 'outline'}>
                          {platform.enabled ? '已启用' : '已禁用'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ID: {platform.id}</span>
                        <span>权重: {platform.weight}</span>
                        {platform.description && <span>{platform.description}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWeight(platform)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        编辑权重
                      </Button>
                      <Switch
                        checked={platform.enabled}
                        onCheckedChange={() => handleToggleEnabled(platform)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 编辑权重对话框 */}
        <Dialog open={!!editingPlatform} onOpenChange={() => setEditingPlatform(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑平台权重</DialogTitle>
              <DialogDescription>
                调整 {editingPlatform?.name} 的权重值（0-10）
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="weight">权重</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  placeholder="输入权重值"
                />
                <p className="text-xs text-muted-foreground">
                  权重越高，该平台的新闻在热度排序中越靠前
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPlatform(null)}>
                取消
              </Button>
              <Button onClick={handleSaveWeight} disabled={saving}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

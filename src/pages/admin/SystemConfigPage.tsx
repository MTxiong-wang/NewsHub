import { useEffect, useState } from 'react';
import { getAllSystemConfigs, updateSystemConfig } from '@/db/api';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
}

export default function SystemConfigPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await getAllSystemConfigs();
      setConfigs(data as SystemConfig[]);
    } catch (error) {
      console.error('加载配置失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载系统配置',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setConfigs(prev =>
      prev.map(config =>
        config.key === key ? { ...config, value } : config
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 更新所有配置
      for (const config of configs) {
        await updateSystemConfig(config.key, config.value);
      }

      toast({
        title: '保存成功',
        description: '系统配置已更新',
      });
    } catch (error) {
      console.error('保存配置失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存系统配置',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="container max-w-4xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">系统配置</h1>
          <p className="text-muted-foreground mt-2">
            管理系统全局配置参数
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>配置项</CardTitle>
              <CardDescription>
                修改以下配置项以调整系统行为
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {configs.map((config) => (
                <div key={config.key} className="space-y-2">
                  <Label htmlFor={config.key}>
                    {config.description || config.key}
                  </Label>
                  <Input
                    id={config.key}
                    type="number"
                    value={config.value}
                    onChange={(e) => handleValueChange(config.key, e.target.value)}
                    placeholder="请输入配置值"
                  />
                  <p className="text-xs text-muted-foreground">
                    配置键: {config.key}
                  </p>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

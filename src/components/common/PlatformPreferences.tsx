import { useEffect, useState } from 'react';
import { getPlatforms } from '@/db/api';
import type { Platform, PlatformCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Check, GripVertical } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_NAMES: Record<PlatformCategory, string> = {
  social: '社交媒体',
  tech: '科技媒体',
  finance: '财经媒体',
  general: '综合媒体',
  other: '其他',
};

export default function PlatformPreferences() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatforms();
    loadPreferences();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const data = await getPlatforms(true);
      setPlatforms(data);
    } catch (error) {
      console.error('加载平台失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem('preferred_platforms');
      if (stored) {
        setSelectedIds(JSON.parse(stored));
      } else {
        // 默认全选
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('读取偏好失败:', error);
    }
  };

  const handleToggle = (platformId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((id) => id !== platformId);
      }
      return [...prev, platformId];
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(platforms.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newSelectedIds = [...selectedIds];
    const draggedId = newSelectedIds[draggedIndex];
    
    // 移除拖拽的元素
    newSelectedIds.splice(draggedIndex, 1);
    // 插入到新位置
    newSelectedIds.splice(index, 0, draggedId);
    
    setSelectedIds(newSelectedIds);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    try {
      if (selectedIds.length === 0) {
        // 如果没有选择任何平台，清除偏好设置（显示全部）
        localStorage.removeItem('preferred_platforms');
      } else {
        localStorage.setItem('preferred_platforms', JSON.stringify(selectedIds));
      }
      
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new Event('preferred_platforms_changed'));
      
      toast({
        title: '保存成功',
        description: '站点偏好已更新',
      });
      
      setOpen(false);
    } catch (error) {
      console.error('保存偏好失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存站点偏好',
        variant: 'destructive',
      });
    }
  };

  // 按类别分组
  const platformsByCategory = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<PlatformCategory, Platform[]>);

  // 获取已选择的平台（按用户排序）
  const selectedPlatforms = selectedIds
    .map(id => platforms.find(p => p.id === id))
    .filter(Boolean) as Platform[];

  // 获取未选择的平台（按类别分组）
  const unselectedPlatformsByCategory = Object.entries(platformsByCategory).reduce((acc, [category, categoryPlatforms]) => {
    const unselected = categoryPlatforms.filter(p => !selectedIds.includes(p.id));
    if (unselected.length > 0) {
      acc[category as PlatformCategory] = unselected;
    }
    return acc;
  }, {} as Record<PlatformCategory, Platform[]>);

  const selectedCount = selectedIds.length;
  const totalCount = platforms.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          管理站点
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>管理站点偏好</SheetTitle>
          <SheetDescription>
            选择并排序您想要在首页显示的新闻平台
            {selectedCount > 0 && ` (已选 ${selectedCount}/${totalCount})`}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* 快捷操作 */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              全选
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              清空
            </Button>
          </div>

          {/* 平台列表 */}
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full bg-muted" />
                ))}
              </div>
            ) : (
              <div className="space-y-6 pr-4">
                {/* 已选择的平台（可拖拽排序） */}
                {selectedPlatforms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-primary">
                      已选择（拖动调整顺序）
                    </h3>
                    <div className="space-y-2">
                      {selectedPlatforms.map((platform, index) => (
                        <div
                          key={platform.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-move transition-all ${
                            draggedIndex === index ? 'opacity-50 scale-95' : ''
                          }`}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Checkbox
                            checked={true}
                            onCheckedChange={() => handleToggle(platform.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{platform.name}</p>
                            {platform.description && (
                              <p className="text-xs text-muted-foreground">
                                {platform.description}
                              </p>
                            )}
                          </div>
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 未选择的平台（按类别分组） */}
                {Object.entries(unselectedPlatformsByCategory).map(([category, categoryPlatforms]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-3">
                      {CATEGORY_NAMES[category as PlatformCategory]}
                    </h3>
                    <div className="space-y-2">
                      {categoryPlatforms.map((platform) => (
                        <div
                          key={platform.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                          onClick={() => handleToggle(platform.id)}
                        >
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => handleToggle(platform.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{platform.name}</p>
                            {platform.description && (
                              <p className="text-xs text-muted-foreground">
                                {platform.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} className="w-full">
            保存设置
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

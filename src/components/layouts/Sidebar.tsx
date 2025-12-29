import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type PlatformCategory = 'social' | 'tech' | 'finance' | 'general' | 'other';

const CATEGORY_NAMES: Record<PlatformCategory, string> = {
  social: '社交媒体',
  tech: '科技媒体',
  finance: '财经媒体',
  general: '综合媒体',
  other: '其他',
};

const CATEGORY_ICONS: Record<PlatformCategory, string> = {
  social: '💬',
  tech: '💻',
  finance: '💰',
  general: '📰',
  other: '🔖',
};

const CATEGORIES: PlatformCategory[] = ['social', 'tech', 'finance', 'general', 'other'];

export default function Sidebar() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  return (
    <aside className="w-64 border-r bg-muted/10 shrink-0 hidden lg:block">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-2">
          {/* 全部新闻 */}
          <Link
            to="/"
            className={cn(
              'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            🔥 全部热点
          </Link>

          {/* 分类列表 */}
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/?category=${category}`}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span className="text-lg">{CATEGORY_ICONS[category]}</span>
              <span>{CATEGORY_NAMES[category]}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

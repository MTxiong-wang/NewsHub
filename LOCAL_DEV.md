# NewsHub 本地开发指南

## 项目改造说明

本项目已从百度秒哒生成的代码改造为可在本地独立运行的版本。

### 主要变更

1. **移除依赖**
   - 移除了 `miaoda-auth-react` 和 `miaoda-sc-plugin` 等私有依赖
   - 移除了 Supabase 认证系统
   - 改为本地 localStorage 模拟认证

2. **集成 hot_news API**
   - 创建了 `src/services/hotNews.ts` 服务层
   - 支持 22 个平台的热点数据获取
   - 提供了完整的 TypeScript 类型定义

3. **更新构建配置**
   - 更新了 `vite.config.ts` 移除 miaoda 插件
   - 更新了 `package.json` 的脚本命令
   - 添加了标准的 Vite 开发服务器配置

## 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 本地开发

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 http://localhost:3000

## 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 代码检查

```bash
# 运行 lint 检查
pnpm lint

# 自动修复
pnpm lint:fix
```

## 项目结构

```
src/
├── components/       # React 组件
│   ├── common/       # 通用组件
│   ├── layouts/      # 布局组件
│   ├── news/         # 新闻相关组件
│   └── ui/           # UI 组件（shadcn/ui）
├── contexts/         # React Context（AuthContext 等）
├── db/              # 数据库相关（已简化）
├── hooks/           # 自定义 Hooks
├── lib/             # 工具函数
├── pages/           # 页面组件
├── services/        # API 服务层
│   └── hotNews.ts   # hot_news API 服务
├── types/           # TypeScript 类型定义
├── App.tsx          # 应用入口
├── main.tsx         # React 入口
└── routes.tsx       # 路由配置
```

## hot_news API 使用

### 基本用法

```typescript
import { getHotNews, PLATFORMS } from '@/services/hotNews';

// 获取百度热搜
const baiduNews = await getHotNews(PLATFORMS.BAIDU);

// 获取多个平台
const platforms = [PLATFORMS.WEIBO, PLATFORMS.ZHIHU];
const newsMap = await getMultipleHotNews(platforms);

// 获取所有平台
const allNews = await getAllHotNews();
```

### 支持的平台

- **社交媒体**: weibo, zhihu, douyin, douban, bilibili
- **科技媒体**: tskr (36氪), sspai (少数派), juejin, vtex (V2EX), github, stackoverflow, hackernews, ftpojie
- **财经媒体**: sina_finance, eastmoney, xueqiu, cls (财联社)
- **综合媒体**: baidu, jinritoutiao, tenxunwang
- **其他**: hupu, tieba

## 认证系统

当前使用本地 localStorage 模拟认证系统，用于演示。

### 登录流程

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn('username', 'password');
    if (error) {
      console.error('登录失败', error);
    }
  };
}
```

## 下一步开发

1. **创建热点新闻页面**
   - 使用 `getHotNews` API 获取数据
   - 展示 22 个平台的热点内容
   - 实现搜索和筛选功能

2. **优化 UI/UX**
   - 根据需求文档设计界面
   - 实现响应式布局
   - 添加加载状态和错误处理

3. **数据持久化（可选）**
   - 可以添加后端 API
   - 可以使用 Supabase 或其他 BaaS
   - 或者使用本地 IndexedDB

## 常见问题

### Q: 如何切换到真实的认证系统？

A: 修改 `src/contexts/AuthContext.tsx`，将 localStorage 部分替换为真实的 API 调用。

### Q: 如何添加缓存？

A: 可以使用以下方式：
- 简单：使用 localStorage
- 推荐：使用 Redis（需要后端）
- 浏览器：使用 IndexedDB

### Q: 数据更新频率？

A: hot_news API 约每 30 分钟刷新一次。建议在客户端设置 30 分钟的缓存。

## 相关文档

- [需求文档](../docs/requirements.md)
- [架构设计](../docs/architecture.md)
- [API 集成文档](../docs/api-sources.md)
- [README](../README.md)

## 技术栈

- React 18
- TypeScript 5.9
- Vite 5.1
- React Router 7.9
- Tailwind CSS 3.4
- shadcn/ui (Radix UI)

## 许可证

MIT

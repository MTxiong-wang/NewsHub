# NewsHub

> 基于 hot_news API 的热点新闻聚合平台，汇集22个主流平台的实时热点内容

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg)](https://vitejs.dev/)

## 项目简介

NewsHub 是一个现代化的热点新闻聚合平台，通过集成 [hot_news API](https://github.com/orz-ai/hot_news)，实时获取22个主流平台的热点数据，为用户提供一站式的热点新闻浏览体验。项目采用 React + TypeScript + Vite 技术栈，支持本地开发和生产部署。

### 核心特性

- **22个平台聚合** - 汇集百度、微博、知乎、36氪、GitHub Trending 等主流平台
- **实时更新** - 数据每30分钟自动刷新，紧跟热点动态
- **零爬虫维护** - 使用第三方API，无需维护复杂的爬虫系统
- **多维度浏览** - 支持按平台、分类、热度、时间等多种方式浏览
- **响应式设计** - 完美适配桌面端和移动端
- **快速响应** - 智能缓存策略，秒级加载体验
- **本地优先** - 支持完全本地开发，不依赖任何第三方服务

### 在线体验

项目演示地址：[即将上线](https://your-deployment-url.com)

## 支持的平台

### 社交媒体（5个）
微博热搜、知乎热榜、抖音热点、豆瓣、哔哩哔哩

### 科技媒体（8个）
36氪、少数派、掘金、V2EX、GitHub Trending、Stack Overflow、Hacker News、吾爱破解

### 财经媒体（4个）
新浪财经、东方财富、雪球、财联社

### 综合媒体（3个）
百度热搜、今日头条、腾讯网

### 其他（2个）
虎扑、百度贴吧

## 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 / **pnpm** >= 8.0.0 / **yarn** >= 1.22.0

### 安装 Node.js

#### Windows
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本安装程序
3. 运行安装程序并按提示完成安装
4. 打开命令行，验证安装：
   ```bash
   node -v  # 应显示 v18.x.x 或更高
   npm -v  # 应显示 9.x.x 或更高
   ```

#### macOS
```bash
# 使用 Homebrew 安装（推荐）
brew install node

# 或下载官方安装包
# 访问 https://nodejs.org/ 下载 .pkg 文件
```

#### Linux
```bash
# 使用包管理器安装
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# CentOS/RHEL
sudo yum install nodejs npm
```

### 本地开发

#### 1. 克隆项目

```bash
git clone https://github.com/MTxiong-wang/NewsHub.git
cd NewsHub
```

#### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐，更快）
pnpm install

# 或使用 yarn
yarn install
```

#### 3. 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev

# 或使用 yarn
yarn dev
```

服务器启动后，在浏览器中访问 [http://localhost:3000](http://localhost:3000)

#### 4. 构建生产版本

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 快速启动脚本

项目提供了快速启动脚本：

**Windows:**
```bash
quick-start.bat
```

**Linux/macOS:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

## 技术栈

### 前端框架
- **React 18** - 用户界面库
- **TypeScript 5.9** - 类型安全的 JavaScript
- **Vite 5.1** - 下一代前端构建工具
- **React Router 7.9** - 路由管理

### UI 组件
- **Tailwind CSS 3.4** - 原子化 CSS 框架
- **shadcn/ui** - 基于 Radix UI 的组件库
- **Radix UI** - 无障碍的 UI 原语组件
- **Lucide Icons** - 图标库

### 数据源
- **hot_news API** - [orz-ai/hot_news](https://github.com/orz-ai/hot_news)

### 开发工具
- **Biome** - 快速的 linter 和 formatter
- **TypeScript** - 类型检查
- **ESLint** - 代码质量检查

## 项目结构

```
NewsHub/
├── docs/                   # 项目文档
│   ├── requirements.md     # 需求文档
│   ├── architecture.md     # 架构设计
│   └── api-sources.md      # API 集成文档
├── public/                 # 静态资源
│   ├── favicon.ico         # 网站图标
│   └── images/             # 图片资源
├── src/                    # 源代码
│   ├── components/         # React 组件
│   │   ├── common/         # 通用组件
│   │   ├── layouts/        # 布局组件
│   │   ├── news/           # 新闻相关组件
│   │   └── ui/             # UI 基础组件
│   ├── contexts/           # React Context
│   ├── db/                 # 数据库相关（可选）
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具函数
│   ├── pages/              # 页面组件
│   ├── services/           # API 服务层
│   │   └── hotNews.ts      # hot_news API 服务
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 应用根组件
│   ├── main.tsx            # 应用入口
│   └── routes.tsx          # 路由配置
├── LOCAL_DEV.md            # 本地开发详细指南
├── MIGRATION_GUIDE.md      # 代码改造说明
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置
```

## 部署说明

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MTxiong-wang/NewsHub)

#### 步骤

1. ** Fork 本仓库**
   - 访问 [GitHub 仓库](https://github.com/MTxiong-wang/NewsHub)
   - 点击右上角 "Fork" 按钮

2. **在 Vercel 导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 选择你 fork 的仓库
   - 点击 "Deploy"

3. **自动部署**
   - Vercel 会自动检测项目配置
   - 构建完成后会获得一个 `.vercel.app` 域名
   - 每次推送到 master 分支会自动重新部署

### Netlify 部署

#### 步骤

1. **Fork 本仓库**

2. **在 Netlify 导入项目**
   - 访问 [netlify.com](https://www.netlify.com/)
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub" 并授权
   - 选择你 fork 的仓库

3. **配置构建设置**
   ```yaml
   Build command: npm run build
   Publish directory: dist
   ```

4. **部署**

### 自建服务器部署

#### 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

#### 使用 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/newshub/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 使用 Docker

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建和运行：
```bash
docker build -t newshub .
docker run -p 80:80 newshub
```

## API 使用说明

项目使用 [hot_news API](https://github.com/orz-ai/hot_news) 获取数据：

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

### API 信息

- **基础 URL**: `https://orz.ai/api/v1/dailynews/`
- **请求方法**: GET
- **数据刷新**: 约30分钟
- **速率限制**: 目前无明确限制

更多详情请查看 [API 集成文档](./docs/api-sources.md)。

## 常见问题（FAQ）

### Q1: 项目支持哪些浏览器？

A: 支持所有现代浏览器：
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

不支持 IE11。

### Q2: 数据更新频率是多少？

A: hot_news API 约每30分钟自动刷新一次。建议在前端设置相同或更长的缓存时间以减少 API 调用。

### Q3: 可以用于商业项目吗？

A: 本项目采用 MIT 开源协议，可以用于商业项目。但请注意：
- hot_news API 仅供合法使用
- 建议在页面注明数据来源
- 遵守相关平台的用户协议

### Q4: 如何联系项目维护者？

A: 可以通过以下方式联系：
- GitHub Issues: [https://github.com/MTxiong-wang/NewsHub/issues](https://github.com/MTxiong-wang/NewsHub/issues)
- 项目主页: [https://github.com/MTxiong-wang/NewsHub](https://github.com/MTxiong-wang/NewsHub)

## 性能优化建议

### 1. 代码分割
```typescript
// 懒加载页面组件
const HomePage = lazy(() => import('./pages/HomePage'));
```

### 2. 图片优化
- 使用 WebP 格式
- 实现懒加载
- 使用 CDN

### 3. 缓存策略
- 静态资源：长期缓存（1年）
- API 数据：30分钟
- HTML 页面：短期缓存（5分钟）

## 监控和日志

### 建议工具

- **性能监控**：Vercel Analytics / Google Analytics
- **错误追踪**：Sentry
- **用户行为**：Hotjar / Microsoft Clarity

## 相关资源

- [项目文档](./docs/)
- [本地开发指南](./LOCAL_DEV.md)
- [代码改造说明](./MIGRATION_GUIDE.md)
- [hot_news API](https://github.com/orz-ai/hot_news)
- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 更新日志

### v1.0.0 (2025-12-29)
- ✅ 初始版本发布
- ✅ 集成 hot_news API
- ✅ 支持22个平台
- ✅ 完整的 UI 组件库
- ✅ 响应式设计
- ✅ 本地开发配置

## 致谢

- [hot_news API](https://github.com/orz-ai/hot_news) - 提供热点数据支持
- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 许可证

[MIT License](./LICENSE)

## 联系方式

- 项目主页：[https://github.com/MTxiong-wang/NewsHub](https://github.com/MTxiong-wang/NewsHub)
- 问题反馈：[Issues](https://github.com/MTxiong-wang/NewsHub/issues)

---

**注意**：本项目聚合的热点新闻版权归原作者所有，仅提供聚合和跳转服务。

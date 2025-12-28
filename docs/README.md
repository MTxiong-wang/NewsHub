# NewsHub

> 基于 hot_news API 的热点新闻聚合平台，汇集22个主流平台的实时热点内容。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 简介

NewsHub 是一个现代化的热点新闻聚合平台，通过集成 [hot_news API](https://github.com/orz-ai/hot_news)，实时获取22个主流平台的热点数据，为用户提供一站式的热点新闻浏览体验。

## 核心特性

- **22个平台聚合** - 汇集百度、微博、知乎、36氪、GitHub Trending 等主流平台
- **实时更新** - 数据每30分钟自动刷新，紧跟热点动态
- **零爬虫维护** - 使用第三方API，无需维护复杂的爬虫系统
- **多维度浏览** - 支持按平台、分类、热度、时间等多种方式浏览
- **响应式设计** - 完美适配桌面端和移动端
- **快速响应** - 智能缓存策略，秒级加载体验

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

### 在线体验

访问 [NewsHub 在线演示](https://your-deployment-url.com)（即将上线）

### 本地开发

#### 前置要求

- Node.js 18+ 或最新版本
- npm 或 yarn 或 pnpm

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/MTxiong-wang/NewsHub.git
cd NewsHub

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

### 环境变量（可选）

如果需要配置 API 代理或其他设置：

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://orz.ai/api/v1/dailynews
```

## 技术栈

### 前端框架
- **Next.js** 14+ - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库

### 数据源
- **hot_news API** - [orz-ai/hot_news](https://github.com/orz-ai/hot_news)

### 部署平台
- **Vercel** - 推荐部署平台
- **Netlify** - 备选部署平台
- **自建服务器** - 使用 Docker

## 项目文档

- [需求文档](./requirements.md) - 详细的功能需求和规格说明
- [架构设计](./architecture.md) - 系统架构和技术选型
- [API 集成文档](./api-sources.md) - hot_news API 使用指南

## 项目架构

```
NewsHub
├── docs/           # 项目文档
├── src/            # 源代码（开发中）
├── public/         # 静态资源
└── package.json    # 项目配置
```

## 开发路线图

### v1.0 - MVP（当前阶段）
- [x] 需求文档
- [x] 架构设计
- [x] API 集成方案
- [ ] 前端页面开发
- [ ] 基础功能实现

### v1.1 - 功能增强
- [ ] 搜索功能
- [ ] 用户收藏
- [ ] 个性化推荐
- [ ] 移动端优化

### v2.0 - 高级特性
- [ ] 用户系统
- [ ] 数据趋势分析
- [ ] 历史数据查看
- [ ] API 服务

## 数据来源

本项目的热点数据来源于 [orz-ai/hot_news](https://github.com/orz-ai/hot_news) 提供的公开 API，数据仅供学习和参考使用。

### 数据说明

- 数据每30分钟自动刷新
- 仅包含标题、链接、热度评分等基本信息
- 点击新闻链接将跳转至原始平台查看完整内容
- 请遵守原始平台的使用条款

## 贡献指南

欢迎贡献代码、报告 Bug 或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 [MIT License](../LICENSE) 开源协议。

## 联系方式

- 项目主页：[https://github.com/MTxiong-wang/NewsHub](https://github.com/MTxiong-wang/NewsHub)
- 问题反馈：[Issues](https://github.com/MTxiong-wang/NewsHub/issues)

## 致谢

- [hot_news API](https://github.com/orz-ai/hot_news) - 提供热点数据支持
- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库

---

**注意**：本项目仅用于学习目的，聚合的热点新闻版权归原作者所有。

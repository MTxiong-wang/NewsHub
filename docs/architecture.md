# NewsHub 架构设计文档

## 1. 系统架构概览

### 1.1 整体架构

NewsHub 采用典型的三层架构设计，使用 hot_news API 作为数据源：

```
┌─────────────────────────────────────────────────────────────┐
│                         表现层 (Presentation)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web 前端    │  │  移动端 App   │  │   管理后台    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         应用层 (Application)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API 服务    │  │  搜索服务     │  │  定时任务     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         数据层 (Data)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   缓存        │  │   (可选)      │  │   搜索引擎    │      │
│  │   Redis      │  │   数据库      │  │ (可选)        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     数据采集层 (Collection)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API 调用器    │  │  数据处理器   │  │  错误处理器   │      │
│  │ hot_news API │  │  清洗/去重    │  │  重试/降级    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 核心模块

1. **API 调用模块** - 调用 hot_news API 获取22个平台的热点数据
2. **数据处理模块** - 清洗、去重、格式化
3. **热度计算模块** - 基于 API score 计算热度值
4. **API 服务模块** - 提供 RESTful API（可选）
5. **搜索服务模块** - 提供全文搜索功能（可选）
6. **推荐服务模块** - 个性化推荐（可选）
7. **前端展示模块** - 用户界面
8. **管理后台模块** - 系统管理（可选）

## 2. 技术选型建议

### 2.1 前端技术栈

#### 方案 A：现代化全栈方案（推荐）
- **框架**：Next.js 14+ (React)
- **状态管理**：Zustand / Redux Toolkit
- **UI 组件库**：
  - shadcn/ui（推荐）
  - Ant Design
  - Material-UI
- **样式方案**：Tailwind CSS
- **数据请求**：React Query / SWR

**优势**：
- 支持 SSR/SSG，SEO 友好
- 优秀的性能和开发体验
- 生态成熟，社区活跃
- TypeScript 支持完善

#### 方案 B：Vue 生态方案
- **框架**：Nuxt 3
- **状态管理**：Pinia
- **UI 组件库**：
  - Element Plus
  - Naive UI
- **样式方案**：UnoCSS / Tailwind CSS

**优势**：
- 学习曲线平缓
- 渐进式框架，灵活性高
- 中文文档丰富

### 2.2 后端技术栈（可选）

#### 方案 A：Node.js 方案
- **运行时**：Node.js 20+
- **框架**：NestJS / Express / Fastify
- **语言**：TypeScript
- **HTTP 客户端**：axios / node-fetch
- **定时任务**：node-cron / Bull / Agenda

**优势**：
- 前后端统一语言
- 异步 I/O，高并发性能好
- npm 生态丰富
- 适合调用 RESTful API

#### 方案 B：纯前端方案（最简单，推荐）
- **框架**：Next.js / Nuxt 3
- **数据获取**：直接在服务器端调用 API
- **缓存**：Redis 或 Vercel KV
- **定时任务**：Vercel Cron Jobs / GitHub Actions

**优势**：
- 无需自建后端服务
- 部署简单（Vercel/Netlify）
- 开发成本低
- 适合中小规模应用

### 2.3 数据存储方案（可选）

由于 hot_news API 已经提供数据，可以考虑以下几种方案：

#### 方案 A：纯缓存方案（推荐，最简单）
- **Redis** - 作为主要数据存储
- **存储时长**：30分钟 - 24小时
- **优势**：
  - 无需数据库维护
  - 部署简单
  - 成本低
- **适用场景**：中小规模，数据不需要长期保存

#### 方案 B：轻量数据库
- **SQLite** - 嵌入式数据库
- **优势**：
  - 无需数据库服务器
  - 文件存储，备份方便
  - 适合单机部署
- **适用场景**：需要历史数据和趋势分析

#### 方案 C：云数据库
- **Vercel Postgres / Neon** - Serverless PostgreSQL
- **PlanetScale / Supabase** - MySQL 云服务
- **优势**：
  - 按需付费
  - 自动扩展
  - 无需运维
- **适用场景**：生产环境，需要可靠性保障

#### 方案 D：不存储，实时调用（最简单）
- **直接调用 API**：每次用户请求时调用 hot_news API
- **优势**：
  - 无需存储和缓存
  - 数据始终最新
  - 零维护成本
- **劣势**：
  - 依赖第三方 API 可用性
  - 响应速度较慢
- **适用场景**：原型开发、个人项目

### 2.4 部署方案

#### 云平台
- **Vercel** / **Netlify** - 前端托管（推荐，免费额度）
- **Railway** / **Render** - 后端服务托管
- **阿里云** / **腾讯云** - 国内访问快

### 2.5 监控与日志
- **日志**：Winston / Pino / console
- **监控**：Uptime Robot / Pingdom（监控 API 可用性）
- **错误追踪**：Sentry（可选）

## 3. 数据模型设计（可选）

**注意**：如果选择纯前端方案或纯缓存方案，可以跳过此节。

### 3.1 核心数据表（如果使用数据库存储）

#### 平台表 (platforms)
```sql
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- baidu, weibo, zhihu
    name VARCHAR(100) NOT NULL,            -- 百度热搜, 微博热搜
    name_en VARCHAR(100),                  -- Baidu Hot, Weibo Hot
    category VARCHAR(50),                  -- social, tech, finance
    icon_url VARCHAR(500),
    website_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 热点新闻表 (hot_news)
```sql
CREATE TABLE hot_news (
    id SERIAL PRIMARY KEY,
    platform_id INTEGER REFERENCES platforms(id),
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000),
    description TEXT,
    score INTEGER DEFAULT 0,               -- API返回的热度值
    trend_rank INTEGER,                    -- 当日排名
    snapshot_date DATE,                    -- 快照日期
    snapshot_time TIMESTAMP,               -- 快照时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(platform_id, url, snapshot_date)
);

CREATE INDEX idx_hot_news_score ON hot_news(score DESC);
CREATE INDEX idx_hot_news_date ON hot_news(snapshot_date DESC);
CREATE INDEX idx_hot_news_platform ON hot_news(platform_id);
```

### 3.2 数据结构示例（Redis/JSON 格式）

如果使用 Redis 存储，可以采用以下结构：

```json
// Key: hot_news:{platform}:{date}
{
  "platform": "baidu",
  "date": "2025-12-28",
  "updated_at": "2025-12-28T10:30:00Z",
  "data": [
    {
      "title": "新闻标题",
      "url": "https://...",
      "score": 4955232,
      "desc": "描述文字",
      "rank": 1
    }
  ]
}
```

## 4. 核心流程设计

### 4.1 数据获取流程

```
定时任务触发（每30分钟）
    ↓
遍历22个平台
    ↓
调用 hot_news API
    ↓
接收 JSON 数据
    ↓
数据清洗和去重
    ↓
存储到缓存/数据库（可选）
    ↓
更新前端缓存
```

### 4.2 用户访问流程

```
用户请求
    ↓
前端缓存检查（浏览器缓存）
    ↓
服务端缓存检查（Redis/Vercel KV）
    ↓
调用 hot_news API（缓存未命中）
    ↓
数据处理和排序
    ↓
返回展示
```

### 4.3 搜索流程

```
用户搜索
    ↓
搜索关键词
    ↓
前端过滤或后端搜索
    ↓
结果排序
    ↓
返回结果
```

## 5. API 设计（可选）

如果需要提供后端 API 服务：

### 5.1 RESTful API 规范

#### 基础 URL
```
https://api.newshub.com/v1
```

#### 通用响应格式
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2025-12-28T00:00:00Z"
}
```

### 5.2 核心 API 端点

#### 热点新闻相关
```
GET    /hot-news              # 获取所有平台热点
GET    /hot-news/:platform    # 获取特定平台热点
GET    /hot-news/hot          # 获取跨平台热门
GET    /platforms             # 获取所有平台列表
```

#### 搜索相关
```
GET    /search                # 搜索热点
```

## 6. 缓存策略

### 6.1 缓存层级

1. **浏览器缓存**（前端）
   - 静态资源：1 天 - 1 年
   - API 响应：5 分钟

2. **服务端缓存**（Redis/Vercel KV）
   - 热点数据：30 分钟
   - 平台列表：1 小时
   - 搜索结果：3 分钟

### 6.2 缓存更新策略

- **主动更新**：定时任务每30分钟更新缓存
- **被动过期**：设置 TTL 自动过期
- **客户端缓存**：利用浏览器缓存减少请求

## 7. 性能优化

### 7.1 应用优化
- API 调用批量化（一次请求获取多个平台）
- 并发控制（限制同时 API 调用数量）
- 结果缓存（减少重复调用）
- 懒加载（按需加载数据）

### 7.2 前端优化
- 代码分割（Code Splitting）
- 图片懒加载
- 服务端渲染（SSR）
- 客户端缓存

## 8. 安全设计

### 8.1 认证与授权（可选）
- 如果有用户系统，使用 JWT Token 认证
- API 访问频率限制（可选）

### 8.2 数据安全
- HTTPS 加密传输
- XSS 防护
- CSRF 防护（可选）

### 8.3 API 调用安全
- 设置合理的超时时间
- 实现重试机制（避免无限重试）
- 监控 API 可用性
- 降级策略（API 不可用时使用缓存）

## 9. 监控与运维

### 9.1 监控指标
- API 可用性
- API 响应时间
- 缓存命中率
- 错误日志

### 9.2 日志管理
- API 调用日志
- 错误日志
- 性能日志

### 9.3 告警机制
- API 不可用告警
- 性能异常告警

## 10. 部署架构

### 10.1 开发环境
```
本地开发 → 无需容器化
```

### 10.2 生产环境（推荐）

#### 方案 A：纯前端部署
```
用户
    ↓
CDN (Vercel/Netlify)
    ↓
Serverless Functions (调用 API)
    ↓
hot_news API
```

#### 方案 B：前后端分离
```
负载均衡 (Nginx/可选)
    ↓
前端服务器 (Vercel/Netlify)
    ↓
API 服务器 (Railway/Render)
    ↓
缓存 (Redis/可选)
```

## 11. 扩展性设计

### 11.1 水平扩展
- 无状态应用层
- CDN 加速
- 缓存集群（可选）

### 11.2 功能扩展
- 插件化架构（可选）
- API 版本控制
- 支持多个数据源（不依赖单一 API）

---

**文档版本：** v2.0
**最后更新：** 2025-12-28
**维护者：** NewsHub Team
**变更说明：** 将数据获取方式从自建爬虫改为使用 hot_news API，简化架构设计

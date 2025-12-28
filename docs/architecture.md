# NewsHub 架构设计文档

## 1. 系统架构概览

### 1.1 整体架构

NewsHub 采用典型的三层架构设计：

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
│  │   API 服务    │  │  搜索服务     │  │  推荐服务     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         数据层 (Data)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   数据库      │  │   缓存        │  │   搜索引擎    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         采集层 (Collection)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  爬虫调度器   │  │  数据处理器   │  │  热度计算器   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 核心模块

1. **新闻采集模块** - 负责从各新闻源抓取数据
2. **数据处理模块** - 清洗、去重、分类
3. **热度计算模块** - 计算新闻热度值
4. **API 服务模块** - 提供 RESTful API
5. **搜索服务模块** - 提供全文搜索功能
6. **推荐服务模块** - 个性化推荐（可选）
7. **前端展示模块** - 用户界面
8. **管理后台模块** - 系统管理

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

### 2.2 后端技术栈

#### 方案 A：Node.js 方案（推荐）
- **运行时**：Node.js 20+
- **框架**：NestJS / Express / Fastify
- **ORM**：Prisma / TypeORM
- **语言**：TypeScript

**优势**：
- 前后端统一语言
- 异步 I/O，高并发性能好
- npm 生态丰富

#### 方案 B：Python 方案
- **框架**：FastAPI / Django
- **异步库**：asyncio, aiohttp
- **爬虫框架**：Scrapy

**优势**：
- 爬虫生态成熟（Scrapy）
- 数据处理库丰富（Pandas, NumPy）
- AI/ML 集成方便

#### 方案 C：Go 方案
- **框架**：Gin / Echo
- **并发模型**：Goroutines

**优势**：
- 性能优秀，并发能力强
- 部署简单，单文件执行
- 适合高并发场景

### 2.3 数据库选型

#### 主数据库
**PostgreSQL**（推荐）
- 支持全文搜索
- JSON 数据类型支持
- 优秀的性能和可靠性
- 开源免费

**MySQL / MariaDB**
- 广泛使用，文档丰富
- 成熟稳定

**MongoDB**
- 灵活的文档结构
- 适合非结构化数据
- 横向扩展能力强

#### 缓存层
**Redis**（推荐）
- 内存缓存，高性能
- 支持多种数据结构
- 可用于消息队列

**Memcached**
- 简单高效的 KV 缓存

#### 搜索引擎
**Elasticsearch**（推荐）
- 强大的全文搜索能力
- 支持分布式部署
- 丰富的查询语法

**Meilisearch**
- 轻量级，易用
- 快速的搜索响应
- 适合中小规模

### 2.4 消息队列（可选）
- **RabbitMQ** - 功能完善，可靠性高
- **Redis** - 轻量级，使用简单
- **Kafka** - 高吞吐量，适合大数据

### 2.5 部署方案

#### 容器化
- **Docker** - 容器化部署
- **Docker Compose** - 本地开发环境

#### 编排工具
- **Kubernetes** - 大规模生产环境
- **Docker Swarm** - 简单的集群管理

#### 云平台
- **阿里云** / **腾讯云** - 国内访问快
- **AWS** / **Google Cloud** - 国际化
- **Vercel** / **Netlify** - 前端托管（推荐）

### 2.6 监控与日志
- **日志**：Winston / Pino
- **监控**：Prometheus + Grafana
- **APM**：Sentry / DataDog
- **日志聚合**：ELK Stack

## 3. 数据模型设计

### 3.1 核心数据表

#### 新闻表 (news)
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT,
    author VARCHAR(200),
    source_id INTEGER REFERENCES news_sources(id),
    original_url VARCHAR(1000) UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    cover_image VARCHAR(1000),
    published_at TIMESTAMP,
    crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hot_score DECIMAL(10,2) DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, hidden, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_hot_score ON news(hot_score DESC);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_news_source ON news(source_id);
```

#### 新闻源表 (news_sources)
```sql
CREATE TABLE news_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    type VARCHAR(50), -- rss, api, crawler
    config JSONB, -- 存储配置信息
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_crawl_at TIMESTAMP,
    crawl_frequency INTEGER DEFAULT 30, -- 分钟
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 分类表 (categories)
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### 标签表 (tags)
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_tags (
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, tag_id)
);
```

#### 用户表（可选）
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(1000),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 ER 图

```
┌─────────────┐         ┌─────────────┐
│   news      │────────>│news_sources │
├─────────────┤         ├─────────────┤
│ id          │         │ id          │
│ title       │         │ name        │
│ summary     │         │ url         │
│ content     │         │ type        │
│ source_id   │         │ config      │
│ category_id │         └─────────────┘
│ ...         │                ↑
└─────────────┘                │
       │                       │
       │                ┌─────────────┐
       ↓                │  crawler    │
┌─────────────┐         └─────────────┘
│ categories  │
├─────────────┤
│ id          │
│ name        │
└─────────────┘

┌─────────────┐         ┌─────────────┐
│   news      │<────────│    tags     │
└─────────────┘         └─────────────┘
```

## 4. 核心流程设计

### 4.1 新闻采集流程

```
┌─────────────┐
│ 定时调度器   │ (每 5-30 分钟)
└──────┬──────┘
       ↓
┌─────────────┐
│ 新闻源列表   │
└──────┬──────┘
       ↓
┌─────────────────────────────────────────┐
│          数据抓取模块                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   RSS   │  │   API   │  │ 爬虫    │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└──────────────┬──────────────────────────┘
               ↓
       ┌───────────────┐
       │  原始数据队列  │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │  数据清洗模块  │
       │  - 去重        │
       │  - 格式化      │
       │  - 过滤        │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │   存储数据库   │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │  热度计算模块  │
       └───────┬───────┘
               ↓
       ┌───────────────┐
       │  更新缓存索引  │
       └───────────────┘
```

### 4.2 用户访问流程

```
用户请求
   ↓
┌──────────┐
│ CDN 缓存  │ → 命中 → 返回
└─────┬────┘
      ↓ 未命中
┌──────────┐
│ Redis    │ → 命中 → 返回
└─────┬────┘
      ↓ 未命中
┌──────────┐
│ 数据库   │ → 查询 → 返回
└─────┬────┘
      ↓
┌──────────┐
│ 写缓存   │
└──────────┘
```

### 4.3 搜索流程

```
用户搜索
   ↓
┌──────────────┐
│ 搜索关键词    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Elasticsearch│ → 查询
└──────┬───────┘
       ↓
┌──────────────┐
│ 结果排序      │
└──────┬───────┘
       ↓
┌──────────────┐
│ 返回结果      │
└──────────────┘
```

## 5. API 设计

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

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "timestamp": "2025-12-28T00:00:00Z"
}
```

### 5.2 核心 API 端点

#### 新闻相关
```
GET    /news                 # 获取新闻列表
GET    /news/:id             # 获取新闻详情
GET    /news/hot             # 获取热点新闻
GET    /news/latest          # 获取最新新闻
GET    /news/category/:id    # 按分类获取
```

#### 搜索相关
```
GET    /search               # 搜索新闻
GET    /search/suggest       # 搜索建议
```

#### 分类相关
```
GET    /categories           # 获取所有分类
GET    /categories/:id       # 获取分类详情
```

#### 标签相关
```
GET    /tags                 # 获取所有标签
GET    /tags/hot             # 获取热门标签
GET    /tags/:id/news        # 获取标签下的新闻
```

#### 管理后台 API
```
GET    /admin/news           # 管理新闻列表
POST   /admin/news           # 添加新闻
PUT    /admin/news/:id       # 更新新闻
DELETE /admin/news/:id       # 删除新闻

GET    /admin/sources        # 管理新闻源
POST   /admin/sources        # 添加新闻源
PUT    /admin/sources/:id    # 更新新闻源
DELETE /admin/sources/:id    # 删除新闻源

GET    /admin/stats          # 统计数据
```

### 5.3 API 认证

使用 JWT（JSON Web Token）进行认证：

```
Authorization: Bearer <token>
```

## 6. 缓存策略

### 6.1 缓存层级

1. **CDN 缓存**（静态资源）
   - CSS, JS, 图片
   - 缓存时间：1 天 - 1 年

2. **Redis 缓存**（热点数据）
   - 热门新闻列表：5 分钟
   - 新闻详情：10 分钟
   - 分类列表：1 小时
   - 搜索结果：3 分钟

3. **应用缓存**（内存）
   - 配置信息
   - 新闻源配置

### 6.2 缓存更新策略

- **主动更新**：数据变更时立即更新缓存
- **被动过期**：设置 TTL 自动过期
- **定时预热**：定时任务预加载热点数据

## 7. 性能优化

### 7.1 数据库优化
- 合理使用索引
- 分页查询（避免深分页）
- 读写分离
- 数据库连接池

### 7.2 应用优化
- 异步处理（非阻塞 I/O）
- 并发控制
- 资源池化
- 懒加载

### 7.3 前端优化
- 代码分割（Code Splitting）
- 图片懒加载
- 服务端渲染（SSR）
- 客户端缓存

## 8. 安全设计

### 8.1 认证与授权
- JWT Token 认证
- RBAC 权限控制
- API 访问频率限制

### 8.2 数据安全
- 密码哈希存储（bcrypt）
- HTTPS 加密传输
- SQL 参数化查询
- XSS 防护

### 8.3 爬虫安全
- 遵守 robots.txt
- 设置请求间隔
- User Agent 识别
- 代理 IP 池（可选）

## 9. 监控与运维

### 9.1 监控指标
- 系统资源：CPU, 内存, 磁盘
- 应用性能：响应时间, QPS
- 业务指标：新闻数量, 用户访问

### 9.2 日志管理
- 应用日志
- 访问日志
- 错误日志
- 爬虫日志

### 9.3 告警机制
- 服务异常告警
- 性能阈值告警
- 爬虫失败告警

## 10. 部署架构

### 10.1 开发环境
```
本地开发 → Docker Compose
```

### 10.2 生产环境
```
负载均衡 (Nginx)
    ↓
前端服务器 (Vercel/Netlify)
    ↓
API 服务器 (多实例)
    ↓
数据库集群 (主从)
    ↓
缓存集群 (Redis)
```

## 11. 扩展性设计

### 11.1 水平扩展
- 无状态应用层
- 数据库分库分表
- 缓存集群

### 11.2 功能扩展
- 插件化架构
- 微服务化（可选）
- API 版本控制

---

**文档版本：** v1.0
**最后更新：** 2025-12-28
**维护者：** NewsHub Team

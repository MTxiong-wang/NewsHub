# NewsHub API 集成文档

## 1. API 概述

NewsHub 使用 [orz-ai/hot_news](https://github.com/orz-ai/hot_news) 提供的公开 API 来获取各平台的热点新闻数据。

### 1.1 API 基本信息

- **基础 URL**: `https://orz.ai/api/v1/dailynews/`
- **请求方法**: GET
- **数据格式**: JSON
- **数据刷新频率**: 约每30分钟自动刷新一次
- **License**: MIT License
- **速率限制**: 目前无明确限制，但建议合理使用

### 1.2 API 优势

- 无需维护爬虫系统
- 数据质量高，由专业团队维护
- 支持多个主流平台
- 自动更新，数据及时
- 合法合规，无版权风险

### 1.3 API 局限

- 依赖第三方服务可用性
- 数据格式受限于 API
- 只能获取标题、URL、评分、描述等基本信息
- 无法获取完整正文内容

## 2. API 调用方式

### 2.1 请求格式

#### 基础请求
```http
GET https://orz.ai/api/v1/dailynews/?platform={platform_code}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platform | string | 是 | 平台代码，如 baidu, weibo, zhihu |

### 2.2 响应格式

#### 成功响应
```json
{
  "status": "200",
  "data": [
    {
      "title": "新闻标题",
      "url": "https://www.baidu.com/s?word=...",
      "score": "4955232",
      "desc": "新闻描述或摘要"
    }
  ],
  "msg": "success"
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| status | string | 状态码，"200" 表示成功 |
| data | array | 热点新闻列表 |
| data[].title | string | 新闻标题 |
| data[].url | string | 原始链接 |
| data[].score | string | 热度评分（字符串格式） |
| data[].desc | string | 新闻描述，可能为空字符串 |
| msg | string | 响应消息 |

## 3. 支持的平台

### 3.1 平台列表

| 序号 | 平台代码 | 平台名称 | 分类 | 状态 |
|------|----------|----------|------|------|
| 1 | baidu | 百度热搜 | 综合媒体 | ✅ |
| 2 | sspai | 少数派 | 科技媒体 | ✅ |
| 3 | weibo | 微博热搜 | 社交媒体 | ✅ |
| 4 | zhihu | 知乎热榜 | 社交媒体 | ✅ |
| 5 | tskr | 36氪 | 科技媒体 | ✅ |
| 6 | ftpojie | 吾爱破解 | 科技媒体 | ✅ |
| 7 | bilibili | 哔哩哔哩 | 社交媒体 | ✅ |
| 8 | douban | 豆瓣 | 社交媒体 | ✅ |
| 9 | hupu | 虎扑 | 其他 | ✅ |
| 10 | tieba | 百度贴吧 | 其他 | ✅ |
| 11 | juejin | 掘金 | 科技媒体 | ✅ |
| 12 | douyin | 抖音热点 | 社交媒体 | ✅ |
| 13 | vtex | V2EX | 科技媒体 | ✅ |
| 14 | jinritoutiao | 今日头条 | 综合媒体 | ✅ |
| 15 | stackoverflow | Stack Overflow | 科技媒体 | ✅ |
| 16 | github | GitHub Trending | 科技媒体 | ✅ |
| 17 | hackernews | Hacker News | 科技媒体 | ✅ |
| 18 | sina_finance | 新浪财经 | 财经媒体 | ✅ |
| 19 | eastmoney | 东方财富 | 财经媒体 | ✅ |
| 20 | xueqiu | 雪球 | 财经媒体 | ✅ |
| 21 | cls | 财联社 | 财经媒体 | ✅ |
| 22 | tenxunwang | 腾讯网 | 综合媒体 | ✅ |

### 3.2 平台分类

#### 社交媒体（5个）
- **weibo** - 微博热搜：社交热点、娱乐、事件
- **zhihu** - 知乎热榜：问答、深度内容、社会热点
- **douyin** - 抖音热点：短视频热点、娱乐
- **douban** - 豆瓣：书影音、文化、讨论
- **bilibili** - 哔哩哔哩：视频、动漫、游戏、生活

#### 科技媒体（8个）
- **tskr** - 36氪：科技创业、商业资讯
- **sspai** - 少数派：科技、数码、生活方式
- **juejin** - 掘金：编程、技术文章
- **vtex** - V2EX：技术、编程、创意
- **github** - GitHub Trending：开源项目、编程语言
- **stackoverflow** - Stack Overflow：编程问答、技术讨论
- **hackernews** - Hacker News：科技新闻、创业、编程
- **ftpojie** - 吾爱破解：技术、软件、安全

#### 财经媒体（4个）
- **sina_finance** - 新浪财经：财经新闻、股市资讯
- **eastmoney** - 东方财富：财经资讯、投资理财
- **xueqiu** - 雪球：股票投资、财经社区
- **cls** - 财联社：财经快讯、市场动态

#### 综合媒体（3个）
- **baidu** - 百度热搜：社会热点、娱乐、事件
- **jinritoutiao** - 今日头条：新闻、热点事件
- **tenxunwang** - 腾讯网：综合新闻、娱乐、科技

#### 其他（2个）
- **hupu** - 虎扑：体育、游戏、数码
- **tieba** - 百度贴吧：兴趣社区、话题讨论

## 4. 集成示例

### 4.1 JavaScript / Node.js

#### 使用 fetch
```javascript
async function getHotNews(platform) {
  const url = `https://orz.ai/api/v1/dailynews/?platform=${platform}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.status === '200') {
      return result.data;
    } else {
      console.error('API Error:', result.msg);
      return [];
    }
  } catch (error) {
    console.error('Request failed:', error);
    return [];
  }
}

// 获取百度热搜
const baiduNews = await getHotNews('baidu');
console.log(baiduNews);
```

#### 使用 axios
```javascript
const axios = require('axios');

async function getHotNews(platform) {
  try {
    const response = await axios.get('https://orz.ai/api/v1/dailynews/', {
      params: { platform }
    });

    if (response.data.status === '200') {
      return response.data.data;
    }
  } catch (error) {
    console.error('Request failed:', error);
  }

  return [];
}

// 获取微博热搜
const weiboNews = await getHotNews('weibo');
```

#### 获取所有平台
```javascript
const platforms = [
  'baidu', 'weibo', 'zhihu', 'tskr', 'bilibili',
  'douban', 'hupu', 'juejin', 'douyin', 'vtex'
];

async function getAllHotNews() {
  const results = {};

  for (const platform of platforms) {
    results[platform] = await getHotNews(platform);
    // 避免请求过于频繁，延迟100ms
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

const allNews = await getAllHotNews();
```

### 4.2 Python

#### 使用 requests
```python
import requests

def get_hot_news(platform):
    url = "https://orz.ai/api/v1/dailynews/"
    params = {"platform": platform}

    try:
        response = requests.get(url, params=params, timeout=10)
        result = response.json()

        if result.get("status") == "200":
            return result.get("data", [])
        else:
            print(f"API Error: {result.get('msg')}")
            return []
    except Exception as e:
        print(f"Request failed: {e}")
        return []

# 获取知乎热榜
zhihu_news = get_hot_news("zhihu")
for item in zhihu_news[:5]:
    print(f"{item['title']} - 热度: {item['score']}")
```

#### 使用 aiohttp（异步）
```python
import aiohttp
import asyncio

async def get_hot_news(session, platform):
    url = "https://orz.ai/api/v1/dailynews/"
    params = {"platform": platform}

    try:
        async with session.get(url, params=params, timeout=10) as response:
            result = await response.json()

            if result.get("status") == "200":
                return platform, result.get("data", [])
    except Exception as e:
        print(f"{platform} request failed: {e}")

    return platform, []

async def get_all_hot_news(platforms):
    async with aiohttp.ClientSession() as session:
        tasks = [get_hot_news(session, platform) for platform in platforms]
        results = await asyncio.gather(*tasks)

    return dict(results)

# 使用示例
platforms = ['baidu', 'weibo', 'zhihu', 'tskr']
all_news = asyncio.run(get_all_hot_news(platforms))
```

### 4.3 curl

```bash
# 获取百度热搜
curl "https://orz.ai/api/v1/dailynews/?platform=baidu"

# 获取微博热搜
curl "https://orz.ai/api/v1/dailynews/?platform=weibo"

# 格式化输出
curl "https://orz.ai/api/v1/dailynews/?platform=zhihu" | jq
```

### 4.4 Next.js (Server-Side)

```javascript
// app/api/hot-news/[platform]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { platform } = params;
  const url = `https://orz.ai/api/v1/dailynews/?platform=${platform}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    // 缓存30分钟
    NextResponse.json(result.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

## 5. 错误处理和重试策略

### 5.1 常见错误

| 错误类型 | 说明 | 处理方法 |
|---------|------|---------|
| 网络超时 | API 响应时间过长 | 设置超时时间，使用重试机制 |
| API 不可用 | hot_news API 服务停止 | 使用缓存数据，展示友好提示 |
| 数据格式变更 | API 响应格式变化 | 做好版本兼容，定期检查更新 |
| 无效平台代码 | 请求了不存在的平台 | 验证平台代码，使用白名单 |

### 5.2 重试机制

```javascript
async function getHotNewsWithRetry(platform, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const data = await getHotNews(platform);
      return data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);

      if (i === maxRetries - 1) {
        // 最后一次重试失败，返回空数组或缓存数据
        return getCachedData(platform) || [];
      }

      // 等待一段时间后重试（指数退避）
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 5.3 降级策略

当 API 不可用时，可以采取以下策略：

1. **展示缓存数据**：使用 Redis 或其他缓存中的历史数据
2. **友好提示**：告知用户数据正在更新中
3. **部分展示**：展示其他可用平台的数据

```javascript
async function getHotNewsWithFallback(platform) {
  try {
    // 尝试从 API 获取最新数据
    const data = await getHotNews(platform);
    await setCache(platform, data); // 更新缓存
    return data;
  } catch (error) {
    console.error('API failed, using cache');

    // API 失败，使用缓存数据
    const cachedData = await getCachedData(platform);

    if (cachedData) {
      return {
        data: cachedData,
        cached: true,
        message: '正在更新数据，显示的是缓存内容'
      };
    }

    // 如果也没有缓存，返回空数组
    return {
      data: [],
      error: true,
      message: '暂时无法获取数据，请稍后再试'
    };
  }
}
```

## 6. 数据缓存策略

### 6.1 缓存方案

#### Redis 缓存
```javascript
const Redis = require('redis');
const redis = Redis.createClient();

async function getCachedHotNews(platform) {
  const key = `hot_news:${platform}`;
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  // 缓存未命中，从 API 获取
  const data = await getHotNews(platform);

  // 存入缓存，30分钟过期
  await redis.setex(key, 1800, JSON.stringify(data));

  return data;
}
```

#### Vercel KV 缓存（适合 Serverless）
```javascript
import { kv } from '@vercel/kv';

export async function getCachedHotNews(platform) {
  const key = `hot_news:${platform}`;

  // 尝试从缓存获取
  const cached = await kv.get(key);
  if (cached) {
    return cached;
  }

  // 从 API 获取
  const data = await getHotNews(platform);

  // 存入缓存，30分钟过期
  await kv.set(key, data, { ex: 1800 });

  return data;
}
```

### 6.2 缓存时长建议

| 数据类型 | 缓存时长 | 说明 |
|---------|---------|------|
| 热点新闻数据 | 30分钟 | API 约每30分钟刷新一次 |
| 平台列表 | 1小时 | 平台信息很少变化 |
| 搜索结果 | 3分钟 | 搜索结果缓存时间较短 |
| 聚合数据 | 15分钟 | 跨平台聚合数据 |

## 7. 定时任务

### 7.1 使用 node-cron

```javascript
const cron = require('node-cron');
const platforms = ['baidu', 'weibo', 'zhihu', 'tskr'];

// 每30分钟执行一次
cron.schedule('*/30 * * * *', async () => {
  console.log('Updating hot news cache...');

  for (const platform of platforms) {
    try {
      const data = await getHotNews(platform);
      await setCache(platform, data);
      console.log(`${platform} updated successfully`);
    } catch (error) {
      console.error(`${platform} update failed:`, error);
    }
  }

  console.log('Hot news cache update completed');
});
```

### 7.2 使用 Vercel Cron Jobs

```javascript
// app/api/cron/hot-news/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // 验证 Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 更新所有平台的数据
  const platforms = ['baidu', 'weibo', 'zhihu', 'tskr'];
  const results = {};

  for (const platform of platforms) {
    try {
      const data = await getHotNews(platform);
      await setCache(platform, data);
      results[platform] = 'success';
    } catch (error) {
      results[platform] = 'failed';
    }
  }

  return NextResponse.json({ success: true, results });
}
```

`vercel.json` 配置：
```json
{
  "crons": [
    {
      "path": "/api/cron/hot-news",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

## 8. 监控和告警

### 8.1 API 健康检查

```javascript
async function checkApiHealth() {
  const platforms = ['baidu', 'weibo'];
  const results = {};

  for (const platform of platforms) {
    try {
      const start = Date.now();
      await getHotNews(platform);
      const duration = Date.now() - start;

      results[platform] = {
        status: 'ok',
        duration: `${duration}ms`
      };
    } catch (error) {
      results[platform] = {
        status: 'error',
        error: error.message
      };
    }
  }

  return results;
}
```

### 8.2 告警设置

- 使用 Uptime Robot 或类似服务监控 API 可用性
- API 连续失败 3 次时发送告警
- 响应时间超过 5 秒时发送告警
- 数据更新异常时发送告警

## 9. 最佳实践

### 9.1 性能优化

1. **批量获取**：一次性请求多个平台，避免逐个请求
2. **并发控制**：限制并发请求数量，避免过载
3. **结果缓存**：充分利用缓存减少 API 调用
4. **数据预处理**：提前计算和排序，减少实时计算

### 9.2 可靠性保障

1. **重试机制**：失败时自动重试，但要设置最大重试次数
2. **超时控制**：设置合理的超时时间，避免长时间等待
3. **降级策略**：API 不可用时使用缓存数据
4. **日志记录**：记录所有 API 调用，便于问题排查

### 9.3 用户体验

1. **加载状态**：显示加载动画或骨架屏
2. **错误提示**：友好的错误提示信息
3. **数据时效**：显示数据更新时间
4. **快速响应**：使用缓存优先策略

## 10. 注意事项

### 10.1 使用限制

- 此 API 仅供合法使用，任何非法使用均不受支持
- 本 API 提供的数据仅供参考，不应作为新闻的主要来源
- 建议在页面注明数据来源：数据来源于 hot_news API

### 10.2 风险提示

- API 可能因维护、更新或停止服务导致数据获取失败
- API 响应格式可能发生变化，需要做好兼容处理
- 过度频繁的请求可能导致限流或封禁

### 10.3 合规建议

- 遵守相关法律法规
- 注明数据来源和原平台链接
- 用户点击后跳转至原平台查看完整内容
- 不将数据用于商业用途（需查看 API 使用条款）

## 11. 相关资源

- **GitHub 仓库**: https://github.com/orz-ai/hot_news
- **在线示例**: https://orz.ai
- **项目文档**: https://github.com/orz-ai/hot_news#readme

---

**文档版本：** v2.0
**最后更新：** 2025-12-28
**维护者：** NewsHub Team
**变更说明：** 完全重写为 hot_news API 集成文档

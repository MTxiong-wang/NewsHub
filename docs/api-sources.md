# NewsHub 新闻源配置文档

## 1. 新闻源概览

本文档列出了 NewsHub 计划支持的新闻网站及其接入方式。

## 2. 国内新闻网站

### 2.1 综合门户类

#### 新浪新闻
- **网站**: https://news.sina.com.cn/
- **类型**: RSS / 爬虫
- **RSS 链接**:
  - 滚动新闻: https://news.sina.com.cn/roll/index.d.html
- **分类**: 时政, 财经, 体育, 娱乐, 科技
- **更新频率**: 10 分钟
- **优先级**: 高

#### 网易新闻
- **网站**: https://news.163.com/
- **类型**: RSS
- **RSS 链接**: https://news.163.com/special/0001386I/rss_news.xml
- **分类**: 新闻, 财经, 体育, 娱乐, 科技
- **更新频率**: 10 分钟
- **优先级**: 高

#### 搜狐新闻
- **网站**: https://news.sohu.com/
- **类型**: RSS
- **RSS 链接**: https://news.sohu.com/rss/roll.xml
- **分类**: 综合, 财经, 体育, 娱乐
- **更新频率**: 15 分钟
- **优先级**: 中

#### 腾讯新闻
- **网站**: https://news.qq.com/
- **类型**: 爬虫
- **分类**: 时政, 财经, 体育, 娱乐, 科技
- **更新频率**: 10 分钟
- **优先级**: 高

#### 凤凰网
- **网站**: https://news.ifeng.com/
- **类型**: RSS
- **RSS 链接**: https://news.ifeng.com/rss/index.xml
- **分类**: 时政, 财经, 体育, 娱乐
- **更新频率**: 15 分钟
- **优先级**: 高

### 2.2 科技类

#### 36氪 (36Kr)
- **网站**: https://36kr.com/
- **类型**: RSS / API
- **RSS 链接**: https://36kr.com/feed
- **分类**: 科技, 创业, 投资
- **更新频率**: 30 分钟
- **优先级**: 高

#### 虎嗅网
- **网站**: https://www.huxiu.com/
- **类型**: RSS
- **RSS 链接**: https://www.huxiu.com/rss/0.xml
- **分类**: 科技, 商业
- **更新频率**: 30 分钟
- **优先级**: 中

#### 钛媒体
- **网站**: https://www.tmtpost.com/
- **类型**: RSS
- **RSS 链接**: https://www.tmtpost.com/rss.xml
- **分类**: 科技, 商业
- **更新频率**: 1 小时
- **优先级**: 中

#### IT之家
- **网站**: https://www.ithome.com/
- **类型**: RSS
- **RSS 链接**: https://www.ithome.com/rss/
- **分类**: 科技, 数码
- **更新频率**: 20 分钟
- **优先级**: 高

### 2.3 财经类

#### 财经网
- **网站**: https://www.caijing.com.cn/
- **类型**: RSS
- **RSS 链接**: https://www.caijing.com.cn/rss/index.xml
- **分类**: 财经, 宏观, 金融
- **更新频率**: 30 分钟
- **优先级**: 中

#### 第一财经
- **网站**: https://www.yicai.com/
- **类型**: RSS
- **RSS 链接**: https://www.yicai.com/rss/news.xml
- **分类**: 财经, 宏观, 金融
- **更新频率**: 30 分钟
- **优先级**: 高

#### 华尔街见闻
- **网站**: https://wallstreetcn.com/
- **类型**: API
- **API 文档**: 需申请
- **分类**: 全球市场, 宏观
- **更新频率**: 实时
- **优先级**: 高

### 2.4 其他分类

#### 体育
- **虎扑**: https://www.hupu.com/ (RSS)
- **新浪体育**: https://sports.sina.com.cn/ (RSS)

#### 娱乐
- **娱乐头条**: https://ent.sina.com.cn/ (RSS)
- **腾讯娱乐**: https://ent.qq.com/ (爬虫)

## 3. 国际新闻网站

### 3.1 国际主流媒体

#### BBC News
- **网站**: https://www.bbc.com/news
- **类型**: RSS
- **RSS 链接**: http://feeds.bbci.co.uk/news/rss.xml
- **分类**: 世界, 商业, 科技
- **更新频率**: 30 分钟
- **优先级**: 中
- **注意**: 需处理英文内容

#### CNN
- **网站**: https://edition.cnn.com/
- **类型**: RSS
- **RSS 链接**: http://rss.cnn.com/rss/edition.rss
- **分类**: 世界, 商业, 科技
- **更新频率**: 30 分钟
- **优先级**: 中

#### Reuters
- **网站**: https://www.reuters.com/
- **类型**: RSS
- **RSS 链接**: https://www.reutersagency.com/feed/
- **分类**: 商业, 科技
- **更新频率**: 1 小时
- **优先级**: 中

#### TechCrunch
- **网站**: https://techcrunch.com/
- **类型**: RSS
- **RSS 链接**: https://techcrunch.com/feed/
- **分类**: 科技, 创业
- **更新频率**: 1 小时
- **优先级**: 中

## 4. 数据获取方式

### 4.1 RSS 订阅（推荐）

**优点**:
- 标准化格式
- 结构化数据
- 合法合规
- 实现简单

**缺点**:
- 部分网站不提供完整内容
- 更新频率受限
- 部分网站已停止维护 RSS

**实现示例**:
```javascript
// 使用 rss-parser 库
const Parser = require('rss-parser');
const parser = new Parser();

const feed = await parser.parseURL('https://example.com/rss');
feed.items.forEach(item => {
  console.log(item.title);
  console.log(item.link);
  console.log(item.pubDate);
});
```

### 4.2 公开 API

**优点**:
- 官方支持
- 数据质量高
- 稳定性好

**缺点**:
- 需要申请 API Key
- 可能有调用频率限制
- 部分服务收费

**实现示例**:
```javascript
// 使用 News API (https://newsapi.org/)
const axios = require('axios');

const response = await axios.get('https://newsapi.org/v2/top-headlines', {
  params: {
    apiKey: 'YOUR_API_KEY',
    country: 'cn',
    category: 'technology'
  }
});
```

### 4.3 网页爬虫

**优点**:
- 可获取完整内容
- 灵活性高
- 适用于无 RSS/API 的网站

**缺点**:
- 需应对反爬虫机制
- 网站结构变化时需维护
- 法律风险（需遵守 robots.txt）

**实现示例**:
```javascript
// 使用 Cheerio 或 Puppeteer
const cheerio = require('cheerio');
const axios = require('axios');

const response = await axios.get('https://example.com');
const $ = cheerio.load(response.data);

$('.news-item').each((i, element) => {
  const title = $(element).find('.title').text();
  const link = $(element).find('a').attr('href');
  // 保存到数据库
});
```

**反爬虫策略**:
- 设置合理的请求间隔（2-5 秒）
- 使用代理 IP 池
- 设置 User-Agent
- 模拟真实用户行为
- 遵守 robots.txt

## 5. 数据格式规范

### 5.1 统一数据结构

```json
{
  "title": "新闻标题",
  "summary": "新闻摘要",
  "content": "完整内容",
  "author": "作者名称",
  "source": {
    "id": 1,
    "name": "新闻源名称",
    "url": "https://example.com"
  },
  "original_url": "https://example.com/news/123",
  "category": {
    "id": 1,
    "name": "科技",
    "slug": "tech"
  },
  "tags": ["AI", "科技", "创新"],
  "cover_image": "https://example.com/image.jpg",
  "published_at": "2025-12-28T00:00:00Z",
  "crawled_at": "2025-12-28T00:05:00Z"
}
```

### 5.2 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 新闻标题，最多 500 字符 |
| summary | string | 否 | 新闻摘要，最多 1000 字符 |
| content | text | 否 | 完整内容 |
| author | string | 否 | 作者名称 |
| source | object | 是 | 新闻源信息 |
| original_url | string | 是 | 原始文章链接 |
| category | object | 否 | 分类信息 |
| tags | array | 否 | 标签数组 |
| cover_image | string | 否 | 封面图片 URL |
| published_at | datetime | 是 | 发布时间 |
| crawled_at | datetime | 是 | 抓取时间 |

## 6. 新闻源配置示例

### 6.1 配置文件格式

```yaml
sources:
  - id: 1
    name: "新浪新闻"
    url: "https://news.sina.com.cn/"
    type: "rss"
    rss_url: "https://news.sina.com.cn/roll/index.d.html"
    category_mapping:
      "finance": "财经"
      "tech": "科技"
      "sports": "体育"
    priority: 10
    is_active: true
    crawl_frequency: 10  # 分钟

  - id: 2
    name: "36氪"
    url: "https://36kr.com/"
    type: "rss"
    rss_url: "https://36kr.com/feed"
    category_mapping:
      "tech": "科技"
      "startup": "创业"
    priority: 8
    is_active: true
    crawl_frequency: 30
```

### 6.2 数据库存储

```sql
INSERT INTO news_sources (name, url, type, config, priority, is_active, crawl_frequency)
VALUES (
  '新浪新闻',
  'https://news.sina.com.cn/',
  'rss',
  '{
    "rss_url": "https://news.sina.com.cn/roll/index.d.html",
    "category_mapping": {
      "finance": "财经",
      "tech": "科技"
    }
  }',
  10,
  true,
  10
);
```

## 7. 更新策略

### 7.1 抓取频率配置

| 新闻源类型 | 建议频率 | 说明 |
|-----------|---------|------|
| 综合门户 | 10-15 分钟 | 更新频繁 |
| 科技媒体 | 30-60 分钟 | 更新适中 |
| 财经媒体 | 15-30 分钟 | 实时性要求高 |
| 国际媒体 | 30-60 分钟 | 时差考虑 |

### 7.2 优先级配置

| 优先级 | 分值范围 | 新闻源 |
|--------|---------|--------|
| 高 | 8-10 | 主流门户、头部媒体 |
| 中 | 5-7 | 垂直媒体 |
| 低 | 1-4 | 备用新闻源 |

### 7.3 错误处理

- 连接失败：降低优先级，增加重试间隔
- 数据异常：记录日志，跳过该条新闻
- 频率限制：暂停该源，等待恢复
- 持续失败：禁用新闻源，发送告警

## 8. robots.txt 遵守

### 8.1 检查 robots.txt

```bash
# 查看 news.sina.com.cn 的 robots.txt
curl https://news.sina.com.cn/robots.txt
```

### 8.2 解析规则

```
User-agent: *
Disallow: /admin/
Disallow: /private/
Crawl-delay: 5

User-agent: NewsHub-Bot
Allow: /news/
```

### 8.3 实现示例

```javascript
const robotsParser = require('robots-parser');

const robots = robotsParser('https://example.com/robots.txt', robotsTxt);

if (robots.isAllowed('https://example.com/news/123', 'NewsHub-Bot')) {
  // 可以抓取
} else {
  // 跳过
}
```

## 9. 监控与维护

### 9.1 监控指标

- 新闻源可用性
- 抓取成功率
- 数据质量（完整度、准确度）
- 更新及时性
- 错误日志

### 9.2 维护任务

- 每日检查抓取日志
- 每周审查新闻源状态
- 每月更新新闻源列表
- 及时应对网站结构变化

## 10. 扩展新闻源

### 10.1 添加新新闻源步骤

1. 评估新闻源质量和可靠性
2. 检查是否提供 RSS/API
3. 阅读 robots.txt 和使用条款
4. 测试数据获取
5. 配置数据映射规则
6. 添加到数据库
7. 测试抓取流程
8. 启用新闻源

### 10.2 建议新增的新闻源

- 观察者网
- 环球网
- 参考消息网
- 钛媒体
- 极客公园
- 雷锋网
- 虎嗅网
- 品玩

---

**文档版本：** v1.0
**最后更新：** 2025-12-28
**维护者：** NewsHub Team

**注意**: 在使用爬虫抓取数据时，请务必遵守相关法律法规和网站的使用条款，尊重 robots.txt 规则。

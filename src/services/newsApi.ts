/**
 * 新闻 API 服务
 * 直接调用 orz.ai API 获取新闻数据
 */

// 平台 ID 映射到 API 参数
const PLATFORM_MAPPING: Record<string, string> = {
  // 社交媒体
  'weibo': 'weibo',
  'zhihu': 'zhihu',
  'douyin': 'douyin',
  'douban': 'douban',
  'bilibili': 'bilibili',
  
  // 科技媒体
  '36kr': '36kr',
  'sspai': 'shaoshupai',
  'juejin': 'juejin',
  'v2ex': 'v2ex',
  'github': 'github',
  'stackoverflow': 'stackoverflow',
  'hackernews': 'hackernews',
  '52pojie': '52pojie',
  
  // 财经媒体
  'sina_finance': 'sina_finance',
  'eastmoney': 'eastmoney',
  'xueqiu': 'xueqiu',
  'cls': 'cls',
  
  // 综合媒体
  'baidu': 'baidu',
  'toutiao': 'jinritoutiao',
  'qq': 'tenxunwang',
  
  // 其他
  'hupu': 'hupu',
  'tieba': 'tieba',
};

export interface NewsItem {
  title: string;
  url: string;
  content?: string;
  source?: string;
  publish_time?: string;
  hot_rank?: number;
}

interface ApiResponse {
  status: string;
  data: NewsItem[];
}

/**
 * 获取单个平台的新闻
 */
export async function fetchPlatformNews(
  platformId: string,
  limit: number = 20
): Promise<NewsItem[]> {
  const apiParam = PLATFORM_MAPPING[platformId];
  
  if (!apiParam) {
    console.warn(`平台 ${platformId} 没有对应的 API 参数`);
    return [];
  }

  try {
    const apiUrl = `https://orz.ai/api/v1/dailynews/?platform=${apiParam}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`获取 ${platformId} 新闻失败: ${response.status}`);
      return [];
    }

    const apiData: ApiResponse = await response.json();
    
    if (apiData.status !== '200' || !apiData.data || !Array.isArray(apiData.data)) {
      console.error(`${platformId} 返回数据格式错误:`, apiData);
      return [];
    }

    // 限制返回数量并添加排名
    const newsItems = apiData.data.slice(0, limit).map((item, index) => ({
      ...item,
      hot_rank: index + 1,
    }));

    return newsItems;
  } catch (error) {
    console.error(`获取 ${platformId} 新闻时出错:`, error);
    return [];
  }
}

/**
 * 批量获取多个平台的新闻
 */
export async function fetchMultiplePlatformsNews(
  platformIds: string[],
  limit: number = 20
): Promise<Record<string, NewsItem[]>> {
  const results: Record<string, NewsItem[]> = {};

  // 并发获取所有平台的新闻
  const promises = platformIds.map(async (platformId) => {
    const news = await fetchPlatformNews(platformId, limit);
    return { platformId, news };
  });

  const responses = await Promise.allSettled(promises);

  responses.forEach((response) => {
    if (response.status === 'fulfilled') {
      const { platformId, news } = response.value;
      results[platformId] = news;
    }
  });

  return results;
}

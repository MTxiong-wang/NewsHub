/**
 * hot_news API 服务
 * 从 orz.ai 获取热点新闻数据
 */

export interface HotNewsItem {
  title: string;
  url: string;
  score: string;
  desc: string;
}

export interface HotNewsResponse {
  status: string;
  data: HotNewsItem[];
  msg: string;
}

// 支持的22个平台代码
export const PLATFORMS = {
  // 社交媒体
  WEIBO: 'weibo',
  ZHIHU: 'zhihu',
  DOUYIN: 'douyin',
  DOUBAN: 'douban',
  BILIBILI: 'bilibili',

  // 科技媒体
  TSKR: 'tskr', // 36氪
  SSPAI: 'sspai', // 少数派
  JUEJIN: 'juejin',
  VTEX: 'vtex', // V2EX
  GITHUB: 'github',
  STACKOVERFLOW: 'stackoverflow',
  HACKERNEWS: 'hackernews',
  FTPOJIE: 'ftpojie', // 吾爱破解

  // 财经媒体
  SINA_FINANCE: 'sina_finance',
  EASTMONEY: 'eastmoney',
  XUEQIU: 'xueqiu',
  CLS: 'cls', // 财联社

  // 综合媒体
  BAIDU: 'baidu',
  JINRITOUTIAO: 'jinritoutiao',
  TENXUNWANG: 'tenxunwang',

  // 其他
  HUPU: 'hupu',
  TIEBA: 'tieba',
} as const;

export type PlatformCode = typeof PLATFORMS[keyof typeof PLATFORMS];

// 平台信息映射
export const PLATFORM_INFO: Record<PlatformCode, { name: string; category: string }> = {
  [PLATFORMS.WEIBO]: { name: '微博热搜', category: 'social' },
  [PLATFORMS.ZHIHU]: { name: '知乎热榜', category: 'social' },
  [PLATFORMS.DOUYIN]: { name: '抖音热点', category: 'social' },
  [PLATFORMS.DOUBAN]: { name: '豆瓣', category: 'social' },
  [PLATFORMS.BILIBILI]: { name: '哔哩哔哩', category: 'social' },
  [PLATFORMS.TSKR]: { name: '36氪', category: 'tech' },
  [PLATFORMS.SSPAI]: { name: '少数派', category: 'tech' },
  [PLATFORMS.JUEJIN]: { name: '掘金', category: 'tech' },
  [PLATFORMS.VTEX]: { name: 'V2EX', category: 'tech' },
  [PLATFORMS.GITHUB]: { name: 'GitHub Trending', category: 'tech' },
  [PLATFORMS.STACKOVERFLOW]: { name: 'Stack Overflow', category: 'tech' },
  [PLATFORMS.HACKERNEWS]: { name: 'Hacker News', category: 'tech' },
  [PLATFORMS.FTPOJIE]: { name: '吾爱破解', category: 'tech' },
  [PLATFORMS.SINA_FINANCE]: { name: '新浪财经', category: 'finance' },
  [PLATFORMS.EASTMONEY]: { name: '东方财富', category: 'finance' },
  [PLATFORMS.XUEQIU]: { name: '雪球', category: 'finance' },
  [PLATFORMS.CLS]: { name: '财联社', category: 'finance' },
  [PLATFORMS.BAIDU]: { name: '百度热搜', category: 'general' },
  [PLATFORMS.JINRITOUTIAO]: { name: '今日头条', category: 'general' },
  [PLATFORMS.TENXUNWANG]: { name: '腾讯网', category: 'general' },
  [PLATFORMS.HUPU]: { name: '虎扑', category: 'other' },
  [PLATFORMS.TIEBA]: { name: '百度贴吧', category: 'other' },
};

const API_BASE_URL = 'https://orz.ai/api/v1/dailynews/';

/**
 * 获取单个平台的热点新闻
 * @param platform 平台代码
 * @returns 热点新闻列表
 */
export async function getHotNews(platform: PlatformCode): Promise<HotNewsItem[]> {
  try {
    const url = `${API_BASE_URL}?platform=${platform}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result: HotNewsResponse = await response.json();

    if (result.status === '200' && result.data) {
      return result.data;
    }

    console.error('API Error:', result.msg);
    return [];
  } catch (error) {
    console.error(`Failed to fetch hot news for ${platform}:`, error);
    return [];
  }
}

/**
 * 获取多个平台的热点新闻
 * @param platforms 平台代码数组
 * @returns 平台到热点新闻的映射
 */
export async function getMultipleHotNews(
  platforms: PlatformCode[]
): Promise<Record<PlatformCode, HotNewsItem[]>> {
  const results: Record<string, HotNewsItem[]> = {};

  // 使用 Promise.all 并行请求
  const promises = platforms.map(async (platform) => {
    const news = await getHotNews(platform);
    return { platform, news };
  });

  const responses = await Promise.all(promises);

  responses.forEach(({ platform, news }) => {
    results[platform] = news;
  });

  return results as Record<PlatformCode, HotNewsItem[]>;
}

/**
 * 获取所有平台的热点新闻
 * @returns 所有平台的热点新闻
 */
export async function getAllHotNews(): Promise<Record<PlatformCode, HotNewsItem[]>> {
  const allPlatforms = Object.values(PLATFORMS) as PlatformCode[];
  return getMultipleHotNews(allPlatforms);
}

/**
 * 根据分类获取平台列表
 * @param category 分类 (social, tech, finance, general, other)
 * @returns 该分类的平台代码列表
 */
export function getPlatformsByCategory(category: string): PlatformCode[] {
  return Object.entries(PLATFORM_INFO)
    .filter(([_, info]) => info.category === category)
    .map(([code, _]) => code as PlatformCode);
}

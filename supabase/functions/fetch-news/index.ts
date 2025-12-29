import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  title: string;
  url: string;
  mobileUrl?: string;
  content?: string;
  source?: string;
  publish_time?: string;
}

interface ApiResponse {
  status: string;
  data: NewsItem[];
}

// 平台 ID 映射到 API 参数（根据 orz.ai API 实际测试结果）
const PLATFORM_MAPPING: Record<string, string> = {
  // 社交媒体
  'weibo': 'weibo',
  'zhihu': 'zhihu',
  'douyin': 'douyin',
  'douban': 'douban',           // 修正：从 douban-group 改为 douban
  'bilibili': 'bilibili',
  
  // 科技媒体
  '36kr': '36kr',
  'sspai': 'shaoshupai',        // 修正：从 sspai 改为 shaoshupai
  'juejin': 'juejin',
  'v2ex': 'v2ex',
  'github': 'github',           // 修正：从 github-trending 改为 github
  'stackoverflow': 'stackoverflow',
  'hackernews': 'hackernews',
  '52pojie': '52pojie',
  
  // 财经媒体（使用下划线，与数据库 ID 一致）
  'sina_finance': 'sina_finance',
  'eastmoney': 'eastmoney',
  'xueqiu': 'xueqiu',
  'cls': 'cls',
  
  // 综合媒体
  'baidu': 'baidu',
  'toutiao': 'jinritoutiao',    // 修正：从 toutiao 改为 jinritoutiao
  'qq': 'qq',                   // 注意：此 API 响应较慢，可能超时
  
  // 其他
  'hupu': 'hupu',
  'tieba': 'tieba',
};

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 获取系统配置：每个信源获取的新闻数量
    const { data: configData } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'news_fetch_limit')
      .maybeSingle();
    
    const fetchLimit = configData ? parseInt(configData.value) : 20;
    console.log(`每个信源获取新闻数量: ${fetchLimit}`);

    // 获取请求参数
    const { platforms, category } = await req.json().catch(() => ({ platforms: null, category: null }));

    // 获取启用的平台列表
    let platformsToFetch;
    if (platforms && Array.isArray(platforms) && platforms.length > 0) {
      // 如果指定了平台列表，只获取这些平台
      const { data: selectedPlatforms } = await supabase
        .from('platforms')
        .select('*')
        .in('id', platforms)
        .eq('enabled', true);
      platformsToFetch = selectedPlatforms || [];
    } else if (category) {
      // 如果指定了分类，获取该分类下的所有平台
      const { data: categoryPlatforms } = await supabase
        .from('platforms')
        .select('*')
        .eq('category', category)
        .eq('enabled', true);
      platformsToFetch = categoryPlatforms || [];
    } else {
      // 否则获取所有启用的平台
      const { data: allPlatforms } = await supabase
        .from('platforms')
        .select('*')
        .eq('enabled', true);
      platformsToFetch = allPlatforms || [];
    }

    console.log(`准备获取 ${platformsToFetch.length} 个平台的新闻`);

    let totalInserted = 0;
    let totalFailed = 0;
    const failedPlatforms: string[] = [];

    // 遍历每个平台获取新闻
    for (const platform of platformsToFetch) {
      const apiParam = PLATFORM_MAPPING[platform.id];
      if (!apiParam) {
        console.log(`平台 ${platform.name} (${platform.id}) 没有对应的 API 参数，跳过`);
        totalFailed++;
        failedPlatforms.push(`${platform.name}(无映射)`);
        continue;
      }

      try {
        console.log(`正在获取 ${platform.name} 的新闻，API参数: ${apiParam}`);
        
        // 调用外部 API（使用查询参数格式）
        const apiUrl = `https://orz.ai/api/v1/dailynews/?platform=${apiParam}`;
        console.log(`API URL: ${apiUrl}`);
        
        // 设置 30 秒超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
          console.error(`获取 ${platform.name} 失败: ${response.status}`);
          totalFailed++;
          failedPlatforms.push(`${platform.name}(HTTP ${response.status})`);
          continue;
        }

        const apiData: ApiResponse = await response.json();
        
        if (apiData.status !== '200' || !apiData.data || !Array.isArray(apiData.data)) {
          console.error(`${platform.name} 返回数据格式错误:`, apiData);
          totalFailed++;
          failedPlatforms.push(`${platform.name}(数据格式错误)`);
          continue;
        }

        // 限制获取数量
        const newsItems = apiData.data.slice(0, fetchLimit);
        console.log(`${platform.name} 获取到 ${newsItems.length} 条新闻`);

        if (newsItems.length === 0) {
          console.log(`${platform.name} 没有新闻数据`);
          continue;
        }

        // 准备插入的新闻数据（不做去重，直接插入全量）
        const currentTime = new Date();
        const currentDate = currentTime.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const newsToInsert = newsItems.map((item, index) => ({
          platform_id: platform.id,
          title: item.title,
          url: item.url,
          api_score: 100 - index,        // API 评分
          final_score: 100 - index,      // 最终评分
          hot_rank: index + 1,           // 热度排名
          content_snippet: item.content || null,
          image_url: null,
          published_at: item.publish_time ? new Date(item.publish_time).toISOString() : currentTime.toISOString(),
          fetched_at: currentTime.toISOString(),
          fetched_date: currentDate,
        }));

        // 先删除该平台当天的旧新闻（避免唯一约束冲突）
        const { error: deleteError } = await supabase
          .from('news')
          .delete()
          .eq('platform_id', platform.id)
          .eq('fetched_date', currentDate);
        
        if (deleteError) {
          console.error(`删除 ${platform.name} 旧新闻失败:`, deleteError);
        }

        // 插入新新闻
        const { error: insertError } = await supabase
          .from('news')
          .insert(newsToInsert);

        if (insertError) {
          console.error(`插入 ${platform.name} 新闻失败:`, insertError);
          console.error(`错误详情 - 代码: ${insertError.code}, 消息: ${insertError.message}`);
          console.error(`尝试插入的数据样本:`, JSON.stringify(newsToInsert[0]));
          totalFailed++;
          failedPlatforms.push(`${platform.name}(插入失败: ${insertError.message})`);
        } else {
          console.log(`成功插入 ${platform.name} 的 ${newsToInsert.length} 条新闻`);
          totalInserted += newsToInsert.length;
        }

      } catch (error) {
        const errorMsg = error.name === 'AbortError' ? '请求超时' : error.message;
        console.error(`处理 ${platform.name} 时出错:`, errorMsg);
        totalFailed++;
        failedPlatforms.push(`${platform.name}(${errorMsg})`);
      }
    }

    const message = totalFailed > 0
      ? `成功获取新闻，插入 ${totalInserted} 条，失败 ${totalFailed} 个平台: ${failedPlatforms.join(', ')}`
      : `成功获取新闻，插入 ${totalInserted} 条`;

    return new Response(
      JSON.stringify({
        success: true,
        message,
        totalInserted,
        totalFailed,
        failedPlatforms,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

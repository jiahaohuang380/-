import { supabase } from './supabase';
import type { SKUData, ReviewData, SKUAnalysis, UploadBatch, DashboardStats } from '@/types';

/**
 * 创建上传批次
 */
export async function createUploadBatch(batchName: string): Promise<string> {
  const { data, error } = await supabase
    .from('upload_batches')
    .insert({
      batch_name: batchName,
      sku_count: 0,
      review_count: 0,
      status: 'processing',
    })
    .select('id')
    .maybeSingle();
  
  if (error) throw error;
  return data?.id || '';
}

/**
 * 更新上传批次
 */
export async function updateUploadBatch(
  batchId: string,
  updates: Partial<UploadBatch>
): Promise<void> {
  const { error } = await supabase
    .from('upload_batches')
    .update(updates)
    .eq('id', batchId);
  
  if (error) throw error;
}

/**
 * 清空所有数据（用于重新加载样本数据）
 */
export async function clearAllData(): Promise<void> {
  console.log('开始清空所有数据...');
  
  // 1. 删除分析结果
  const { error: analysisError } = await supabase
    .from('sku_analysis')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // 删除所有记录
  
  if (analysisError) {
    console.error('删除分析结果错误:', analysisError);
    throw analysisError;
  }
  console.log('已删除所有分析结果');
  
  // 2. 删除评论数据
  const { error: reviewError } = await supabase
    .from('review_data')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (reviewError) {
    console.error('删除评论数据错误:', reviewError);
    throw reviewError;
  }
  console.log('已删除所有评论数据');
  
  // 3. 删除SKU数据
  const { error: skuError } = await supabase
    .from('sku_data')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (skuError) {
    console.error('删除SKU数据错误:', skuError);
    throw skuError;
  }
  console.log('已删除所有SKU数据');
  
  // 4. 删除上传批次
  const { error: batchError } = await supabase
    .from('upload_batches')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (batchError) {
    console.error('删除上传批次错误:', batchError);
    throw batchError;
  }
  console.log('已删除所有上传批次');
  
  console.log('所有数据清空完成');
}

/**
 * 批量插入SKU数据
 */
export async function insertSKUData(skuDataList: SKUData[]): Promise<SKUData[]> {
  console.log('准备插入SKU数据:', skuDataList.length, '条');
  console.log('SKU数据样例:', skuDataList.slice(0, 2));
  
  const { data, error } = await supabase
    .from('sku_data')
    .insert(skuDataList)
    .select();
  
  if (error) {
    console.error('插入SKU数据错误:', error);
    throw error;
  }
  
  const result = Array.isArray(data) ? data : [];
  console.log('插入SKU数据成功:', result.length, '条');
  console.log('插入后的SKU数据样例:', result.slice(0, 2));
  return result;
}

/**
 * 批量插入评论数据
 */
export async function insertReviewData(reviewDataList: ReviewData[]): Promise<void> {
  const { error } = await supabase
    .from('review_data')
    .insert(reviewDataList);
  
  if (error) throw error;
}

/**
 * 批量插入SKU分析结果
 */
export async function insertSKUAnalysis(analysisList: SKUAnalysis[]): Promise<void> {
  console.log('准备插入SKU分析结果:', analysisList.length, '条');
  console.log('分析结果样例:', analysisList.slice(0, 2));
  
  const { error } = await supabase
    .from('sku_analysis')
    .insert(analysisList);
  
  if (error) {
    console.error('插入SKU分析结果错误:', error);
    throw error;
  }
  console.log('插入SKU分析结果成功');
}

/**
 * 获取所有SKU分析结果
 */
export async function getAllSKUAnalysis(): Promise<SKUAnalysis[]> {
  console.log('查询所有SKU分析结果...');
  const { data, error } = await supabase
    .from('sku_analysis')
    .select('*')
    .order('health_score', { ascending: false });
  
  if (error) {
    console.error('查询所有SKU分析结果错误:', error);
    throw error;
  }
  const result = Array.isArray(data) ? data : [];
  console.log('查询到的SKU分析结果数量:', result.length);
  if (result.length > 0) {
    console.log('前3条SKU分析结果:', result.slice(0, 3));
  }
  return result;
}

/**
 * 根据SKU获取分析结果
 */
export async function getSKUAnalysisBySKU(sku: string): Promise<SKUAnalysis | null> {
  console.log('查询SKU分析结果:', sku);
  const { data, error } = await supabase
    .from('sku_analysis')
    .select('*')
    .eq('sku', sku)
    .maybeSingle();
  
  if (error) {
    console.error('查询SKU分析结果错误:', error);
    throw error;
  }
  console.log('查询到的SKU分析结果:', data);
  return data;
}

/**
 * 获取SKU数据
 */
export async function getSKUData(sku: string): Promise<SKUData | null> {
  console.log('查询SKU数据:', sku);
  const { data, error } = await supabase
    .from('sku_data')
    .select('*')
    .eq('sku', sku)
    .maybeSingle();
  
  if (error) {
    console.error('查询SKU数据错误:', error);
    throw error;
  }
  console.log('查询到的SKU数据:', data);
  return data;
}

/**
 * 获取Dashboard统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data: analyses, error } = await supabase
    .from('sku_analysis')
    .select('*');
  
  if (error) throw error;
  
  const analysisList = Array.isArray(analyses) ? analyses : [];
  
  // 获取SKU数据用于计算收入分布
  const { data: skuData } = await supabase
    .from('sku_data')
    .select('sku, sales');
  
  const skuDataList = Array.isArray(skuData) ? skuData : [];
  const skuSalesMap = new Map(skuDataList.map(s => [s.sku, s.sales]));
  
  const stats: DashboardStats = {
    total_skus: analysisList.length,
    avg_health_score: analysisList.length > 0
      ? Math.round(analysisList.reduce((sum, a) => sum + a.health_score, 0) / analysisList.length)
      : 0,
    keep_count: analysisList.filter(a => a.action_tier === 'Keep').length,
    optimize_count: analysisList.filter(a => a.action_tier === 'Optimize').length,
    test_count: analysisList.filter(a => a.action_tier === 'Test').length,
    cut_count: analysisList.filter(a => a.action_tier === 'Cut').length,
    negative_profit_count: analysisList.filter(a => a.net_margin < 0).length,
    anomaly_count: analysisList.filter(a => a.anomaly_flags.length > 0).length,
    revenue_by_tier: {
      A: analysisList
        .filter(a => a.abc_tier === 'A')
        .reduce((sum, a) => sum + (skuSalesMap.get(a.sku) || 0), 0),
      B: analysisList
        .filter(a => a.abc_tier === 'B')
        .reduce((sum, a) => sum + (skuSalesMap.get(a.sku) || 0), 0),
      C: analysisList
        .filter(a => a.abc_tier === 'C')
        .reduce((sum, a) => sum + (skuSalesMap.get(a.sku) || 0), 0),
    },
  };
  
  return stats;
}


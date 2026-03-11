import { useState, useCallback } from 'react';
import { generateSampleSKUData, generateSampleReviewData } from '@/lib/sample-data';
import { SKUAnalyzer } from '@/lib/sku-analyzer';
import {
  clearAllData,
  createUploadBatch,
  updateUploadBatch,
  insertSKUData,
  insertReviewData,
  insertSKUAnalysis,
} from '@/db/api';

export function useSampleData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSampleData = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('开始加载样本数据...');
      
      // 0. 先清空所有旧数据
      await clearAllData();
      console.log('旧数据已清空');
      
      // 1. 创建上传批次
      const batchId = await createUploadBatch(`样本数据 ${new Date().toLocaleString()}`);
      console.log('创建批次ID:', batchId);

      // 2. 生成样本数据
      const skuDataList = generateSampleSKUData().map(sku => ({
        ...sku,
        upload_batch_id: batchId,
      }));

      const reviewDataList = generateSampleReviewData().map(review => ({
        ...review,
        upload_batch_id: batchId,
      }));

      console.log('生成SKU数据:', skuDataList.length, '条');
      console.log('生成评论数据:', reviewDataList.length, '条');

      // 3. 插入SKU数据
      const insertedSKUData = await insertSKUData(skuDataList);
      console.log('插入SKU数据成功:', insertedSKUData.length, '条');
      console.log('插入的SKU数据样例:', insertedSKUData.slice(0, 2));

      // 4. 插入评论数据
      await insertReviewData(reviewDataList);
      console.log('插入评论数据成功');

      // 5. 执行SKU分析
      const analyzer = new SKUAnalyzer(insertedSKUData, reviewDataList);
      const analysisList = analyzer.analyzeAll();
      console.log('分析结果:', analysisList.length, '条');
      console.log('分析结果样例:', analysisList.slice(0, 2));

      // 6. 插入分析结果
      await insertSKUAnalysis(analysisList);
      console.log('插入分析结果成功');

      // 7. 更新批次状态
      await updateUploadBatch(batchId, {
        sku_count: skuDataList.length,
        review_count: reviewDataList.length,
        status: 'completed',
      });

      console.log('样本数据加载完成!');
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('加载样本数据失败:', err);
      setError(err instanceof Error ? err.message : '加载样本数据失败');
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    loadSampleData,
    isLoading,
    error,
  };
}

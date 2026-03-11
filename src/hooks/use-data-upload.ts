import { useState, useCallback } from 'react';
import { readFileContent, parseSKUDataCSV, parseReviewDataCSV } from '@/lib/csv-parser';
import { SKUAnalyzer } from '@/lib/sku-analyzer';
import {
  createUploadBatch,
  updateUploadBatch,
  insertSKUData,
  insertReviewData,
  insertSKUAnalysis,
} from '@/db/api';
import type { SKUData, ReviewData } from '@/types';

export function useDataUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadData = useCallback(async (
    skuFile: File | null,
    reviewFile: File | null
  ): Promise<boolean> => {
    if (!skuFile) {
      setError('请上传SKU成本数据文件');
      return false;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // 1. 创建上传批次
      setUploadProgress(10);
      const batchId = await createUploadBatch(`Upload ${new Date().toLocaleString()}`);

      // 2. 读取并解析SKU数据
      setUploadProgress(20);
      const skuContent = await readFileContent(skuFile);
      const skuDataList: SKUData[] = parseSKUDataCSV(skuContent).map(sku => ({
        ...sku,
        upload_batch_id: batchId,
      }));

      if (skuDataList.length === 0) {
        throw new Error('SKU数据文件为空或格式不正确');
      }

      // 3. 读取并解析评论数据(可选)
      setUploadProgress(30);
      let reviewDataList: ReviewData[] = [];
      if (reviewFile) {
        const reviewContent = await readFileContent(reviewFile);
        reviewDataList = parseReviewDataCSV(reviewContent).map(review => ({
          ...review,
          upload_batch_id: batchId,
        }));
      }

      // 4. 插入SKU数据
      setUploadProgress(40);
      const insertedSKUData = await insertSKUData(skuDataList);

      // 5. 插入评论数据
      setUploadProgress(50);
      if (reviewDataList.length > 0) {
        await insertReviewData(reviewDataList);
      }

      // 6. 执行SKU分析
      setUploadProgress(60);
      const analyzer = new SKUAnalyzer(insertedSKUData, reviewDataList);
      const analysisList = analyzer.analyzeAll();

      // 7. 插入分析结果
      setUploadProgress(80);
      await insertSKUAnalysis(analysisList);

      // 8. 更新批次状态
      setUploadProgress(90);
      await updateUploadBatch(batchId, {
        sku_count: skuDataList.length,
        review_count: reviewDataList.length,
        status: 'completed',
      });

      setUploadProgress(100);
      setIsUploading(false);
      return true;
    } catch (err) {
      console.error('上传失败:', err);
      setError(err instanceof Error ? err.message : '上传失败');
      setIsUploading(false);
      return false;
    }
  }, []);

  return {
    uploadData,
    isUploading,
    uploadProgress,
    error,
  };
}

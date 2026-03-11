// SKU成本数据类型
export interface SKUData {
  id?: string;
  sku: string;
  price: number;
  units_sold: number;
  sales: number;
  referral_fee: number;
  fba_fee: number;
  storage_fee: number;
  ad_spend: number;
  cogs: number;
  net_proceeds: number;
  upload_batch_id?: string;
  created_at?: string;
  updated_at?: string;
}

// 评论数据类型
export interface ReviewData {
  id?: string;
  asin: string;
  rating: number;
  review_text: string;
  upload_batch_id?: string;
  created_at?: string;
}

// SKU分析结果类型
export interface SKUAnalysis {
  id?: string;
  sku_data_id?: string;
  sku: string;
  
  // 计算指标
  net_margin: number;
  acos: number;
  unit_profit: number;
  total_fees: number;
  revenue_share: number;
  
  // 评分
  health_score: number;
  sales_score: number;
  profit_score: number;
  ad_efficiency_score: number;
  customer_sentiment_score: number;
  
  // 分类
  abc_tier: 'A' | 'B' | 'C';
  action_tier: 'Keep' | 'Optimize' | 'Test' | 'Cut';
  
  // 异常标记
  anomaly_flags: string[];
  
  // AI建议
  ai_recommendations: string[];
  
  created_at?: string;
  updated_at?: string;
}

// 上传批次类型
export interface UploadBatch {
  id?: string;
  batch_name: string;
  sku_count: number;
  review_count: number;
  status: string;
  created_at?: string;
}

// CSV上传数据类型
export interface CSVUploadData {
  skuData: SKUData[];
  reviewData: ReviewData[];
}

// Dashboard统计数据类型
export interface DashboardStats {
  total_skus: number;
  avg_health_score: number;
  keep_count: number;
  optimize_count: number;
  test_count: number;
  cut_count: number;
  negative_profit_count: number;
  anomaly_count: number;
  revenue_by_tier: {
    A: number;
    B: number;
    C: number;
  };
}

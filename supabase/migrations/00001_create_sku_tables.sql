-- SKU成本数据表
CREATE TABLE sku_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  price DECIMAL(10, 2),
  units_sold INTEGER,
  sales DECIMAL(10, 2),
  referral_fee DECIMAL(10, 2),
  fba_fee DECIMAL(10, 2),
  storage_fee DECIMAL(10, 2),
  ad_spend DECIMAL(10, 2),
  cogs DECIMAL(10, 2),
  net_proceeds DECIMAL(10, 2),
  upload_batch_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论数据表
CREATE TABLE review_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asin TEXT NOT NULL,
  rating DECIMAL(2, 1),
  review_text TEXT,
  upload_batch_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKU分析结果表
CREATE TABLE sku_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_data_id UUID REFERENCES sku_data(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  
  -- 计算指标
  net_margin DECIMAL(5, 2),
  acos DECIMAL(5, 2),
  unit_profit DECIMAL(10, 2),
  total_fees DECIMAL(10, 2),
  revenue_share DECIMAL(5, 2),
  
  -- 评分
  health_score INTEGER,
  sales_score INTEGER,
  profit_score INTEGER,
  ad_efficiency_score INTEGER,
  customer_sentiment_score INTEGER,
  
  -- 分类
  abc_tier TEXT CHECK (abc_tier IN ('A', 'B', 'C')),
  action_tier TEXT CHECK (action_tier IN ('Keep', 'Optimize', 'Test', 'Cut')),
  
  -- 异常标记
  anomaly_flags TEXT[],
  
  -- AI建议
  ai_recommendations TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 上传批次表
CREATE TABLE upload_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT,
  sku_count INTEGER,
  review_count INTEGER,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_sku_data_sku ON sku_data(sku);
CREATE INDEX idx_review_data_asin ON review_data(asin);
CREATE INDEX idx_sku_analysis_sku ON sku_analysis(sku);
CREATE INDEX idx_sku_analysis_action_tier ON sku_analysis(action_tier);
CREATE INDEX idx_sku_analysis_abc_tier ON sku_analysis(abc_tier);

-- RLS策略 - 公开访问(无需登录)
ALTER TABLE sku_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on sku_data" ON sku_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sku_data" ON sku_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on sku_data" ON sku_data FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on sku_data" ON sku_data FOR DELETE USING (true);

CREATE POLICY "Allow public read access on review_data" ON review_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on review_data" ON review_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on review_data" ON review_data FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on review_data" ON review_data FOR DELETE USING (true);

CREATE POLICY "Allow public read access on sku_analysis" ON sku_analysis FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on sku_analysis" ON sku_analysis FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on sku_analysis" ON sku_analysis FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on sku_analysis" ON sku_analysis FOR DELETE USING (true);

CREATE POLICY "Allow public read access on upload_batches" ON upload_batches FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on upload_batches" ON upload_batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on upload_batches" ON upload_batches FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on upload_batches" ON upload_batches FOR DELETE USING (true);
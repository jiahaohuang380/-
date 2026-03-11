import type { SKUData, ReviewData, SKUAnalysis } from '@/types';

/**
 * SKU分析引擎
 */
export class SKUAnalyzer {
  private skuDataList: SKUData[];
  private reviewDataMap: Map<string, ReviewData[]>;
  
  constructor(skuDataList: SKUData[], reviewDataList: ReviewData[]) {
    this.skuDataList = skuDataList;
    this.reviewDataMap = this.groupReviewsByASIN(reviewDataList);
  }
  
  /**
   * 按ASIN分组评论数据
   */
  private groupReviewsByASIN(reviewDataList: ReviewData[]): Map<string, ReviewData[]> {
    const map = new Map<string, ReviewData[]>();
    reviewDataList.forEach(review => {
      const existing = map.get(review.asin) || [];
      existing.push(review);
      map.set(review.asin, existing);
    });
    return map;
  }
  
  /**
   * 分析所有SKU
   */
  public analyzeAll(): SKUAnalysis[] {
    // 计算总收入用于revenue share
    const totalRevenue = this.skuDataList.reduce((sum, sku) => sum + sku.sales, 0);
    
    // 分析每个SKU
    const analyses = this.skuDataList.map(sku => this.analyzeSKU(sku, totalRevenue));
    
    // 应用ABC分类
    this.applyABCClassification(analyses);
    
    return analyses;
  }
  
  /**
   * 分析单个SKU
   */
  private analyzeSKU(sku: SKUData, totalRevenue: number): SKUAnalysis {
    // 计算基础指标
    const total_fees = sku.referral_fee + sku.fba_fee + sku.storage_fee;
    const unit_profit = sku.price - sku.cogs - (total_fees / Math.max(sku.units_sold, 1)) - (sku.ad_spend / Math.max(sku.units_sold, 1));
    const net_margin = sku.sales > 0 ? ((sku.net_proceeds / sku.sales) * 100) : 0;
    const acos = sku.sales > 0 ? ((sku.ad_spend / sku.sales) * 100) : 0;
    const revenue_share = totalRevenue > 0 ? ((sku.sales / totalRevenue) * 100) : 0;
    
    // 计算各项评分
    const sales_score = this.calculateSalesScore(sku);
    const profit_score = this.calculateProfitScore(net_margin, unit_profit);
    const ad_efficiency_score = this.calculateAdEfficiencyScore(acos);
    const customer_sentiment_score = this.calculateCustomerSentimentScore(sku.sku);
    
    // 计算综合健康度评分
    const health_score = Math.round(
      sales_score * 0.3 +
      profit_score * 0.35 +
      ad_efficiency_score * 0.25 +
      customer_sentiment_score * 0.1
    );
    
    // 检测异常
    const anomaly_flags = this.detectAnomalies(sku, net_margin, acos);
    
    // 确定策略分类 - 传入profit_score
    const action_tier = this.determineActionTier(health_score, net_margin, sales_score, profit_score);
    
    // 生成AI建议
    const ai_recommendations = this.generateRecommendations(sku, net_margin, acos, action_tier);
    
    return {
      sku_data_id: sku.id,
      sku: sku.sku,
      net_margin,
      acos,
      unit_profit,
      total_fees,
      revenue_share,
      health_score,
      sales_score,
      profit_score,
      ad_efficiency_score,
      customer_sentiment_score,
      abc_tier: 'C', // 将在applyABCClassification中更新
      action_tier,
      anomaly_flags,
      ai_recommendations,
    };
  }
  
  /**
   * 计算销售评分
   */
  private calculateSalesScore(sku: SKUData): number {
    const revenue = sku.sales;
    const units = sku.units_sold;
    
    // 基于收入和销量的评分
    let score = 0;
    
    if (revenue > 10000) score += 50;
    else if (revenue > 5000) score += 35;
    else if (revenue > 1000) score += 20;
    else score += 10;
    
    if (units > 100) score += 50;
    else if (units > 50) score += 35;
    else if (units > 20) score += 20;
    else score += 10;
    
    return Math.min(score, 100);
  }
  
  /**
   * 计算利润评分
   */
  private calculateProfitScore(netMargin: number, unitProfit: number): number {
    let score = 0;
    
    // 净利润率评分
    if (netMargin > 30) score += 60;
    else if (netMargin > 20) score += 45;
    else if (netMargin > 10) score += 30;
    else if (netMargin > 0) score += 15;
    else score += 0;
    
    // 单件利润评分
    if (unitProfit > 10) score += 40;
    else if (unitProfit > 5) score += 30;
    else if (unitProfit > 2) score += 20;
    else if (unitProfit > 0) score += 10;
    else score += 0;
    
    return Math.min(score, 100);
  }
  
  /**
   * 计算广告效率评分
   */
  private calculateAdEfficiencyScore(acos: number): number {
    if (acos === 0) return 100; // 无广告支出
    if (acos < 15) return 100;
    if (acos < 25) return 80;
    if (acos < 35) return 60;
    if (acos < 50) return 40;
    return 20;
  }
  
  /**
   * 计算客户情绪评分
   */
  private calculateCustomerSentimentScore(sku: string): number {
    // 尝试用SKU或ASIN查找评论
    let reviews = this.reviewDataMap.get(sku) || [];
    
    // 如果用SKU找不到，尝试用ASIN格式查找
    if (reviews.length === 0) {
      // 尝试各种可能的ASIN格式
      for (const [key, value] of this.reviewDataMap.entries()) {
        if (key.includes(sku) || sku.includes(key)) {
          reviews = value;
          break;
        }
      }
    }
    
    if (reviews.length === 0) return 70; // 默认中等评分
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    if (avgRating >= 4.5) return 100;
    if (avgRating >= 4.0) return 85;
    if (avgRating >= 3.5) return 70;
    if (avgRating >= 3.0) return 50;
    return 30;
  }
  
  /**
   * 检测异常
   */
  private detectAnomalies(sku: SKUData, netMargin: number, acos: number): string[] {
    const flags: string[] = [];
    
    if (netMargin < 0) flags.push('负利润');
    if (acos > 50) flags.push('高ACOS');
    if (sku.units_sold < 5) flags.push('低销量');
    if (sku.storage_fee > sku.sales * 0.1) flags.push('高仓储费');
    
    return flags;
  }
  
  /**
   * 确定策略分类 - 基于Sales Score和Profit Score的象限
   */
  private determineActionTier(
    healthScore: number,
    netMargin: number,
    salesScore: number,
    profitScore: number
  ): 'Keep' | 'Optimize' | 'Test' | 'Cut' {
    // 基于象限位置确定策略
    // 右上角（高销售、高利润）：Keep
    // 左上角（低销售、高利润）：Optimize
    // 右下角（高销售、低利润）：Test
    // 左下角（低销售、低利润）：Cut
    
    const highSales = salesScore >= 50;
    const highProfit = profitScore >= 50;
    
    if (highSales && highProfit) {
      return 'Keep'; // 右上角：高销售、高利润
    } else if (!highSales && highProfit) {
      return 'Optimize'; // 左上角：低销售、高利润
    } else if (highSales && !highProfit) {
      return 'Test'; // 右下角：高销售、低利润
    } else {
      return 'Cut'; // 左下角：低销售、低利润
    }
  }
  
  /**
   * 生成AI建议
   */
  private generateRecommendations(
    sku: SKUData,
    netMargin: number,
    acos: number,
    actionTier: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (actionTier === 'Keep') {
      recommendations.push('继续保持当前策略');
      if (acos < 20) recommendations.push('考虑增加广告预算以扩大市场份额');
    }
    
    if (actionTier === 'Optimize') {
      if (acos > 30) recommendations.push('优化广告投放,降低ACOS至25%以下');
      if (netMargin < 15) recommendations.push('分析成本结构,寻找降本空间');
      if (sku.units_sold < 50) recommendations.push('加强营销推广,提升销量');
    }
    
    if (actionTier === 'Test') {
      recommendations.push('观察2-4周表现再做决策');
      recommendations.push('尝试调整价格或优化Listing');
    }
    
    if (actionTier === 'Cut') {
      if (netMargin < -5) recommendations.push('立即停止广告投放');
      recommendations.push('考虑清仓处理或下架产品');
      recommendations.push('分析失败原因,避免重复错误');
    }
    
    // 通用建议
    if (sku.storage_fee > sku.sales * 0.08) {
      recommendations.push('仓储费过高,考虑促销清库存');
    }
    
    return recommendations;
  }
  
  /**
   * 应用ABC分类
   */
  private applyABCClassification(analyses: SKUAnalysis[]): void {
    // 按收入排序
    const sorted = [...analyses].sort((a, b) => {
      const aRevenue = this.skuDataList.find(s => s.sku === a.sku)?.sales || 0;
      const bRevenue = this.skuDataList.find(s => s.sku === b.sku)?.sales || 0;
      return bRevenue - aRevenue;
    });
    
    const totalRevenue = this.skuDataList.reduce((sum, sku) => sum + sku.sales, 0);
    let cumulativeRevenue = 0;
    
    sorted.forEach(analysis => {
      const skuRevenue = this.skuDataList.find(s => s.sku === analysis.sku)?.sales || 0;
      cumulativeRevenue += skuRevenue;
      const cumulativePercent = (cumulativeRevenue / totalRevenue) * 100;
      
      if (cumulativePercent <= 70) {
        analysis.abc_tier = 'A';
      } else if (cumulativePercent <= 90) {
        analysis.abc_tier = 'B';
      } else {
        analysis.abc_tier = 'C';
      }
    });
  }
}

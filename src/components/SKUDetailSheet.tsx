import { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getSKUAnalysisBySKU, getSKUData } from '@/db/api';
import type { SKUAnalysis, SKUData } from '@/types';
import { Button } from '@/components/ui/button';

interface SKUDetailSheetProps {
  sku: string | null;
  open: boolean;
  onClose: () => void;
}

export function SKUDetailSheet({ sku, open, onClose }: SKUDetailSheetProps) {
  const [analysis, setAnalysis] = useState<SKUAnalysis | null>(null);
  const [skuData, setSKUData] = useState<SKUData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sku && open) {
      setLoading(true);
      setAnalysis(null);
      setSKUData(null);
      
      console.log('加载SKU详情:', sku);
      
      Promise.all([
        getSKUAnalysisBySKU(sku),
        getSKUData(sku),
      ])
        .then(([analysisData, skuDataResult]) => {
          console.log('SKU分析数据:', analysisData);
          console.log('SKU基础数据:', skuDataResult);
          setAnalysis(analysisData);
          setSKUData(skuDataResult);
        })
        .catch((error) => {
          console.error('加载SKU详情失败:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [sku, open]);

  if (loading || !analysis || !skuData) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{loading ? '加载中...' : '暂无数据'}</SheetTitle>
          </SheetHeader>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  const getActionTierColor = (tier: string) => {
    switch (tier) {
      case 'Keep':
        return 'bg-chart-2 text-white hover:bg-chart-2';
      case 'Optimize':
        return 'bg-chart-1 text-white hover:bg-chart-1';
      case 'Test':
        return 'bg-chart-4 text-white hover:bg-chart-4';
      case 'Cut':
        return 'bg-destructive text-white hover:bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">{analysis.sku}</SheetTitle>
              <SheetDescription>SKU详细分析</SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* 策略和分类 */}
          <div className="flex gap-2">
            <Badge className={getActionTierColor(analysis.action_tier)}>
              {analysis.action_tier}
            </Badge>
            <Badge variant="outline">ABC: {analysis.abc_tier}</Badge>
          </div>

          {/* 健康度评分 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                健康度评分
              </h3>
              <span className="text-2xl font-bold gradient-text">
                {analysis.health_score}
              </span>
            </div>
            <Progress value={analysis.health_score} className="h-3" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">销售评分:</span>
                <span className="font-medium">{analysis.sales_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">利润评分:</span>
                <span className="font-medium">{analysis.profit_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">广告效率:</span>
                <span className="font-medium">{analysis.ad_efficiency_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">客户情绪:</span>
                <span className="font-medium">{analysis.customer_sentiment_score}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 单件经济模型 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              单件经济模型
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded bg-accent/50">
                <span className="text-muted-foreground">售价</span>
                <span className="font-medium">${skuData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">- Referral Fee</span>
                <span className="text-destructive">-${skuData.referral_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">- FBA Fee</span>
                <span className="text-destructive">-${skuData.fba_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">- 广告成本(均摊)</span>
                <span className="text-destructive">
                  -${(skuData.ad_spend / Math.max(skuData.units_sold, 1)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between p-2">
                <span className="text-muted-foreground">- COGS</span>
                <span className="text-destructive">-${skuData.cogs.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between p-2 rounded bg-primary/10">
                <span className="font-semibold">单件利润</span>
                <span
                  className={`font-bold ${
                    analysis.unit_profit >= 0 ? 'text-chart-2' : 'text-destructive'
                  }`}
                >
                  {analysis.unit_profit >= 0 ? '+' : ''}${analysis.unit_profit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 关键指标 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              关键指标
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">总销售额</div>
                <div className="text-lg font-bold">${skuData.sales.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">销售数量</div>
                <div className="text-lg font-bold">{skuData.units_sold}</div>
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">净利润率</div>
                <div
                  className={`text-lg font-bold ${
                    analysis.net_margin >= 0 ? 'text-chart-2' : 'text-destructive'
                  }`}
                >
                  {analysis.net_margin.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">ACOS</div>
                <div
                  className={`text-lg font-bold ${
                    analysis.acos < 30 ? 'text-chart-2' : 'text-warning'
                  }`}
                >
                  {analysis.acos.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">广告支出</div>
                <div className="text-lg font-bold">${skuData.ad_spend.toFixed(2)}</div>
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <div className="text-xs text-muted-foreground mb-1">收入占比</div>
                <div className="text-lg font-bold">{analysis.revenue_share.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* 异常标记 */}
          {analysis.anomaly_flags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  异常标记
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.anomaly_flags.map((flag, index) => (
                    <Badge key={index} variant="outline" className="text-warning border-warning">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AI建议 */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI策略建议
            </h3>
            <div className="space-y-2">
              {analysis.ai_recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

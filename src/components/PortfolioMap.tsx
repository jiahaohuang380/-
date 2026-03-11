import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SKUAnalysis } from '@/types';

interface PortfolioMapProps {
  analyses: SKUAnalysis[];
  onSelectSKU: (sku: string) => void;
}

export function PortfolioMap({ analyses, onSelectSKU }: PortfolioMapProps) {
  const [hoveredSKU, setHoveredSKU] = useState<string | null>(null);

  const actionTierColors = useMemo(() => ({
    Keep: 'hsl(var(--chart-2))',
    Optimize: 'hsl(var(--chart-1))',
    Test: 'hsl(var(--chart-4))',
    Cut: 'hsl(var(--destructive))',
  }), []);

  // 计算气泡大小范围
  const maxRevenueShare = useMemo(() => {
    return Math.max(...analyses.map(a => a.revenue_share), 1);
  }, [analyses]);

  const bubbles = useMemo(() => {
    return analyses.map(analysis => {
      // 气泡大小: 基于revenue_share,范围5-25(减小尺寸)
      const size = 5 + (analysis.revenue_share / maxRevenueShare) * 20;
      
      // 位置: sales_score (0-100) 映射到 X轴 10-90%, profit_score (0-100) 映射到 Y轴 10-90%
      // 添加边距避免气泡被裁剪
      const x = 10 + (analysis.sales_score / 100) * 80;
      const y = 10 + (100 - analysis.profit_score) / 100 * 80; // Y轴反转
      
      return {
        sku: analysis.sku,
        x,
        y,
        size,
        color: actionTierColors[analysis.action_tier],
        actionTier: analysis.action_tier,
        salesScore: analysis.sales_score,
        profitScore: analysis.profit_score,
        healthScore: analysis.health_score,
        revenueShare: analysis.revenue_share,
      };
    });
  }, [analyses, maxRevenueShare, actionTierColors]);

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>SKU Portfolio Map</CardTitle>
        <CardDescription>
          X轴: 销售评分 | Y轴: 利润评分 | 气泡大小: 收入占比
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative w-full h-[300px] bg-accent/30 rounded-lg border border-border overflow-hidden">
          {/* 网格线 */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern
                id="grid"
                width="10%"
                height="10%"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* 中线 */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.5"
            />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>

          {/* 气泡 */}
          <svg className="absolute inset-0 w-full h-full">
            {bubbles.map((bubble) => (
              <g key={bubble.sku}>
                <circle
                  cx={`${bubble.x}%`}
                  cy={`${bubble.y}%`}
                  r={bubble.size}
                  fill={bubble.color}
                  opacity={hoveredSKU === bubble.sku ? 0.9 : 0.7}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                  onMouseEnter={() => setHoveredSKU(bubble.sku)}
                  onMouseLeave={() => setHoveredSKU(null)}
                  onClick={() => onSelectSKU(bubble.sku)}
                  style={{
                    filter: hoveredSKU === bubble.sku ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                    transform: hoveredSKU === bubble.sku ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${bubble.x}% ${bubble.y}%`,
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredSKU && bubbles.find(b => b.sku === hoveredSKU) && (
            <div
              className="absolute pointer-events-none bg-card border border-border rounded-lg shadow-lg p-3 text-sm z-10"
              style={{
                left: `${bubbles.find(b => b.sku === hoveredSKU)!.x}%`,
                top: `${bubbles.find(b => b.sku === hoveredSKU)!.y}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="font-bold mb-1">{hoveredSKU}</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>策略: {bubbles.find(b => b.sku === hoveredSKU)!.actionTier}</div>
                <div>健康度: {bubbles.find(b => b.sku === hoveredSKU)!.healthScore}</div>
                <div>销售评分: {bubbles.find(b => b.sku === hoveredSKU)!.salesScore}</div>
                <div>利润评分: {bubbles.find(b => b.sku === hoveredSKU)!.profitScore}</div>
                <div>收入占比: {bubbles.find(b => b.sku === hoveredSKU)!.revenueShare.toFixed(2)}%</div>
              </div>
            </div>
          )}

          {/* 象限标签 */}
          <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Optimize<br/>低销售·高利润
          </div>
          <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Keep<br/>高销售·高利润
          </div>
          <div className="absolute bottom-12 left-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Cut<br/>低销售·低利润
          </div>
          <div className="absolute bottom-12 right-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
            Test<br/>高销售·低利润
          </div>

          {/* 轴标签 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">
            销售评分 →
          </div>
          <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium">
            利润评分 →
          </div>
        </div>

        {/* 图例 */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(actionTierColors).map(([tier, color]) => (
            <div key={tier} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground">{tier}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

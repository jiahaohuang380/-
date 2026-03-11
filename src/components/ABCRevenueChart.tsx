import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface ABCRevenueChartProps {
  stats: DashboardStats;
}

export function ABCRevenueChart({ stats }: ABCRevenueChartProps) {
  const tiers = useMemo(() => {
    const total = stats.revenue_by_tier.A + stats.revenue_by_tier.B + stats.revenue_by_tier.C;
    
    return [
      {
        name: 'A类',
        revenue: stats.revenue_by_tier.A,
        percentage: total > 0 ? (stats.revenue_by_tier.A / total) * 100 : 0,
        color: 'bg-chart-2',
        description: '贡献70%收入',
      },
      {
        name: 'B类',
        revenue: stats.revenue_by_tier.B,
        percentage: total > 0 ? (stats.revenue_by_tier.B / total) * 100 : 0,
        color: 'bg-chart-1',
        description: '贡献20%收入',
      },
      {
        name: 'C类',
        revenue: stats.revenue_by_tier.C,
        percentage: total > 0 ? (stats.revenue_by_tier.C / total) * 100 : 0,
        color: 'bg-chart-4',
        description: '剩余收入',
      },
    ];
  }, [stats]);

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>ABC收入分布</CardTitle>
        <CardDescription>按ABC分类的收入占比</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tiers.map((tier) => (
          <div key={tier.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                <span className="font-medium">{tier.name}</span>
                <span className="text-muted-foreground">
                  {tier.description}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ${tier.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {tier.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${tier.color} transition-all duration-500`}
                style={{ width: `${tier.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

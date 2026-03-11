import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface ActionTierChartProps {
  stats: DashboardStats;
}

export function ActionTierChart({ stats }: ActionTierChartProps) {
  const tiers = useMemo(() => [
    {
      name: 'Keep',
      count: stats.keep_count,
      color: 'bg-chart-2',
      description: '保持当前策略',
    },
    {
      name: 'Optimize',
      count: stats.optimize_count,
      color: 'bg-chart-1',
      description: '需要优化',
    },
    {
      name: 'Test',
      count: stats.test_count,
      color: 'bg-chart-4',
      description: '观察测试',
    },
    {
      name: 'Cut',
      count: stats.cut_count,
      color: 'bg-destructive',
      description: '建议下架',
    },
  ], [stats]);

  const total = stats.total_skus;

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>策略分布</CardTitle>
        <CardDescription>SKU按策略分类统计</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tiers.map((tier) => {
          const percentage = total > 0 ? (tier.count / total) * 100 : 0;
          return (
            <div key={tier.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                  <span className="font-medium">{tier.name}</span>
                  <span className="text-muted-foreground">
                    {tier.description}
                  </span>
                </div>
                <span className="font-bold">{tier.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${tier.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

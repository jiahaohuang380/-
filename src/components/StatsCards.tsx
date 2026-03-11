import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = useMemo(() => [
    {
      title: 'SKU总数',
      value: stats.total_skus,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: '平均健康度',
      value: stats.avg_health_score,
      suffix: '/100',
      icon: stats.avg_health_score >= 70 ? TrendingUp : TrendingDown,
      color: stats.avg_health_score >= 70 ? 'text-chart-2' : 'text-warning',
      bgColor: stats.avg_health_score >= 70 ? 'bg-chart-2/10' : 'bg-warning/10',
    },
    {
      title: '负利润SKU',
      value: stats.negative_profit_count,
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: '异常SKU',
      value: stats.anomaly_count,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ], [stats]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              {card.suffix && (
                <span className="text-sm text-muted-foreground ml-1">
                  {card.suffix}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

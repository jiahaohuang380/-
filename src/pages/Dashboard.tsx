import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Upload as UploadIcon } from 'lucide-react';
import { StatsCards } from '@/components/StatsCards';
import { ActionTierChart } from '@/components/ActionTierChart';
import { ABCRevenueChart } from '@/components/ABCRevenueChart';
import { Button } from '@/components/ui/button';
import { getDashboardStats } from '@/db/api';
import type { DashboardStats } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果没有数据,显示提示页面
  if (!stats || stats.total_skus === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                欢迎使用 SKU Strategy Copilot
              </h1>
              <p className="text-lg text-muted-foreground">
                暂无数据,请先上传SKU数据或使用样本数据体验
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/upload">
                  <UploadIcon className="mr-2 h-5 w-5" />
                  上传数据
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 显示Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                SKU组合分析概览
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/upload">
                <UploadIcon className="mr-2 h-4 w-4" />
                上传新数据
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <ActionTierChart stats={stats} />
            <ABCRevenueChart stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}

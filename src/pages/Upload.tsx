import { BarChart3, Sparkles } from 'lucide-react';
import { DataUploadCard } from '@/components/DataUploadCard';
import { Button } from '@/components/ui/button';
import { useSampleData } from '@/hooks/use-sample-data';

export default function Upload() {
  const { loadSampleData, isLoading: isSampleLoading } = useSampleData();

  const handleLoadSampleData = async () => {
    const success = await loadSampleData();
    if (success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              上传数据
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              上传Amazon Seller Central导出的CSV文件,或使用样本数据快速体验
            </p>
          </div>

          {/* Upload Card */}
          <DataUploadCard />

          {/* 或者使用样本数据 */}
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  或者
                </span>
              </div>
            </div>
            <Button
              onClick={handleLoadSampleData}
              disabled={isSampleLoading}
              variant="outline"
              size="lg"
              className="mt-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isSampleLoading ? '加载中...' : '使用样本数据体验'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              快速加载10个样本SKU数据,体验完整功能
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border card-hover">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="font-semibold">智能分析</h3>
              <p className="text-sm text-muted-foreground">
                自动计算健康度评分和关键指标
              </p>
            </div>
            <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border card-hover">
              <div className="w-12 h-12 rounded-full bg-chart-1/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-chart-1" />
              </div>
              <h3 className="font-semibold">可视化展示</h3>
              <p className="text-sm text-muted-foreground">
                Portfolio Map直观展示SKU表现
              </p>
            </div>
            <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border card-hover">
              <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold">AI建议</h3>
              <p className="text-sm text-muted-foreground">
                获取个性化的优化策略建议
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

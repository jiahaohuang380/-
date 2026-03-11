import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { PortfolioMap } from '@/components/PortfolioMap';
import { SKUTable } from '@/components/SKUTable';
import { SKUDetailSheet } from '@/components/SKUDetailSheet';
import { getAllSKUAnalysis } from '@/db/api';
import type { SKUAnalysis } from '@/types';

export default function Analysis() {
  const [analyses, setAnalyses] = useState<SKUAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await getAllSKUAnalysis();
      console.log('加载的分析数据:', data);
      setAnalyses(data);
    } catch (error) {
      console.error('加载分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSKU = (sku: string) => {
    setSelectedSKU(sku);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedSKU(null);
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

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">暂无分析数据</h2>
            <p className="text-muted-foreground">
              请先在Dashboard页面上传SKU数据
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold gradient-text">SKU分析</h1>
            <p className="text-muted-foreground mt-2">
              深入分析每个SKU的表现和策略建议
            </p>
          </div>

          {/* Portfolio Map */}
          <PortfolioMap analyses={analyses} onSelectSKU={handleSelectSKU} />

          {/* SKU Table */}
          <SKUTable analyses={analyses} onSelectSKU={handleSelectSKU} />
        </div>
      </div>

      {/* SKU Detail Sheet */}
      <SKUDetailSheet
        sku={selectedSKU}
        open={sheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
}

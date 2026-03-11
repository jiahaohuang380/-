import { useMemo, useState } from 'react';
import { ArrowUpDown, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SKUAnalysis } from '@/types';

interface SKUTableProps {
  analyses: SKUAnalysis[];
  onSelectSKU: (sku: string) => void;
}

type SortField = 'sku' | 'health_score' | 'net_margin' | 'acos';
type SortDirection = 'asc' | 'desc';

export function SKUTable({ analyses, onSelectSKU }: SKUTableProps) {
  const [sortField, setSortField] = useState<SortField>('health_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAnalyses = useMemo(() => {
    return [...analyses].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      switch (sortField) {
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        case 'health_score':
          aValue = a.health_score;
          bValue = b.health_score;
          break;
        case 'net_margin':
          aValue = a.net_margin;
          bValue = b.net_margin;
          break;
        case 'acos':
          aValue = a.acos;
          bValue = b.acos;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [analyses, sortField, sortDirection]);

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

  const getABCTierColor = (tier: string) => {
    switch (tier) {
      case 'A':
        return 'bg-chart-2 text-white hover:bg-chart-2';
      case 'B':
        return 'bg-chart-1 text-white hover:bg-chart-1';
      case 'C':
        return 'bg-chart-4 text-white hover:bg-chart-4';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>SKU列表</CardTitle>
        <CardDescription>点击行查看详细信息</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('sku')}
                    className="h-8 px-2"
                  >
                    SKU
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>策略</TableHead>
                <TableHead>ABC</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('health_score')}
                    className="h-8 px-2"
                  >
                    健康度
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('net_margin')}
                    className="h-8 px-2"
                  >
                    净利润率
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('acos')}
                    className="h-8 px-2"
                  >
                    ACOS
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>异常</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAnalyses.map((analysis) => (
                <TableRow
                  key={analysis.sku}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectSKU(analysis.sku)}
                >
                  <TableCell className="font-medium">{analysis.sku}</TableCell>
                  <TableCell>
                    <Badge className={getActionTierColor(analysis.action_tier)}>
                      {analysis.action_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getABCTierColor(analysis.abc_tier)}>
                      {analysis.abc_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${analysis.health_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {analysis.health_score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        analysis.net_margin >= 20
                          ? 'text-chart-2 font-medium'
                          : analysis.net_margin >= 0
                            ? 'text-foreground'
                            : 'text-destructive font-medium'
                      }
                    >
                      {analysis.net_margin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        analysis.acos < 25
                          ? 'text-chart-2 font-medium'
                          : analysis.acos < 40
                            ? 'text-foreground'
                            : 'text-warning font-medium'
                      }
                    >
                      {analysis.acos.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {analysis.anomaly_flags.length > 0 && (
                      <div className="flex items-center gap-1 text-warning">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">
                          {analysis.anomaly_flags.length}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

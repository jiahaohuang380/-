import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataUpload } from '@/hooks/use-data-upload';

export function DataUploadCard() {
  const navigate = useNavigate();
  const [skuFile, setSkuFile] = useState<File | null>(null);
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const { uploadData, isUploading, uploadProgress, error } = useDataUpload();

  const handleFileChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'sku' | 'review'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'sku') {
        setSkuFile(file);
      } else {
        setReviewFile(file);
      }
    }
  }, []);

  const handleRemoveFile = useCallback((type: 'sku' | 'review') => {
    if (type === 'sku') {
      setSkuFile(null);
    } else {
      setReviewFile(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    const success = await uploadData(skuFile, reviewFile);
    if (success) {
      setSkuFile(null);
      setReviewFile(null);
      navigate('/dashboard');
    }
  }, [skuFile, reviewFile, uploadData, navigate]);

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          上传CSV文件
        </CardTitle>
        <CardDescription>
          上传Amazon Seller Central导出的CSV文件进行分析
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SKU数据上传 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            SKU成本数据 <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="flex-1">
              <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-border bg-accent/50 p-4 cursor-pointer hover:bg-accent transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  {skuFile ? (
                    <p className="text-sm font-medium">{skuFile.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      点击选择CSV文件
                    </p>
                  )}
                </div>
                {skuFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile('sku');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'sku')}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* 评论数据上传 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            评论数据 <span className="text-muted-foreground">(可选)</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="flex-1">
              <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-border bg-accent/50 p-4 cursor-pointer hover:bg-accent transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  {reviewFile ? (
                    <p className="text-sm font-medium">{reviewFile.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      点击选择CSV文件
                    </p>
                  )}
                </div>
                {reviewFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile('review');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'review')}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* 上传进度 */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              上传中... {uploadProgress}%
            </p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 上传按钮 */}
        <Button
          onClick={handleUpload}
          disabled={!skuFile || isUploading}
          className="w-full"
        >
          {isUploading ? '上传中...' : '开始分析'}
        </Button>
      </CardContent>
    </Card>
  );
}

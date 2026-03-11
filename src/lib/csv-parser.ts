import type { SKUData, ReviewData } from '@/types';

/**
 * 解析CSV文件内容
 */
export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }
  
  return rows;
}

/**
 * 解析SKU成本数据CSV
 */
export function parseSKUDataCSV(content: string): SKUData[] {
  const rows = parseCSV(content);
  
  return rows.map(row => {
    // 支持两种字段名格式
    const sku = row.msku || row.sku || '';
    const price = parseFloat(row.average_sales_price || row.price) || 0;
    const units_sold = parseInt(row.units_sold) || 0;
    const sales = parseFloat(row.sales) || 0;
    const referral_fee = parseFloat(row.referral_fee) || 0;
    const fba_fee = parseFloat(row.fba_fee) || 0;
    const storage_fee = parseFloat(row.storage_cost || row.storage_fee) || 0;
    const ad_spend = parseFloat(row.ad_total_amount || row.ad_spend) || 0;
    const cogs = parseFloat(row.cost_of_goods_sold || row.cogs) || 0;
    const net_proceeds = parseFloat(row.net_proceeds_total || row.net_proceeds) || 0;
    
    return {
      sku,
      price,
      units_sold,
      sales,
      referral_fee,
      fba_fee,
      storage_fee,
      ad_spend,
      cogs,
      net_proceeds,
    };
  });
}

/**
 * 解析评论数据CSV
 */
export function parseReviewDataCSV(content: string): ReviewData[] {
  const rows = parseCSV(content);
  
  return rows.map(row => {
    // 支持两种字段名格式
    const asin = row.asin || row.sku || '';
    const rating = parseFloat(row.stars || row.rating) || 0;
    const review_text = row.review_text || '';
    
    return {
      asin,
      rating,
      review_text,
    };
  });
}

/**
 * 读取文件内容
 */
export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

# 任务: SKU Strategy Copilot - AI驱动的SKU组合分析工具

## 计划
- [x] 1-13. 基础功能和多轮优化
- [x] 14. 数据清理功能
- [x] 15. 气泡图最终优化
- [x] 16. 策略分类逻辑修复
  - [x] 16.1 修改determineActionTier函数,基于Sales Score和Profit Score象限
  - [x] 16.2 右上角(高销售·高利润) → Keep
  - [x] 16.3 左上角(低销售·高利润) → Optimize
  - [x] 16.4 右下角(高销售·低利润) → Test
  - [x] 16.5 左下角(低销售·低利润) → Cut
  - [x] 16.6 添加四个象限标签到气泡图

## 策略分类逻辑
基于Portfolio Map的象限位置:
- **Keep** (右上角): Sales Score ≥ 50 且 Profit Score ≥ 50
  - 高销售、高利润的明星产品
  - 继续保持当前策略
  
- **Optimize** (左上角): Sales Score < 50 且 Profit Score ≥ 50
  - 低销售、高利润的潜力产品
  - 需要提升销量,加强营销
  
- **Test** (右下角): Sales Score ≥ 50 且 Profit Score < 50
  - 高销售、低利润的问题产品
  - 需要优化成本或提价
  
- **Cut** (左下角): Sales Score < 50 且 Profit Score < 50
  - 低销售、低利润的失败产品
  - 考虑下架或清仓

## 样本数据说明
样本数据使用用户提供的真实Amazon数据:
- 10个SKU: SKU-GRIP-MATTE-01, SKU-GRIP-RUBBER-02, SKU-CASE-IP16-01, SKU-CASE-IP16-02, SKU-STAND-FOLD-01, SKU-STAND-FLEX-02, SKU-WALLET-MAG-01, SKU-WALLET-SLIM-02, SKU-STRAP-SOFT-01, SKU-STRAP-HARD-02
- 33条真实评论,覆盖所有10个SKU
- 每次加载样本数据前会自动清空旧数据,确保只显示这10个SKU

## 关键修复
1. **数据清理**: 每次加载样本数据前自动清空所有表
2. **气泡图优化**: 容器300px,气泡5-25px,10%边距,viewBox完整显示
3. **策略分类**: 基于Sales Score和Profit Score的象限位置,而非health_score
4. **象限标签**: 在气泡图四个角显示策略名称和说明

## 注意事项
- 使用现代SaaS设计风格,参考Stripe/Linear/Notion
- 所有数据存储在Supabase
- 支持CSV文件上传和解析
- 实现完整的SKU健康度评分算法
- 提供AI策略建议
- 支持一键加载样本数据体验完整功能
- 首页为上传页面,上传后跳转到Dashboard
- 添加详细的控制台日志便于调试
- 确保SKU数据在整个流程中保持一致性
- 支持Amazon真实CSV格式(msku, average_sales_price, ad_total_amount等)

## CSV字段映射说明
支持两种CSV格式:
1. 简化格式: sku, price, sales, ad_spend, cogs等
2. Amazon格式: msku, average_sales_price, ad_total_amount, cost_of_goods_sold等

评论数据支持:
1. 简化格式: asin, rating, review_text
2. Amazon格式: asin, stars, review_text

## 调试说明
打开浏览器控制台可以看到详细的数据流日志:
1. 数据清空过程
2. 样本数据加载过程
3. CSV上传和解析过程
4. SKU数据插入和查询
5. 分析结果生成和存储
6. SKU详情加载过程

## 完成状态
✅ 所有功能已完成并通过Lint验证
✅ 用户反馈问题已全部修复
✅ 路由结构已优化,首页为上传页面
✅ UI优化完成:气泡图尺寸调整为300px、导航栏样式优化
✅ 添加完整的数据库操作日志,便于追踪数据流问题
✅ 支持真实Amazon CSV格式
✅ 样本数据使用用户提供的真实10个SKU和33条评论
✅ 数据清理功能确保每次只显示10个样本SKU
✅ 气泡图完整显示在容器内,无裁剪问题
✅ 策略分类基于Sales Score和Profit Score象限,正确对应四个维度
✅ 气泡图添加象限标签,清晰展示Keep/Optimize/Test/Cut分类

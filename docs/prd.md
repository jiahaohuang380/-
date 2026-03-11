# SKU Strategy Copilot需求文档

## 1. 应用概述

### 1.1 应用名称
SKU Strategy Copilot

### 1.2 应用描述
一个AI驱动的SKU组合分析工具,帮助电商卖家分析SKU表现,并自动给出经营决策建议。用户可以上传Amazon Seller Central导出的成本报告和评论数据,系统自动分析每个SKU的盈利能力、广告效率、客户评价情绪,并给出Keep / Optimize / Test / Cut的策略建议。

## 2. 核心功能

### 2.1 数据上传
用户可以上传两个CSV文件:
- SKU成本数据(必填)
  - 字段包括:sku、price、units_sold、sales、referral_fee、fba_fee、storage_fee、ad_spend、cogs、net_proceeds
- 评论数据(可选)
  - 字段包括:asin、rating、review_text

### 2.2 数据分析
系统需要自动计算以下指标:
- 净利润率
- ACOS
- 单件利润
- 总费用
- Revenue Share

并生成一个综合评分:
- Health Score(0-100)

评分维度包括:
- Sales Score
- Profit Score
- Ad Efficiency Score
- Customer Sentiment Score

### 2.3 SKU分类
系统自动进行SKU组合管理:

ABC分类:
- A类 SKU:贡献70%收入
- B类 SKU:贡献20%收入
- C类 SKU:剩余SKU

策略分类:
- Keep
- Optimize
- Test
- Cut

### 2.4 可视化分析
生成一个SKU Portfolio Map:
- X轴:Sales Score
- Y轴:Profit Score
- 气泡大小:Revenue Share
- 气泡颜色:Action Tier(Keep Optimize Test Cut)

点击气泡可以查看SKU详细信息。

### 2.5 SKU列表
生成一个表格展示:
- SKU
- Tier
- ABC分类
- Health Score
- Revenue
- Net Margin
- ACOS
- Rating
- Anomaly Flags

支持排序。

### 2.6 SKU详情页
点击SKU打开侧边面板,显示:

Health Score

Unit Economics:
- 售价
- Referral Fee
- FBA Fee
- 广告成本
- COGS
- 单件利润

AI策略建议,例如:
- 降低广告成本
- 提高售价
- 优化产品质量
- 解决评论中的主要问题

### 2.7 仪表盘概览
显示关键指标:
- SKU总数
- 平均Health Score
- Keep / Optimize / Test / Cut数量
- 负利润SKU数量
- 异常SKU数量
- 收入分布

## 3. 设计要求

### 3.1 UI设计要求
整体风格:现代数据分析SaaS Dashboard

设计参考:
- Stripe
- Linear
- Notion Analytics
- Vercel Dashboard

UI要求:
- 卡片式布局
- 圆角
- 柔和阴影
- 渐变色
- 干净专业的字体
- 高级感

### 3.2 交互设计
需要包含:
- hover动画
- 气泡图交互
- 表格点击查看详情
- 侧边详情面板
- 动态health bar
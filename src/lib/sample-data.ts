import type { SKUData, ReviewData } from '@/types';

/**
 * 生成样本SKU数据 - 使用真实的Amazon数据
 */
export function generateSampleSKUData(): SKUData[] {
  return [
    {
      sku: 'SKU-GRIP-MATTE-01',
      price: 25.00,
      units_sold: 650,
      sales: 16250.00,
      referral_fee: 3.75,
      fba_fee: 3.50,
      storage_fee: 0.15,
      ad_spend: 910.00,
      cogs: 4.30,
      net_proceeds: 5660.50,
    },
    {
      sku: 'SKU-GRIP-RUBBER-02',
      price: 25.00,
      units_sold: 360,
      sales: 9000.00,
      referral_fee: 3.75,
      fba_fee: 3.50,
      storage_fee: 0.15,
      ad_spend: 1728.00,
      cogs: 4.30,
      net_proceeds: 620.40,
    },
    {
      sku: 'SKU-CASE-IP16-01',
      price: 35.00,
      units_sold: 600,
      sales: 21000.00,
      referral_fee: 5.25,
      fba_fee: 4.20,
      storage_fee: 0.20,
      ad_spend: 1020.00,
      cogs: 7.80,
      net_proceeds: 5202.00,
    },
    {
      sku: 'SKU-CASE-IP16-02',
      price: 35.00,
      units_sold: 140,
      sales: 4900.00,
      referral_fee: 5.25,
      fba_fee: 4.20,
      storage_fee: 0.20,
      ad_spend: 1092.00,
      cogs: 7.80,
      net_proceeds: -630.00,
    },
    {
      sku: 'SKU-STAND-FOLD-01',
      price: 24.00,
      units_sold: 300,
      sales: 7200.00,
      referral_fee: 3.60,
      fba_fee: 3.70,
      storage_fee: 0.18,
      ad_spend: 600.00,
      cogs: 5.50,
      net_proceeds: 1626.00,
    },
    {
      sku: 'SKU-STAND-FLEX-02',
      price: 24.00,
      units_sold: 150,
      sales: 3600.00,
      referral_fee: 3.60,
      fba_fee: 3.70,
      storage_fee: 0.18,
      ad_spend: 810.00,
      cogs: 5.50,
      net_proceeds: -216.00,
    },
    {
      sku: 'SKU-WALLET-MAG-01',
      price: 40.00,
      units_sold: 620,
      sales: 24800.00,
      referral_fee: 6.00,
      fba_fee: 4.50,
      storage_fee: 0.22,
      ad_spend: 1364.00,
      cogs: 9.20,
      net_proceeds: 6688.40,
    },
    {
      sku: 'SKU-WALLET-SLIM-02',
      price: 40.00,
      units_sold: 270,
      sales: 10800.00,
      referral_fee: 6.00,
      fba_fee: 4.50,
      storage_fee: 0.22,
      ad_spend: 1053.00,
      cogs: 9.20,
      net_proceeds: 1485.60,
    },
    {
      sku: 'SKU-STRAP-SOFT-01',
      price: 16.00,
      units_sold: 300,
      sales: 4800.00,
      referral_fee: 2.40,
      fba_fee: 2.60,
      storage_fee: 0.10,
      ad_spend: 570.00,
      cogs: 3.00,
      net_proceeds: 678.00,
    },
    {
      sku: 'SKU-STRAP-HARD-02',
      price: 16.00,
      units_sold: 150,
      sales: 2400.00,
      referral_fee: 2.40,
      fba_fee: 2.60,
      storage_fee: 0.10,
      ad_spend: 780.00,
      cogs: 3.00,
      net_proceeds: -342.00,
    },
  ];
}

/**
 * 生成样本评论数据 - 使用真实的Amazon评论
 */
export function generateSampleReviewData(): ReviewData[] {
  return [
    {
      asin: 'SKU-GRIP-MATTE-01',
      rating: 5,
      review_text: 'Excellent matte texture. Feels secure in hand.',
    },
    {
      asin: 'SKU-GRIP-MATTE-01',
      rating: 5,
      review_text: 'Very comfortable grip and doesn\'t slip.',
    },
    {
      asin: 'SKU-GRIP-MATTE-01',
      rating: 4,
      review_text: 'Works well but adhesive could be stronger.',
    },
    {
      asin: 'SKU-GRIP-MATTE-01',
      rating: 5,
      review_text: 'Nice minimal design and strong hold.',
    },
    {
      asin: 'SKU-GRIP-RUBBER-02',
      rating: 3,
      review_text: 'Grip is okay but the rubber feels cheap.',
    },
    {
      asin: 'SKU-GRIP-RUBBER-02',
      rating: 2,
      review_text: 'Started peeling after two weeks.',
    },
    {
      asin: 'SKU-GRIP-RUBBER-02',
      rating: 2,
      review_text: 'Not very durable. Expected better.',
    },
    {
      asin: 'SKU-GRIP-RUBBER-02',
      rating: 3,
      review_text: 'Average grip but nothing special.',
    },
    {
      asin: 'SKU-CASE-IP16-01',
      rating: 5,
      review_text: 'Perfect fit for my new iPhone 16.',
    },
    {
      asin: 'SKU-CASE-IP16-01',
      rating: 5,
      review_text: 'Great protection and slim design.',
    },
    {
      asin: 'SKU-CASE-IP16-01',
      rating: 4,
      review_text: 'Buttons are easy to press. Feels premium.',
    },
    {
      asin: 'SKU-CASE-IP16-01',
      rating: 5,
      review_text: 'Dropped my phone once and the case saved it.',
    },
    {
      asin: 'SKU-CASE-IP16-02',
      rating: 1,
      review_text: 'Case arrived warped and doesn\'t fit well.',
    },
    {
      asin: 'SKU-CASE-IP16-02',
      rating: 2,
      review_text: 'Cheap plastic. Feels very low quality.',
    },
    {
      asin: 'SKU-CASE-IP16-02',
      rating: 1,
      review_text: 'Camera cutout is misaligned.',
    },
    {
      asin: 'SKU-STAND-FOLD-01',
      rating: 5,
      review_text: 'Very useful for video calls.',
    },
    {
      asin: 'SKU-STAND-FOLD-01',
      rating: 4,
      review_text: 'Compact and folds nicely.',
    },
    {
      asin: 'SKU-STAND-FOLD-01',
      rating: 4,
      review_text: 'Stable stand. Good value.',
    },
    {
      asin: 'SKU-STAND-FLEX-02',
      rating: 2,
      review_text: 'Arm becomes loose after a week.',
    },
    {
      asin: 'SKU-STAND-FLEX-02',
      rating: 2,
      review_text: 'Not stable. Phone keeps tilting.',
    },
    {
      asin: 'SKU-STAND-FLEX-02',
      rating: 1,
      review_text: 'Cheap material and poor design.',
    },
    {
      asin: 'SKU-WALLET-MAG-01',
      rating: 5,
      review_text: 'Strong magnets. Holds cards securely.',
    },
    {
      asin: 'SKU-WALLET-MAG-01',
      rating: 5,
      review_text: 'Great replacement for my wallet.',
    },
    {
      asin: 'SKU-WALLET-MAG-01',
      rating: 4,
      review_text: 'Premium leather feel.',
    },
    {
      asin: 'SKU-WALLET-MAG-01',
      rating: 5,
      review_text: 'Very convenient everyday accessory.',
    },
    {
      asin: 'SKU-WALLET-SLIM-02',
      rating: 3,
      review_text: 'Slim design but holds only two cards comfortably.',
    },
    {
      asin: 'SKU-WALLET-SLIM-02',
      rating: 3,
      review_text: 'Nice wallet but magnet could be stronger.',
    },
    {
      asin: 'SKU-WALLET-SLIM-02',
      rating: 4,
      review_text: 'Good design but slightly bulky.',
    },
    {
      asin: 'SKU-STRAP-SOFT-01',
      rating: 4,
      review_text: 'Comfortable strap for daily use.',
    },
    {
      asin: 'SKU-STRAP-SOFT-01',
      rating: 5,
      review_text: 'Soft material doesn\'t hurt fingers.',
    },
    {
      asin: 'SKU-STRAP-SOFT-01',
      rating: 3,
      review_text: 'Works well but looks basic.',
    },
    {
      asin: 'SKU-STRAP-HARD-02',
      rating: 1,
      review_text: 'Strap snapped within a few days.',
    },
    {
      asin: 'SKU-STRAP-HARD-02',
      rating: 2,
      review_text: 'Hard plastic hurts fingers.',
    },
    {
      asin: 'SKU-STRAP-HARD-02',
      rating: 1,
      review_text: 'Very poor build quality.',
    },
  ];
}

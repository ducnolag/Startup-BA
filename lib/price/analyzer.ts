// =====================================================================
// Analyzer: phân tích giá, phát hiện giá ảo, đề xuất mua/chờ
// =====================================================================

import type { ProductAnalysis, ProductRecord, Verdict } from './types';

const BEST_WINDOWS = [
  { start: 1, end: 3, label: 'Thứ 3 - Thứ 5, 10h-14h' },
  { start: 8, end: 12, label: 'Giữa tháng, đầu tuần' },
  { start: 22, end: 28, label: 'Cuối tháng (trước sale flash)' },
];

export type AnalysisResult = ProductAnalysis;

/**
 * Phân tích toàn diện một sản phẩm:
 * - So sánh giá hiện tại vs trung bình / thấp nhất / cao nhất
 * - Phát hiện fake sale (giá "giảm" nhưng cao hơn TB)
 * - Phân tích trend (up/down/stable)
 * - Đề xuất mua/chờ/cảnh báo giá ảo
 */
export function analyzeProduct(p: ProductRecord): AnalysisResult {
  const { currentPrice, averagePrice, lowestPrice, history } = p;

  // 1) % chênh lệch
  const diffPctVsAvg = ((currentPrice - averagePrice) / averagePrice) * 100;
  const diffPctVsLowest = ((currentPrice - lowestPrice) / lowestPrice) * 100;

  // 2) Trend detection (so sánh 7 ngày gần nhất vs 7 ngày trước đó)
  const last7 = history.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const prev7 = history.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
  const trendPct = ((last7 - prev7) / prev7) * 100;
  const trendDirection: 'up' | 'down' | 'stable' =
    trendPct < -2 ? 'down' : trendPct > 2 ? 'up' : 'stable';

  // 3) Fake sale detection: giá "gốc" inflate + giá hiện tại vẫn cao hơn TB
  //    Pattern: originalPrice rất cao, currentPrice < originalPrice nhưng vẫn > avg
  const isFakeSale =
    p.originalPrice > averagePrice * 1.3 && currentPrice > averagePrice * 1.05;

  // 4) Recent price spike detection: tăng mạnh trong 3-5 ngày gần nhất
  const last3 = history.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const prev3 = history.slice(-7, -3).reduce((a, b) => a + b, 0) / 4;
  const recentSpike = ((last3 - prev3) / prev3) * 100 > 8;

  // 5) Verdict logic
  let verdict: Verdict = 'doi-them';
  let detailedReason = '';

  if (isFakeSale || (recentSpike && currentPrice > averagePrice)) {
    verdict = 'gia-ao';
    detailedReason = `CẢNH BÁO: ${
      isFakeSale
        ? `Giá "gốc" ${p.originalPrice.toLocaleString('vi-VN')}đ có dấu hiệu bị inflate. `
        : ''
    }${
      recentSpike
        ? `Giá tăng đột biến ${Math.round(((last3 - prev3) / prev3) * 100)}% trong 3 ngày gần đây. `
        : ''
    }Giá hiện tại ${currentPrice.toLocaleString('vi-VN')}đ đang cao hơn trung bình 30 ngày ${Math.abs(
      Math.round(diffPctVsAvg)
    )}%. NÊN ĐỢI 1-2 tuần.`;
  } else if (currentPrice <= lowestPrice * 1.05) {
    verdict = 'mua-ngay';
    detailedReason = `Giá ${currentPrice.toLocaleString('vi-VN')}đ gần chạm đáy 30 ngày (${
      p.lowestPrice.toLocaleString('vi-VN')
    }đ). Đây là thời điểm tốt để chốt đơn.`;
  } else if (trendDirection === 'down' && diffPctVsAvg < -3) {
    verdict = 'mua-ngay';
    detailedReason = `Xu hướng giảm ${Math.abs(
      Math.round(trendPct)
    )}% trong 7 ngày gần đây. Giá đang thấp hơn trung bình ${Math.abs(
      Math.round(diffPctVsAvg)
    )}%. Có thể mua ngay hoặc đợi thêm 2-3 ngày.`;
  } else if (currentPrice > averagePrice * 1.08) {
    verdict = 'gia-ao';
    detailedReason = `Giá hiện tại cao hơn trung bình ${Math.round(
      diffPctVsAvg
    )}%. Có dấu hiệu inflate giá trước "sale". Đợi 1-2 tuần để giá về mức hợp lý.`;
  } else {
    verdict = 'doi-them';
    detailedReason = `Giá ổn định quanh mức trung bình (${Math.round(
      diffPctVsAvg
    )}% so với TB). Không có dấu hiệu sale thật. Đợi thêm sale lớn cuối tháng.`;
  }

  const recommendationLabel: Record<Verdict, string> = {
    'mua-ngay': 'Nên mua ngay',
    'doi-them': 'Có thể đợi thêm',
    'gia-ao': 'Cảnh báo giá ảo',
  };

  return {
    product: p,
    diffPctVsAvg: Math.round(diffPctVsAvg),
    diffPctVsLowest: Math.round(diffPctVsLowest),
    isFakeSale,
    trendDirection,
    recommendation: verdict,
    recommendationLabel: recommendationLabel[verdict],
    detailedReason,
    bestWindow: pickBestWindow(),
  };
}

function pickBestWindow(): string {
  const today = new Date().getDate();
  for (const w of BEST_WINDOWS) {
    if (today >= w.start && today <= w.end) return w.label;
  }
  return 'Thứ 3 - Thứ 5, 10h-14h';
}

/** Tính phần trăm tiết kiệm nếu mua ở giá thấp nhất */
export function calcSavings(p: ProductRecord): number {
  return p.currentPrice - p.lowestPrice;
}
// lib/algorithms.ts

export interface PriceHistory {
  date: string;
  price: number;       
  originalPrice: number; 
}

export interface ShopData {
  rating: number;       
  isNewShop: boolean;   
  returnRate: number;  
  reviewCount: number;  
}
//Median
function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
export function detectFakeDiscount(currentOriginalPrice: number, history: PriceHistory[]): boolean {
  if (history.length < 7) return false; 

  const historicalOriginalPrices = history.map(h => h.originalPrice);
  const medianOriginalPrice = getMedian(historicalOriginalPrices);
  const differenceRatio = (currentOriginalPrice - medianOriginalPrice) / medianOriginalPrice;
  
  return differenceRatio > 0.15;
}
export type Recommendation = 'MUA NGAY' | 'ĐỢI THÊM' | 'GIÁ ĐANG CAO';

export function getBuyRecommendation(currentPrice: number, history: PriceHistory[]): { label: Recommendation, reason: string } {
  if (history.length < 7) return { label: 'ĐỢI THÊM', reason: 'Chưa đủ dữ liệu lịch sử để phân tích.' };

  const historicalPrices = history.map(h => h.price);
  const medianPrice = getMedian(historicalPrices);
  const minPrice = Math.min(...historicalPrices);

  if (currentPrice <= minPrice) {
    return { label: 'MUA NGAY', reason: 'Giá đang ở mức thấp nhất trong lịch sử 90 ngày qua.' };
  }

  if (currentPrice <= medianPrice * 0.95) {
    return { label: 'MUA NGAY', reason: 'Giá đang tốt, thấp hơn mức trung bình của thị trường.' };
  }

  if (currentPrice > medianPrice) {
    return { label: 'GIÁ ĐANG CAO', reason: 'Giá đang cao hơn trung bình. Nên đợi các đợt sale giữa/cuối tháng.' };
  }

  return { label: 'ĐỢI THÊM', reason: 'Giá đang ở mức bình thường, không có khuyến mãi đột phá.' };
}
// Tính tổng bill thực tế
export function calculateRealCost(price: number, shippingFee: number, voucherDiscount: number): number {
  const total = price + shippingFee - voucherDiscount;
  return total > 0 ? total : 0; // Đảm bảo tổng bill không bị âm
}

//  Cảnh báo rủi ro Shop
export function assessShopRisk(shop: ShopData): { isRisky: boolean, warnings: string[] } {
  const warnings: string[] = [];
  
  if (shop.rating < 4.5 && shop.reviewCount > 50) {
    warnings.push('Điểm đánh giá trung bình thấp.');
  }
  if (shop.isNewShop && shop.reviewCount < 10) {
    warnings.push('Shop mới mở, chưa có nhiều độ uy tín.');
  }
  if (shop.returnRate > 10) {
    warnings.push('Tỷ lệ hoàn trả/khiếu nại cao bất thường.');
  }

  return {
    isRisky: warnings.length > 0,
    warnings
  };
}
import { NextResponse } from 'next/server';
import { getBuyRecommendation, detectFakeDiscount } from '../_algorithms/priceLogic';
import { products as rawProducts } from '../_data/mockProducts'; // Lấy đúng dữ liệu mock của Tool 2

export async function GET() {
  // 1. Tương lai: Chỗ này sẽ là code gọi DB Supabase
  // const { data: rawProducts } = await supabase.from('products').select('*');
  const processedProducts = rawProducts.map((product) => {
    const mockHistoryObj = product.history.map((p: number, index: number) => ({
      date: `2026-09-${index + 1}`,
      price: p,
      originalPrice: product.originalPrice
    }));

    const isFake = detectFakeDiscount(product.originalPrice, mockHistoryObj);
    const recommendation = getBuyRecommendation(product.currentPrice, mockHistoryObj);

    // Ghi đè kết quả của AI vào data trả về
    return {
      ...product,
      recommendation: isFake ? 'gia-ao' : recommendation.label === 'MUA NGAY' ? 'mua-ngay' : 'doi-them',
      reason: recommendation.reason
    };
  });

  // 3. Trả dữ liệu đã được AI phân tích về cho Frontend
  return NextResponse.json(processedProducts);
}
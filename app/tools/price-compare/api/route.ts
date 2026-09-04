import { NextResponse } from 'next/server';
import { analyzeWithGemini } from '../_algorithms/priceLogic';
import { products as rawProducts } from '../_data/mockProducts';

export async function GET() {
  // Lặp qua mảng rawProducts và gọi Gemini cho từng sản phẩm
  const processedProducts = await Promise.all(
    rawProducts.map(async (product) => {
      
      // Giả lập mảng history object giống file cũ của bạn
      const mockHistoryObj = product.history.map((p: number, index: number) => ({
        date: `2026-09-${index + 1}`,
        price: p,
        originalPrice: product.originalPrice
      }));

      // Gọi AI phân tích
      const aiAnalysis = await analyzeWithGemini(
        product.name, 
        product.currentPrice, 
        product.originalPrice, 
        mockHistoryObj
      );

      // Gắn kết quả AI vào sản phẩm để trả về cho UI
      return {
        ...product,
        recommendation: aiAnalysis.recommendation,
        reason: aiAnalysis.reason
      };
    })
  );

  return NextResponse.json(processedProducts);
}
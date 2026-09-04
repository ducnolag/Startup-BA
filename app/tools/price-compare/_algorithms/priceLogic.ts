import { geminiModel } from '@/lib/gemini';

export async function analyzeWithGemini(productName: string, currentPrice: number, originalPrice: number, history: any[]) {
  // Trích xuất mảng giá 30 ngày để nạp cho Gemini
  const priceHistoryStr = history.map(h => h.price).join(', ');

  const prompt = `
    Bạn là trợ lý mua sắm AI. Hãy phân tích sản phẩm sau:
    - Tên: ${productName}
    - Giá hiện tại: ${currentPrice} VNĐ
    - Giá gốc niêm yết: ${originalPrice} VNĐ
    - Lịch sử giá 30 ngày qua: [${priceHistoryStr}]

    Nhiệm vụ:
    1. So sánh giá hiện tại với lịch sử để xem có phải "giá ảo" (nâng giá gốc lên rồi sale giả) không.
    2. Đưa ra lời khuyên cho người dùng (chỉ được chọn 1 trong 3 trạng thái: 'mua-ngay', 'doi-them', 'gia-ao').
    
    TRẢ VỀ ĐÚNG CẤU TRÚC JSON SAU:
    {
      "recommendation": "mua-ngay" | "doi-them" | "gia-ao",
      "reason": "Giải thích lý do ngắn gọn dưới 25 chữ",
      "isFakeSale": boolean
    }
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const textResponse = result.response.text();
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Lỗi Gemini:", error);
    // Fallback an toàn nếu API lỗi
    return { recommendation: 'doi-them', reason: 'Hệ thống AI đang bận, vui lòng thử lại sau.', isFakeSale: false };
  }
}
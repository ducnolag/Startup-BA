export type Product = {
  id: string;
  name: string;
  category: 'laptop' | 'phone' | 'audio' | 'camera' | 'wearable' | 'gaming';
  brand: string;
  image: string; // emoji placeholder
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  rating: number;
  reviewCount: number;
  history: number[]; // 30-day price history
  stores: { name: string; price: number; inStock: boolean }[];
  recommendation: 'mua-ngay' | 'doi-them' | 'gia-ao';
  reason: string;
};
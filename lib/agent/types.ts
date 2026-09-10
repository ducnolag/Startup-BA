// =====================================================================
// Shopping Agent — Shared TypeScript types
// =====================================================================
// These types mirror the Python backend (vn-backend.ts) and the
// commerce-agents presentation layer (present_products, present_comparison, etc.)
// =====================================================================

import type { Product, CartItem, Cart } from '@/lib/storefront/vn-backend';

// Re-export for consumers
export type { Product, CartItem, Cart };

// ---------------------------------------------------------------------------
// Agent SSE event types
// ---------------------------------------------------------------------------

export type AgentEvent =
  | { type: 'text_delta'; delta: string }
  | { type: 'present_products'; products: Product[] }
  | { type: 'present_comparison'; products: Product[]; bestPickIndex: number }
  | { type: 'cart_update'; cart: Cart }
  | { type: 'turn_complete'; usage: { input_tokens: number; output_tokens: number } }
  | { type: 'error'; message: string };

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface ProductCardProps {
  product: Product;
  isBestPrice?: boolean;
  tiltEnabled?: boolean;
  onSelect?: (product: Product) => void;
}

export interface ComparisonTableProps {
  products: Product[];
  bestPickIndex?: number;
  showDelta?: boolean;
  tiltEnabled?: boolean;
}

export interface CartPanelProps {
  open: boolean;
  cart: Cart;
  onClose: () => void;
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onRemove: (product_id: string) => void;
}

export interface AgentStreamHandlerProps {
  message: string;
  onComplete?: (result: AgentEvent[]) => void;
  onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// UI state types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  products?: Product[];
  comparisonProducts?: Product[];
  comparisonBestIndex?: number;
}

export interface ChatState {
  messages: ChatMessage[];
  cart: Cart;
  isLoading: boolean;
}

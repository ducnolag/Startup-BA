'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Send, ShoppingCart, X, Bot, User } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import ProductCard from '@/components/agent/ProductCard';
import ComparisonTable from '@/components/agent/ComparisonTable';
import CartPanel from '@/components/agent/CartPanel';
import AgentStreamHandler from '@/components/agent/AgentStreamHandler';
import type { Product, Cart } from '@/lib/storefront/vn-backend';
import type { ChatMessage } from '@/lib/agent/types';
import { cn } from '@/lib/utils';

export default function AgentPage() {
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAgentText, setCurrentAgentText] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [displayedComparison, setDisplayedComparison] = useState<{
    products: Product[];
    bestIndex: number;
  } | null>(null);
  const [cart, setCart] = useState<Cart>({
    items: [],
    currency: 'VND',
    subtotal: 0,
    item_count: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.to(chatContainerRef.current, {
        scrollTop: chatContainerRef.current.scrollHeight,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [chatMessages, currentAgentText, displayedProducts, displayedComparison]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    // Clear input and set loading
    setInputValue('');
    setIsLoading(true);
    setPendingMessage(message);
    setCurrentAgentText('');
    setDisplayedProducts([]);
    setDisplayedComparison(null);
  }, [inputValue, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Agent stream handlers
  const handleTextDelta = useCallback((delta: string) => {
    setCurrentAgentText((prev) => prev + delta);
  }, []);

  const handleProducts = useCallback((products: Product[]) => {
    setDisplayedProducts(products);
  }, []);

  const handleComparison = useCallback((products: Product[], bestIndex: number) => {
    setDisplayedComparison({ products, bestIndex });
  }, []);

  const handleCartUpdate = useCallback((newCart: Cart) => {
    setCart(newCart);
    setIsCartOpen(true);
  }, []);

  const handleTurnComplete = useCallback(() => {
    // Save agent message to chat history
    if (currentAgentText.trim()) {
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: currentAgentText,
        timestamp: new Date(),
        products: displayedProducts.length > 0 ? displayedProducts : undefined,
        comparisonProducts: displayedComparison?.products,
        comparisonBestIndex: displayedComparison?.bestIndex,
      };
      setChatMessages((prev) => [...prev, agentMessage]);
    }
    setCurrentAgentText('');
    setIsLoading(false);
    setPendingMessage(null);
  }, [currentAgentText, displayedProducts, displayedComparison]);

  const handleStreamError = useCallback((error: string) => {
    setCurrentAgentText((prev) => prev + `\n[Lỗi: ${error}]`);
    setIsLoading(false);
    setPendingMessage(null);
  }, []);

  // Cart handlers
  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const items = prev.items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
      return { ...prev, items, subtotal, item_count };
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const items = prev.items.filter((item) => item.product_id !== productId);
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
      return { ...prev, items, subtotal, item_count };
    });
  }, []);

  const handleCheckout = useCallback(() => {
    // Placeholder for checkout flow
    alert('Tính năng thanh toán đang được phát triển. Cảm ơn bạn!');
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product_id === product.product_id);
      let items;
      if (existing) {
        items = prev.items.map((i) =>
          i.product_id === product.product_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        items = [
          ...prev.items,
          {
            product_id: product.product_id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image_url: product.image_url,
          },
        ];
      }
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
      return { ...prev, items, subtotal, item_count };
    });
    setIsCartOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      {/* Header */}
      <Navigation />

      {/* Main content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-16">
        {/* Chat header */}
        <div className="bg-white border-b border-line px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-ink">Toolify Agent</h1>
              <p className="text-[10px] text-ink-subtle">Tư vấn mua sắm thông minh</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-surface-muted transition-colors"
            aria-label="Mở giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5 text-ink-muted" />
            {cart.item_count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.item_count}
              </span>
            )}
          </button>
        </div>

        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        >
          {/* Welcome message */}
          {chatMessages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto mb-4 flex items-center justify-center">
                <Bot className="w-8 h-8 text-brand" />
              </div>
              <h2 className="text-lg font-semibold text-ink mb-2">
                Xin chào! Tôi là Agent của Toolify
              </h2>
              <p className="text-sm text-ink-muted max-w-md mx-auto">
                Tôi có thể giúp bạn tìm kiếm và so sánh giá sản phẩm trên các sàn thương mại điện tử
                lớn tại Việt Nam. Hãy hỏi tôi về bất kỳ sản phẩm nào bạn quan tâm!
              </p>
            </div>
          )}

          {/* Chat messages */}
          {chatMessages.map((msg) => (
            <div key={msg.id}>
              {/* User message */}
              {msg.role === 'user' && (
                <div className="flex justify-end mb-4">
                  <div className="max-w-[80%] bg-brand text-white px-4 py-2 rounded-2xl rounded-br-md">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              )}

              {/* Agent message */}
              {msg.role === 'agent' && (
                <div className="space-y-4">
                  {/* Text content */}
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                      <div className="w-7 h-7 rounded-full bg-brand/10 shrink-0 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <div className="bg-white border border-line px-4 py-2 rounded-2xl rounded-tl-md">
                        <p className="text-sm text-ink whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products grid */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="ml-9">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {msg.products.map((product) => (
                          <ProductCard
                            key={product.product_id}
                            product={product}
                            tiltEnabled={true}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comparison table */}
                  {msg.comparisonProducts && msg.comparisonProducts.length > 0 && (
                    <div className="ml-9">
                      <ComparisonTable
                        products={msg.comparisonProducts}
                        bestPickIndex={msg.comparisonBestIndex}
                        showDelta={true}
                        tiltEnabled={true}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Current agent response (streaming) */}
          {isLoading && (
            <div className="space-y-4">
              {/* Streaming text */}
              {currentAgentText && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-brand/10 shrink-0 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <div className="bg-white border border-line px-4 py-2 rounded-2xl rounded-tl-md">
                      <p className="text-sm text-ink whitespace-pre-wrap">{currentAgentText}</p>
                      <span className="inline-block w-2 h-4 bg-brand ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming products */}
              {displayedProducts.length > 0 && (
                <div className="ml-9">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product.product_id}
                        product={product}
                        tiltEnabled={true}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Streaming comparison */}
              {displayedComparison && displayedComparison.products.length > 0 && (
                <div className="ml-9">
                  <ComparisonTable
                    products={displayedComparison.products}
                    bestPickIndex={displayedComparison.bestIndex}
                    showDelta={true}
                    tiltEnabled={true}
                  />
                </div>
              )}

              {/* Loading indicator */}
              {!currentAgentText && displayedProducts.length === 0 && !displayedComparison && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-brand/10 shrink-0 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <div className="bg-white border border-line px-4 py-3 rounded-2xl rounded-tl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-line px-4 py-4">
          <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi về sản phẩm bạn quan tâm..."
              className="flex-1 resize-none rounded-xl border border-line bg-surface-muted px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'shrink-0 p-3 rounded-xl transition-all',
                inputValue.trim() && !isLoading
                  ? 'bg-brand text-white hover:bg-brand/90'
                  : 'bg-surface-muted text-ink-subtle'
              )}
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-ink-subtle text-center mt-2">
            Agent có thể sai. Hãy kiểm chứng thông tin trước khi mua.
          </p>
        </div>
      </main>

      {/* Cart panel */}
      <CartPanel
        open={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Agent stream handler */}
      {pendingMessage && (
        <AgentStreamHandler
          message={pendingMessage}
          onTextDelta={handleTextDelta}
          onProducts={handleProducts}
          onComparison={handleComparison}
          onCartUpdate={handleCartUpdate}
          onComplete={handleTurnComplete}
          onError={handleStreamError}
          enabled={isLoading}
        />
      )}
    </div>
  );
}

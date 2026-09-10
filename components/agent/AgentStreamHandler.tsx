'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AgentEvent, Product, Cart } from '@/lib/agent/types';

interface AgentStreamHandlerProps {
  message: string;
  onComplete?: (result: AgentEvent[]) => void;
  onError?: (error: string) => void;
  onTextDelta?: (delta: string) => void;
  onProducts?: (products: Product[]) => void;
  onComparison?: (products: Product[], bestIndex: number) => void;
  onCartUpdate?: (cart: Cart) => void;
  enabled?: boolean;
}

export default function AgentStreamHandler({
  message,
  onComplete,
  onError,
  onTextDelta,
  onProducts,
  onComparison,
  onCartUpdate,
  enabled = true,
}: AgentStreamHandlerProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventsRef = useRef<AgentEvent[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async () => {
    if (!message.trim() || !enabled) return;

    // Reset state
    setIsStreaming(true);
    setError(null);
    eventsRef.current = [];

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/agent/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check for SSE content type
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream')) {
        // Try to parse as JSON (fallback for non-streaming response)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setIsStreaming(false);
        return;
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const event: AgentEvent = JSON.parse(data);
              eventsRef.current.push(event);

              // Handle event types
              switch (event.type) {
                case 'text_delta':
                  onTextDelta?.(event.delta);
                  break;
                case 'present_products':
                  onProducts?.(event.products);
                  break;
                case 'present_comparison':
                  onComparison?.(event.products, event.bestPickIndex);
                  break;
                case 'cart_update':
                  onCartUpdate?.(event.cart);
                  break;
                case 'turn_complete':
                  onComplete?.(eventsRef.current);
                  break;
                case 'error':
                  setError(event.message);
                  onError?.(event.message);
                  break;
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE event:', data, parseError);
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6).trim();
        if (data) {
          try {
            const event: AgentEvent = JSON.parse(data);
            eventsRef.current.push(event);
            if (event.type === 'error') {
              setError(event.message);
              onError?.(event.message);
            } else if (event.type === 'turn_complete') {
              onComplete?.(eventsRef.current);
            }
          } catch {
            // Ignore parse errors for final buffer
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Stream was cancelled, not an error
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsStreaming(false);
    }
  }, [message, enabled, onComplete, onError, onTextDelta, onProducts, onComparison, onCartUpdate]);

  // Trigger stream when message changes
  useEffect(() => {
    if (enabled && message) {
      startStream();
    }

    // Cleanup on unmount or when message changes
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [message, enabled, startStream]);

  // Expose cancel function
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook for managing agent streaming state
export function useAgentStream() {
  const [messages, setMessages] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [comparisonBestIndex, setComparisonBestIndex] = useState<number>(0);
  const [cart, setCart] = useState<Cart>({ items: [], currency: 'VND', subtotal: 0, item_count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback((message: string) => {
    setIsLoading(true);
    setError(null);
    setMessages((prev) => prev + message + '\n');
  }, []);

  const handleTextDelta = useCallback((delta: string) => {
    setMessages((prev) => prev + delta);
  }, []);

  const handleProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
  }, []);

  const handleComparison = useCallback((prods: Product[], bestIdx: number) => {
    setComparisonProducts(prods);
    setComparisonBestIndex(bestIdx);
  }, []);

  const handleCartUpdate = useCallback((newCart: Cart) => {
    setCart(newCart);
  }, []);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages('');
    setProducts([]);
    setComparisonProducts([]);
  }, []);

  return {
    messages,
    products,
    comparisonProducts,
    comparisonBestIndex,
    cart,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    streamHandlerProps: {
      onTextDelta: handleTextDelta,
      onProducts: handleProducts,
      onComparison: handleComparison,
      onCartUpdate: handleCartUpdate,
      onComplete: handleComplete,
      onError: handleError,
    },
  };
}
